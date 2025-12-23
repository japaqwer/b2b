import React from "react";
import s from "./FAQ.module.scss";
import Link from "next/link";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";

export default function FAQ() {
  return (
    <div className={s.fAQ}>
      <h2>Если есть вопрос</h2>
      <h4>Напишите нам, постараемся помочь</h4>
      <div className={s.flex}>
        <Link
          href={"https://t.me/multfamilyoficial"}
          target="_blank"
          className={s.tel}
        >
          <FaTelegramPlane size={40} />
        </Link>
        <Link
          href={
            "https://max.ru/u/f9LHodD0cOIvvBc324-X595C6YvIndV9z_druzO6stb6rcfIXFRqqsgvttU"
          }
          target="_blank"
          className={s.tel}
        >
          <img src="/assets/images/MAX logo.png" alt="max" />
        </Link>
      </div>
    </div>
  );
}
