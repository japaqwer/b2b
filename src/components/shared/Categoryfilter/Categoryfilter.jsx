"use client";
import React, { useState } from "react";
import s from "./CategoryFilter.module.scss";
import Link from "next/link";
import { useCategoryData } from "./hooks/useCategoryData";
import { getHrefFromCodename } from "./utils/codenameUtils";

export default function CategoryFilter({ mainCategoryCodename }) {
  const { data, loading, error } = useCategoryData(mainCategoryCodename);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (codename) => {
    setSelectedFilters((prev) =>
      prev.includes(codename)
        ? prev.filter((f) => f !== codename)
        : [...prev, codename]
    );
  };

  const getFilteredCategories = () => {
    if (!data) return [];
    if (selectedFilters.length === 0) return data.categories;
    return data.categories.filter((cat) =>
      selectedFilters.includes(cat.codename)
    );
  };

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={s.container}>
        <div className={s.error}>{error || "Ошибка загрузки"}</div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <Link href={`/catalog/${getHrefFromCodename(data.codename)}`}>
        <h1 className={s.mainTitle}>{data.title}</h1>
      </Link>

      {getFilteredCategories().map((category) => (
        <div key={category.id} className={s.categorySection}>
          <Link href={`/catalog/${getHrefFromCodename(category.codename)}`}>
            <h2 className={s.categoryTitle}>{category.name}</h2>
          </Link>
          <div className={s.subcategoriesGrid}>
            {category.subcategories &&
              category.subcategories.length > 0 &&
              category.subcategories.map((subcategory) => (
                <div key={subcategory.id} className={s.subcategoryWrapper}>
                  <Link
                    href={`/catalog/${getHrefFromCodename(
                      subcategory.codename
                    )}`}
                    className={s.subcategoryItem}
                  >
                    <span className={s.subcategoryName}>
                      {subcategory.name}
                    </span>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
