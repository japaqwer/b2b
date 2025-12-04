import React from "react";
import s from "./Contact.module.scss";
import Link from "next/link";

export default function Contact() {
  return (
    <div className={s.main}>
      <h1>Контакты</h1>
      <p>
        Для оперативной связи с нами пишите нам на WhatsApp или в Telegram. Так
        же можно отправить письмо на почту
        <Link target="_blanck" href={`mailto:muzok.online@yandex.ru`}>
          muzok.online@yandex.ru
        </Link>
      </p>
      <p>
        Оператор ответит на ваш вопрос в рабочее время с 09.00 до 21.00 по Мск.
      </p>
    </div>
  );
}
