"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import s from "./SlugPage.module.scss";
import OneCategory from "../../../../module/components/home/OneCatagory";

const API_BASE = "https://api-workhub.site/api/v1/base";

async function getSubcategoryData(codename) {
  try {
    const response = await fetch(
      `${API_BASE}/subcategory/codename/${codename}`
    );
    if (!response.ok) throw new Error("Not found");
    const result = await response.json();
    return result.data.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function getTemplates(subcategoryId) {
  try {
    const response = await fetch(`${API_BASE}/template/get`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([subcategoryId]),
    });
    if (!response.ok) throw new Error("Not found");
    const result = await response.json();
    return result.data?.items || [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export default function SlugPageClient() {
  const params = useParams();

  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const subcategory = Array.isArray(params.subcategory)
    ? params.subcategory[0]
    : params.subcategory;

  const undersubcategory = Array.isArray(params.undersubcategory)
    ? params.undersubcategory[0]
    : params.undersubcategory;

  const [subcategoryData, setSubcategoryData] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!category || !subcategory) return;

      try {
        setLoading(true);

        const codename = undersubcategory
          ? `${category}/${subcategory}/${undersubcategory}`
          : `${category}/${subcategory}`;

        const subcategoryData = await getSubcategoryData(codename);

        if (!subcategoryData) {
          setError("Категория не найдена");
          return;
        }

        setSubcategoryData(subcategoryData);

        const templatesData = await getTemplates(subcategoryData.id);
        setTemplates(templatesData);
      } catch (err) {
        console.error("Error:", err);
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, subcategory, undersubcategory]);

  const handleClear = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("uploadedBackgrounds");
      localStorage.removeItem("uploadedIntro");
      localStorage.removeItem("appliedPromoCode");
    }
  };

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.loading}>
          <div className={s.spinner}></div>
          <p>Загрузка шаблонов...</p>
        </div>
      </div>
    );
  }

  if (error || !subcategoryData) {
    return (
      <div className={s.container}>
        <div className={s.empty}>
          <img src="/assets/images/скоро-появятся.gif" alt="Нет данных" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={s.container}>
        <h1 className={s.title123}>
          {subcategoryData.title || subcategoryData.name}
        </h1>

        <div className={s.grid}>
          {templates.length > 0 ? (
            templates.map((template) => (
              <div key={template.id} className={s.flex}>
                <div className={s.videoContainer}>
                  <iframe
                    src={template.demo}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className={s.video}
                    title={template.name}
                  />
                </div>

                <Link
                  href={`/detail/${template.id}`}
                  onClick={handleClear}
                  className={s.link}
                >
                  <p>🎨 СОЗДАТЬ ОТКРЫТКУ</p>
                </Link>

                <div className={s.hr}></div>
              </div>
            ))
          ) : (
            <div className={s.empty} style={{ gridColumn: "1 / -1" }}>
              <img src="/assets/images/скоро-появятся.gif" alt="Нет шаблонов" />
            </div>
          )}
        </div>

        {subcategoryData?.description && (
          <OneCategory description={subcategoryData.description} />
        )}
      </div>
    </>
  );
}
