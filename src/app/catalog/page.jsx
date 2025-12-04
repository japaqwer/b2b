"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import s from "./Catalog.module.scss";

const API_BASE = "https://api-workhub.site/api/v1/base";

export default function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/main-category/?is_active=true`,
          { next: { revalidate: 3600 } } // Кеш на 1 час
        );

        if (!response.ok) {
          throw new Error("Ошибка загрузки категорий");
        }

        const result = await response.json();
        setCategories(result.data || []);
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className={s.main}>
        <div className={s.loading}>
          <div className={s.spinner}></div>
          <p>Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.main}>
        <div className={s.error}>
          <p>❌ Ошибка: {error}</p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={s.main}>
        <div className={s.empty}>
          <img src="/assets/images/скоро-появятся.gif" alt="Пусто" />
        </div>
      </div>
    );
  }

  return (
    <div className={s.main}>
      <h1 className={s.h1}>🎉 Каталог открыток</h1>

      <ul className={s.colum}>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/catalog/${category.codename}`}
              className={s.link}
              title={category.title}
            >
              <p>{category.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
