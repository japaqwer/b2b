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

      // Добавляем обработчики на контейнер
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

    // Загрузка изображений
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

    // Позиционируем пользовательское изображение (как в Konva)
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

    // Отрисовка canvas
    const drawCanvas = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = stageDimensions.width;
      canvas.height = stageDimensions.height;

      // Очистка - белый фон
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Пользовательское изображение (z-index: 0 - выше фона)
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

      // 1. Фон (если есть)
      if (images.bg) {
        ctx.drawImage(images.bg, 0, 0, canvas.width, canvas.height);
      }
      // 3. Обложка (z-index: 1 - самый верх)
      if (shouldRenderCover && images.cover) {
        ctx.drawImage(images.cover, 0, 0, canvas.width, canvas.height);
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

    // Обработчики мыши для перетаскивания
    const handleMouseDown = (e) => {
      if (!images.user) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Проверяем, попали ли в область изображения
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

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

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
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const oldScaleX = imageTransform.scaleX;

      const mousePointTo = {
        x: (mouseX - imageTransform.x) / oldScaleX,
        y: (mouseY - imageTransform.y) / oldScaleX,
      };

      const newScale = e.deltaY < 0 ? oldScaleX * scaleBy : oldScaleX / scaleBy;

      // Убираем минимальное ограничение, оставляем только максимальное
      const clampedScale = Math.min(newScale, 10);

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

        const rect = canvasRef.current.getBoundingClientRect();
        const p1 = {
          x: touch1.clientX - rect.left,
          y: touch1.clientY - rect.top,
        };
        const p2 = {
          x: touch2.clientX - rect.left,
          y: touch2.clientY - rect.top,
        };

        lastCenter.current = getCenter(p1, p2);
        lastDist.current = getDistance(p1, p2);
      } else if (touch1) {
        // Single touch drag
        isPinching.current = false;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = touch1.clientX - rect.left;
        const y = touch1.clientY - rect.top;

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
        const rect = canvasRef.current.getBoundingClientRect();
        const p1 = {
          x: touch1.clientX - rect.left,
          y: touch1.clientY - rect.top,
        };
        const p2 = {
          x: touch2.clientX - rect.left,
          y: touch2.clientY - rect.top,
        };

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

        // Убираем минимальное ограничение, оставляем только максимальное
        const clampedScale = Math.min(scale, 10);

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
        const rect = canvasRef.current.getBoundingClientRect();
        const x = touch1.clientX - rect.left;
        const y = touch1.clientY - rect.top;

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

    // Метод экспорта в высоком разрешении
    const exportHighRes = async () => {
      return new Promise((resolve) => {
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = 1920;
        exportCanvas.height = 1080;
        const ctx = exportCanvas.getContext("2d");

        const scaleX = 1920 / stageDimensions.width;
        const scaleY = 1080 / stageDimensions.height;

        // Белый фон
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 1920, 1080);

        // 1. Пользовательское изображение (z-index: 0)
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

        // 2. Фон (если есть)
        if (images.bg) {
          ctx.drawImage(images.bg, 0, 0, 1920, 1080);
        }

        // 3. Обложка (z-index: 1 - если не экспортируем с ней)
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
