// SimplePhotoEditor.jsx
"use client";
import {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

const SimplePhotoEditor = forwardRef(
  (
    {
      stageRef,
      imageRef,
      transformerRef,
      bgImage,
      userImage,
      coverImage,
      selectedId,
      setSelectedId,
      onTransformEnd,
      shouldRenderCover = true,
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    // Коэффициент масштабирования для высокого качества
    const QUALITY_SCALE = 3; // 3x разрешение для редактирования

    const [stageDimensions, setStageDimensions] = useState({
      width: 640,
      height: 360,
    });

    const [images, setImages] = useState({
      user: null,
      bg: null,
      cover: null,
    });

    // Состояние трансформации изображения
    const [imageTransform, setImageTransform] = useState({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      width: 0,
      height: 0,
    });

    // Для перетаскивания
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Для pinch-zoom
    const lastCenter = useRef(null);
    const lastDist = useRef(0);
    const isPinching = useRef(false);

    const calculateStageDimensions = () => {
      if (typeof window === "undefined") return { width: 640, height: 360 };

      const windowWidth = window.innerWidth;

      if (windowWidth <= 500) {
        const width = Math.min(windowWidth - 40, 640);
        const height = (width * 9) / 16;
        return { width: Math.round(width), height: Math.round(height) };
      } else if (windowWidth <= 768) {
        const width = Math.min(windowWidth - 60, 640);
        const height = (width * 9) / 16;
        return { width: Math.round(width), height: Math.round(height) };
      } else {
        return { width: 640, height: 360 };
      }
    };

    // Обновление размеров
    useEffect(() => {
      const updateDimensions = () => {
        const dimensions = calculateStageDimensions();
        setStageDimensions(dimensions);
      };

      updateDimensions();

      let timeoutId;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateDimensions, 150);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(timeoutId);
      };
    }, []);

    // Блокировка масштабирования страницы
    useEffect(() => {
      const preventDefault = (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      const preventDefaultWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };

      const container = containerRef.current;
      if (container) {
        container.addEventListener("touchstart", preventDefault, {
          passive: false,
        });
        container.addEventListener("touchmove", preventDefault, {
          passive: false,
        });
        container.addEventListener("wheel", preventDefaultWheel, {
          passive: false,
        });
      }

      return () => {
        if (container) {
          container.removeEventListener("touchstart", preventDefault);
          container.removeEventListener("touchmove", preventDefault);
          container.removeEventListener("wheel", preventDefaultWheel);
        }
      };
    }, []);

    // Загрузка изображений в высоком качестве
    useEffect(() => {
      const loadImage = (src) => {
        return new Promise((resolve) => {
          if (!src) {
            resolve(null);
            return;
          }

          const img = new Image();
          img.crossOrigin = "anonymous";

          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error("Ошибка загрузки изображения:", src);
            resolve(null);
          };

          if (src instanceof HTMLImageElement) {
            img.src = src.src;
          } else if (typeof src === "string") {
            img.src = src;
          } else {
            resolve(null);
          }
        });
      };

      Promise.all([
        loadImage(userImage),
        loadImage(bgImage),
        loadImage(coverImage),
      ]).then(([user, bg, cover]) => {
        setImages({ user, bg, cover });
      });
    }, [userImage, bgImage, coverImage]);

    // Позиционируем пользовательское изображение
    useEffect(() => {
      if (images.user && stageDimensions.width && stageDimensions.height) {
        const imgWidth = images.user.width;
        const imgHeight = images.user.height;

        const scale = Math.min(
          (stageDimensions.width * 0.8) / imgWidth,
          (stageDimensions.height * 0.8) / imgHeight
        );

        const x = (stageDimensions.width - imgWidth * scale) / 2;
        const y = (stageDimensions.height - imgHeight * scale) / 2;

        setImageTransform({
          x,
          y,
          scaleX: scale,
          scaleY: scale,
          width: imgWidth,
          height: imgHeight,
        });
      }
    }, [images.user, stageDimensions]);

    // Отрисовка canvas в высоком качестве
    const drawCanvas = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });

      // Устанавливаем высокое разрешение для canvas
      const displayWidth = stageDimensions.width;
      const displayHeight = stageDimensions.height;

      canvas.width = displayWidth * QUALITY_SCALE;
      canvas.height = displayHeight * QUALITY_SCALE;

      // Включаем сглаживание для лучшего качества
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Масштабируем контекст для высокого разрешения
      ctx.scale(QUALITY_SCALE, QUALITY_SCALE);

      // Белый фон
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // 1. Фон (если есть) - высокое качество

      // 2. Пользовательское изображение - высокое качество
      if (images.user && imageTransform.width > 0) {
        ctx.save();
        ctx.drawImage(
          images.user,
          imageTransform.x,
          imageTransform.y,
          imageTransform.width * imageTransform.scaleX,
          imageTransform.height * imageTransform.scaleY
        );
        ctx.restore();
      }
      if (images.bg) {
        ctx.drawImage(images.bg, 0, 0, displayWidth, displayHeight);
      }

      // 3. Обложка - высокое качество
      if (shouldRenderCover && images.cover) {
        ctx.drawImage(images.cover, 0, 0, displayWidth, displayHeight);
      }
    };

    useEffect(() => {
      drawCanvas();
    }, [images, stageDimensions, imageTransform, shouldRenderCover]);

    // Утилиты для pinch-zoom
    const getDistance = (p1, p2) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    const getCenter = (p1, p2) => {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    };

    // Получение координат с учетом масштаба canvas
    const getCanvasCoordinates = (clientX, clientY) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = stageDimensions.width / rect.width;
      const scaleY = stageDimensions.height / rect.height;

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    // Обработчики мыши для перетаскивания
    const handleMouseDown = (e) => {
      if (!images.user) return;

      const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

      const imgLeft = imageTransform.x;
      const imgTop = imageTransform.y;
      const imgRight = imgLeft + imageTransform.width * imageTransform.scaleX;
      const imgBottom = imgTop + imageTransform.height * imageTransform.scaleY;

      if (x >= imgLeft && x <= imgRight && y >= imgTop && y <= imgBottom) {
        isDragging.current = true;
        dragStart.current = {
          x: x - imageTransform.x,
          y: y - imageTransform.y,
        };
        canvasRef.current.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);

      setImageTransform((prev) => ({
        ...prev,
        x: x - dragStart.current.x,
        y: y - dragStart.current.y,
      }));

      if (onTransformEnd) {
        onTransformEnd();
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
    };

    // Обработчик колесика мыши для зума
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!images.user) return;

      const scaleBy = 1.05;
      const { x: mouseX, y: mouseY } = getCanvasCoordinates(
        e.clientX,
        e.clientY
      );

      const oldScaleX = imageTransform.scaleX;

      const mousePointTo = {
        x: (mouseX - imageTransform.x) / oldScaleX,
        y: (mouseY - imageTransform.y) / oldScaleX,
      };

      const newScale = e.deltaY < 0 ? oldScaleX * scaleBy : oldScaleX / scaleBy;
      const clampedScale = Math.max(0.1, Math.min(newScale, 10));

      setImageTransform((prev) => ({
        ...prev,
        scaleX: clampedScale,
        scaleY: clampedScale,
        x: mouseX - mousePointTo.x * clampedScale,
        y: mouseY - mousePointTo.y * clampedScale,
      }));

      if (onTransformEnd) {
        onTransformEnd();
      }
    };

    // Обработчики touch для мобильных
    const handleTouchStart = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      if (touch1 && touch2) {
        // Pinch zoom
        isPinching.current = true;

        const p1 = getCanvasCoordinates(touch1.clientX, touch1.clientY);
        const p2 = getCanvasCoordinates(touch2.clientX, touch2.clientY);

        lastCenter.current = getCenter(p1, p2);
        lastDist.current = getDistance(p1, p2);
      } else if (touch1) {
        // Single touch drag
        isPinching.current = false;
        const { x, y } = getCanvasCoordinates(touch1.clientX, touch1.clientY);

        const imgLeft = imageTransform.x;
        const imgTop = imageTransform.y;
        const imgRight = imgLeft + imageTransform.width * imageTransform.scaleX;
        const imgBottom =
          imgTop + imageTransform.height * imageTransform.scaleY;

        if (x >= imgLeft && x <= imgRight && y >= imgTop && y <= imgBottom) {
          isDragging.current = true;
          dragStart.current = {
            x: x - imageTransform.x,
            y: y - imageTransform.y,
          };
        }
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      if (touch1 && touch2 && isPinching.current) {
        // Pinch zoom
        const p1 = getCanvasCoordinates(touch1.clientX, touch1.clientY);
        const p2 = getCanvasCoordinates(touch2.clientX, touch2.clientY);

        const newCenter = getCenter(p1, p2);
        const dist = getDistance(p1, p2);

        if (!lastCenter.current || !lastDist.current) {
          lastCenter.current = newCenter;
          lastDist.current = dist;
          return;
        }

        const pointTo = {
          x: (newCenter.x - imageTransform.x) / imageTransform.scaleX,
          y: (newCenter.y - imageTransform.y) / imageTransform.scaleX,
        };

        const scale = imageTransform.scaleX * (dist / lastDist.current);
        const clampedScale = Math.max(0.1, Math.min(scale, 10));

        const dx = newCenter.x - lastCenter.current.x;
        const dy = newCenter.y - lastCenter.current.y;

        setImageTransform((prev) => ({
          ...prev,
          scaleX: clampedScale,
          scaleY: clampedScale,
          x: newCenter.x - pointTo.x * clampedScale + dx,
          y: newCenter.y - pointTo.y * clampedScale + dy,
        }));

        lastDist.current = dist;
        lastCenter.current = newCenter;
      } else if (touch1 && isDragging.current && !isPinching.current) {
        // Single touch drag
        const { x, y } = getCanvasCoordinates(touch1.clientX, touch1.clientY);

        setImageTransform((prev) => ({
          ...prev,
          x: x - dragStart.current.x,
          y: y - dragStart.current.y,
        }));
      }

      if (onTransformEnd) {
        onTransformEnd();
      }
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      e.stopPropagation();

      isPinching.current = false;
      isDragging.current = false;
      lastCenter.current = null;
      lastDist.current = 0;
    };

    // Привязка к stageRef для экспорта
    useEffect(() => {
      if (stageRef) {
        stageRef.current = {
          width: () => stageDimensions.width,
          height: () => stageDimensions.height,
          getLayers: () => [
            {
              getCanvas: () => ({
                _canvas: canvasRef.current,
              }),
            },
          ],
        };
      }

      if (imageRef) {
        imageRef.current = {
          setAttrs: () => {},
          scaleX: () => imageTransform.scaleX,
          scaleY: () => imageTransform.scaleY,
          x: () => imageTransform.x,
          y: () => imageTransform.y,
        };
      }
    }, [stageDimensions, imageTransform]);

    // Метод экспорта в высоком разрешении (1920x1080)
    const exportHighRes = async () => {
      return new Promise((resolve) => {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;
        const ctx = exportCanvas.getContext("2d", {
          alpha: false,
        });

        // Максимальное качество для экспорта
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const scaleX = 1920 / stageDimensions.width;
        const scaleY = 1080 / stageDimensions.height;

        // Белый фон
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 1920, 1080);

        // 1. Фон в высоком качестве

        // 2. Пользовательское изображение в высоком качестве
        if (images.user && imageTransform.width > 0) {
          ctx.save();
          ctx.drawImage(
            images.user,
            imageTransform.x * scaleX,
            imageTransform.y * scaleY,
            imageTransform.width * imageTransform.scaleX * scaleX,
            imageTransform.height * imageTransform.scaleY * scaleY
          );
          ctx.restore();
        }

        if (images.bg) {
          ctx.drawImage(images.bg, 0, 0, 1920, 1080);
        }

        // 3. Обложка в высоком качестве
        if (shouldRenderCover && images.cover) {
          ctx.drawImage(images.cover, 0, 0, 1920, 1080);
        }

        resolve(exportCanvas.toDataURL("image/png", 1.0));
      });
    };

    useImperativeHandle(ref, () => ({
      exportHighRes,
    }));

    return (
      <div
        ref={containerRef}
        style={{
          width: stageDimensions.width,
          height: stageDimensions.height,
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          touchAction: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            cursor: images.user ? "grab" : "default",
            touchAction: "none",
            imageRendering: "high-quality",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    );
  }
);

SimplePhotoEditor.displayName = "SimplePhotoEditor";

export default SimplePhotoEditor;
