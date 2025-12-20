"use client";

import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import s from "./SplashEditor.module.scss";
import axios from "axios";

export function SplashEditor({ template, onCreate }) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const measureContext = useRef(null);

  const CANVAS_WIDTH = 640;
  const CANVAS_HEIGHT = 360;
  const BASE_FONT_SIZE = 32;

  const [texts, setTexts] = useState([]);
  const [editingTextId, setEditingTextId] = useState(null);
  const [editingTextValue, setEditingTextValue] = useState(
    `${template.title}` || ""
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Отслеживание изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newScaleFactor = 1;

      if (width <= 360) {
        newScaleFactor = 0.4;
      } else if (width <= 480) {
        newScaleFactor = 0.5;
      } else if (width <= 768) {
        newScaleFactor = 0.6;
      } else if (width <= 1024) {
        newScaleFactor = 0.8;
      } else {
        newScaleFactor = 1;
      }

      setScaleFactor(newScaleFactor);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    measureContext.current = document.createElement("canvas").getContext("2d");

    if (template.title) {
      setTimeout(() => {
        if (wrapperRef.current) {
          const wrap = wrapperRef.current;
          const fs = BASE_FONT_SIZE;
          const { width, height } = measureTextSize(`${template.title}`, fs);
          const id = Date.now();

          // Центрируем текст с учетом границ
          const safeX = Math.max(
            0,
            Math.min((wrap.clientWidth - width) / 2, wrap.clientWidth - width)
          );
          const safeY = Math.max(
            0,
            Math.min(
              (wrap.clientHeight - height) / 2,
              wrap.clientHeight - height
            )
          );

          setTexts([
            {
              id,
              text: `${template.title}`,
              x: safeX,
              y: safeY,
              fontSize: fs,
              width,
              height,
            },
          ]);
          setEditingTextId(id);
        }
      }, 100);
    }
  }, [template.title]);

  // Пересчет позиций и размеров при изменении scaleFactor
  useEffect(() => {
    if (texts.length > 0 && wrapperRef.current) {
      const wrap = wrapperRef.current;
      setTexts((prev) =>
        prev.map((t) => {
          const { width, height } = measureTextSize(t.text, t.fontSize);

          // Ограничиваем позицию текста в пределах контейнера
          const maxX = Math.max(0, wrap.clientWidth - width);
          const maxY = Math.max(0, wrap.clientHeight - height);
          const safeX = Math.max(
            0,
            Math.min((wrap.clientWidth - width) / 2, maxX)
          );
          const safeY = Math.max(
            0,
            Math.min((wrap.clientHeight - height) / 2, maxY)
          );

          return {
            ...t,
            width,
            height,
            x: safeX,
            y: safeY,
          };
        })
      );
    }
  }, [scaleFactor]);

  const measureTextSize = (text, fontSize) => {
    const ctx = measureContext.current;
    const actualFontSize = fontSize * scaleFactor;
    ctx.font = `700 ${actualFontSize}px Arco, sans-serif`;

    const lines = text.split("\n");
    const baseLineHeight = 38;
    const lineHeight = baseLineHeight * scaleFactor;

    // Учитываем максимальную ширину контейнера
    const maxContainerWidth = wrapperRef.current
      ? wrapperRef.current.clientWidth * 0.9
      : CANVAS_WIDTH * 0.9;

    const widths = lines.map((line) => {
      const measured = ctx.measureText(line || " ");
      return Math.min(measured.width + 32 * scaleFactor, maxContainerWidth);
    });

    const maxWidth = Math.max(...widths, 120 * scaleFactor);
    const height = lineHeight * lines.length + 24 * scaleFactor;

    return { width: maxWidth, height };
  };

  const handleEditingChange = (e) => {
    const val = e.target.value;
    setEditingTextValue(val);

    if (!wrapperRef.current) return;

    const wrap = wrapperRef.current;
    const fs = BASE_FONT_SIZE;
    const { width, height } = measureTextSize(val || " ", fs);

    // Ограничиваем позицию при изменении текста
    const maxX = Math.max(0, wrap.clientWidth - width);
    const maxY = Math.max(0, wrap.clientHeight - height);
    const safeX = Math.max(0, Math.min((wrap.clientWidth - width) / 2, maxX));
    const safeY = Math.max(0, Math.min((wrap.clientHeight - height) / 2, maxY));

    if (editingTextId == null) {
      const id = Date.now();
      setTexts([
        {
          id,
          text: val,
          x: safeX,
          y: safeY,
          fontSize: fs,
          width,
          height,
        },
      ]);
      setEditingTextId(id);
    } else {
      setTexts((prev) =>
        prev.map((t) => {
          if (t.id !== editingTextId) return t;
          return {
            ...t,
            text: val,
            fontSize: fs,
            width,
            height,
            x: safeX,
            y: safeY,
          };
        })
      );
    }
  };

  const captureText = async () => {
    if (!textRef.current) return null;
    const canvas = await html2canvas(textRef.current, {
      useCORS: true,
      backgroundColor: null,
      scale: 5,
      logging: false,
      allowTaint: true,
    });
    return canvas.toDataURL("image/png");
  };

  function dataURLtoFile(dataurl, filename) {
    const [header, b64] = dataurl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new File([arr], filename, { type: mime });
  }

  const handleCreate = async () => {
    if (!isConfirmed) {
      setIsConfirmed(true);
      return;
    }

    const dataUrl = await captureText();
    if (dataUrl) {
      try {
        const formData = new FormData();
        const introFile = dataURLtoFile(dataUrl, "intro.png");
        formData.append("intro", introFile);

        const response = await axios.post(
          "https://api-workhub.site/api/v1/base/order/upload-files",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const uploadedIntro = response.data.data.intro_file_name;
        localStorage.setItem("uploadedIntro", JSON.stringify(uploadedIntro));
        onCreate(dataUrl);
      } catch (error) {
        console.error("Failed to upload intro:", error);
        onCreate(dataUrl);
      }
    }
  };

  const handleEdit = () => {
    setIsConfirmed(false);
  };

  return (
    <div className="center">
      <div className={s.previewBox}>
        <div
          ref={wrapperRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            userSelect: "none",
          }}
        >
          <img
            src={template?.intro}
            alt="background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            ref={textRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {texts.map((item) => (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                  zIndex: 100,
                }}
              >
                <div className={s.divqwe}>
                  <div
                    className={s.textspan}
                    style={{
                      fontSize: item.fontSize * scaleFactor,
                      lineHeight: `${38 * scaleFactor}px`,
                      padding: `${12 * scaleFactor}px ${16 * scaleFactor}px`,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className={s.h21} style={{ color: "#000" }}>
        Проверьте еще раз, все ли правильно?
      </h2>

      <div className="center">
        {!isConfirmed ? (
          <div className={s.editorContainer}>
            <textarea
              className={s.inputName}
              value={editingTextValue}
              onChange={handleEditingChange}
              placeholder="Введите текст заставки"
              rows={3}
            />
            <button className="buttongreen" onClick={handleCreate}>
              Далее
            </button>
          </div>
        ) : (
          <div className={s.confirmContainer}>
            <div className={s.buttonGroup}>
              <button className="button" onClick={handleEdit}>
                Нет
              </button>
              <button className="buttongreen" onClick={handleCreate}>
                Да
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
