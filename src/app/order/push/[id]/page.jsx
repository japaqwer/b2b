"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import s from "./OrderPush.module.scss";

export default function OrderPushPage() {
  const params = useParams();
  const orderCode = params.id;

  const telegramText = `Мой заказ ${orderCode}`;
  const whatsappText = `Мой заказ ${orderCode}`;

  const handleCopy = () => {
    const textToCopy = `Мой заказ ${orderCode}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {})
      .catch((err) => {
        console.error("Ошибка при копировании:", err);

        // Fallback для старых браузеров
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      });
  };

  return (
    <div className={s.center}>
      <div className={s.infoCard}>
        <p className={s.infoParagraph}>
          <strong>Ваш заказ №</strong>
        </p>
        <div
          className={s.orderCode}
          onClick={handleCopy}
          title="Нажмите для копирования"
        >
          <span className={s.orderCodeText}>{orderCode}</span>
        </div>

        <p className={s.h3}>
          Нажмите на номер заказа, чтобы <br /> его скопировать и отправить
          удобным <br />
          способом для получения открытки
        </p>
      </div>
      <div className={s.flex}>
        <Link
          href={`https://t.me/muzOkkk?text=${encodeURIComponent(telegramText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={s.buttonBlue}
        >
          В Телеграм
        </Link>

        <Link
          href={`https://wa.me/79151340402?text=${encodeURIComponent(
            whatsappText
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={s.buttonGreen}
        >
          На Whatsapp
        </Link>
      </div>
    </div>
  );
}
