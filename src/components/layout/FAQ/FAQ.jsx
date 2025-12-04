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
          href={"https://wa.me/79151340402"}
          target="_blank"
          className={s.wat}
        >
          <FaWhatsapp size={40} />
        </Link>
        <Link href={"https://t.me/muzOkkk"} target="_blank" className={s.tel}>
          <FaTelegramPlane size={40} />
        </Link>
      </div>
    </div>
  );
}
