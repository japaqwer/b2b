import React from "react";
import Link from "next/link";
import s from "./Footer.module.scss";

const FOOTER_COLUMNS = [
  {
    title: null,
    links: [{ label: "Политика конфиденциальности", href: "/privacy" }],
  },
  {
    title: null,
    links: [{ label: "Пользовательское соглашение", href: "/privacypolicy" }],
  },
  {
    title: null,
    links: [{ label: "Служба поддержки", href: "/support" }],
  },
  {
    title: null,
    links: [{ label: "Контакты", href: "/contact" }],
  },
];

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.content}>
          <div className={s.logoSection}>
            <Link href="/">
              <img
                src="/assets/images/footer_logo_1.webp"
                alt="DATKI"
                className={s.logoImg}
              />
            </Link>
          </div>
          <div className={s.linksWrapper}>
            {FOOTER_COLUMNS.map((column, index) => (
              <div key={index} className={s.column}>
                {column.title && (
                  <h3 className={s.columnTitle}>{column.title}</h3>
                )}

                {column.links && (
                  <ul className={s.linksList}>
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span className={s.link}>{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {column.description && (
                  <p className={s.description}>
                    {column.description.split("Правилам").map((part, i) =>
                      i === 0 ? (
                        part
                      ) : (
                        <span key={i}>
                          <Link href="/copy-rules">
                            <span className={s.link}>Правилам</span>
                          </Link>
                          {part}
                        </span>
                      )
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
