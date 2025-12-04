"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import s from "../../Catalog.module.scss";

const API_BASE = "https://api-workhub.site/api/v1/base";

export default function SubcategoryPage() {
  const params = useParams();

  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const subcategory = Array.isArray(params.subcategory)
    ? params.subcategory[0]
    : params.subcategory;

  const [subcategoryData, setSubcategoryData] = useState(null);
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

  // Загрузка данных подкатегории
  useEffect(() => {
    if (!category || !subcategory) return;

    const fetchSubcategoryDetail = async () => {
      try {
        setLoading(true);

        // Формируем кодовое имя: category/subcategory (например: bd/woman)
        const codename = `${category}/${subcategory}`;

        // Получаем данные через axios
        const response = await axios.get(
          `${API_BASE}/category/detail/?in_codename=${codename}`,
          {
            timeout: 10000,
          }
        );

        // response.data.data это МАССИВ, берем первый элемент
        const categoryData = response.data.data[0];

        if (!categoryData) {
          throw new Error("Категория не найдена");
        }

        // Берем subcategories из полученного объекта
        const undersubcategories = categoryData.subcategories;

        if (!undersubcategories || undersubcategories.length === 0) {
          throw new Error("Под-подкатегории не найдены");
        }

        setSubcategoryData(undersubcategories);

        // Если selectedCategory не установлена, берем информацию из первой категории
        if (!selectedCategory) {
          setSelectedCategory({
            title: categoryData.title,
            description: categoryData.description,
          });
        }
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategoryDetail();
  }, [category, subcategory, selectedCategory]);

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

  if (error || !subcategoryData || subcategoryData.length === 0) {
    return (
      <div className={s.main}>
        <div className={s.empty}>
          <img
            src="/assets/images/скоро-появятся.gif"
            alt="Нет под-подкатегорий"
          />
        </div>
      </div>
    );
  }

  // subcategoryData это МАССИВ под-подкатегорий
  const undersubcategories = subcategoryData;

  return (
    <div className={s.main}>
      {selectedCategory && (
        <h1 className={s.h1}>✨ {selectedCategory.title}</h1>
      )}

      <ul className={s.colum}>
        {undersubcategories.map((item) => (
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
