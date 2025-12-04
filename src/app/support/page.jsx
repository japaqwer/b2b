import React from "react";
import s from "./Support.module.scss";
import Link from "next/link";

export default function Support() {
  return (
    <div className={s.main}>
      <h1>Служба поддержки</h1>
      <p>
        Дорогие посетители, если у Вас возникли любые вопросы по поводу работы
        сайта, шаблонов открыток, загрузки фото и т.д. свяжитесь с оператором
        поддержки одним из способов представленных ниже.
      </p>
      <p>
        Оператор ответит на ваш вопрос в рабочее время с 09.00 до 21.00 по Мск.
      </p>
    </div>
  );
}
