"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import s from "../Catalog.module.scss";

const API_BASE = "https://api-workhub.site/api/v1/base";

export default function CategoryPage() {
  const params = useParams();
  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Восстановление из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedCategory");
      if (saved) setSelectedCategory(JSON.parse(saved));
    } catch (e) {
      console.error("localStorage error:", e);
    }
  }, []);

  // Загрузка данных категории
  useEffect(() => {
    if (!category) return;

    const fetchCategoryDetail = async () => {
      try {
        setLoading(true);

        // Получаем подкатегории по codename через axios
        const response = await axios.get(
          `${API_BASE}/category/detail/?in_codename=${category}`,
          {
            timeout: 10000,
          }
        );

        // ⚠️ response.data.data это МАССИВ подкатегорий!
        // Например для "bd" это массив с "bd/woman", "bd/man", "bd/kids", итд
        const subcategories = response.data.data;

        if (!subcategories || subcategories.length === 0) {
          throw new Error("Подкатегории не найдены");
        }

        setCategoryData(subcategories);

        // Если selectedCategory не установлена, берем первую подкатегорию
        // или используем название главной категории
        if (!selectedCategory) {
          setSelectedCategory({
            title: `Категория ${category}`,
            description: "",
          });
        }
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();
  }, [category, selectedCategory]);

  const updateSelectedCategory = useCallback((item) => {
    const categoryInfo = {
      title: item.title,
      description: item.description,
    };
    localStorage.setItem("selectedCategory", JSON.stringify(categoryInfo));
    setSelectedCategory(categoryInfo);
  }, []);

  if (loading) {
    return (
      <div className={s.main}>
        <div className={s.loading}>
          <div className={s.spinner}></div>
          <p>⏳ Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryData || categoryData.length === 0) {
    return (
      <div className={s.main}>
        <div className={s.empty}>
          <img src="/assets/images/скоро-появятся.gif" alt="Нет подкатегорий" />
        </div>
      </div>
    );
  }

  const subcategories = categoryData;

  return (
    <div className={s.main}>
      {selectedCategory && (
        <h1 className={s.h1}>✨ {selectedCategory.title}</h1>
      )}

      <ul className={s.colum}>
        {subcategories.map((item) => (
          <li key={item.id}>
            <Link
              href={`/catalog/${item.codename}`}
              className={s.link}
              onClick={() => updateSelectedCategory(item)}
              title={item.title}
            >
              <p>{item.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
