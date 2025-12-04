"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import s from "./SlugPage.module.scss";
import CardsGrid from "@/components/shared/GreetingCardsGrid/CardsGrid";
import CategoryFilter from "@/components/shared/Categoryfilter/Categoryfilter";

const API_BASE = "https://api-workhub.site/api/v1/base";

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

  const [pageData, setPageData] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [displayedTemplates, setDisplayedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const ITEMS_PER_PAGE = 6; // Количество шаблонов на одну загрузку

  useEffect(() => {
    const fetchData = async () => {
      if (!category || !subcategory || !undersubcategory) return;

      try {
        setLoading(true);

        const codename = `${category}/${subcategory}/${undersubcategory}`;

        const categoryResponse = await axios.get(
          `${API_BASE}/subcategory/codename/${codename}`,
          {
            timeout: 10000,
          }
        );
        const categoryArray = categoryResponse.data.data;

        if (!categoryArray || categoryArray.length === 0) {
          throw new Error("Категория не найдена");
        }

        const foundCategory = categoryArray;
        setPageData(foundCategory);

        const templatesResponse = await axios.post(
          `${API_BASE}/template/get`,
          [categoryArray.id],
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          }
        );

        const templatesData = templatesResponse.data.data?.items || [];
        setTemplates(templatesData);

        // Загружаем первую порцию шаблонов
        setDisplayedTemplates(templatesData.slice(0, ITEMS_PER_PAGE));
        setHasMore(templatesData.length > ITEMS_PER_PAGE);
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message || "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, subcategory, undersubcategory]);

  // Функция для загрузки следующей порции шаблонов
  const loadMoreTemplates = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTemplates = templates.slice(startIndex, endIndex);

      if (newTemplates.length > 0) {
        setDisplayedTemplates((prev) => [...prev, ...newTemplates]);
        setPage(nextPage);
        setHasMore(endIndex < templates.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 500); // Небольшая задержка для улучшения UX
  }, [page, templates, loadingMore, hasMore]);

  // Intersection Observer для автоматической подгрузки
  useEffect(() => {
    if (loading || !hasMore) return;

    const options = {
      root: null,
      rootMargin: "200px", // Начинаем загрузку за 200px до конца
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        loadMoreTemplates();
      }
    }, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreTemplates, loading, hasMore, loadingMore]);

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
          <p>⏳ Загрузка шаблонов...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
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
        <h1 className={s.title123}>{pageData.title || pageData.name}</h1>

        {displayedTemplates.length > 0 ? (
          <>
            <CardsGrid templates={displayedTemplates} />

            {/* Элемент-триггер для Intersection Observer */}
            {hasMore && (
              <div
                ref={loadMoreRef}
                style={{ height: "20px", margin: "20px 0" }}
              >
                {loadingMore && (
                  <div className={s.loading}>
                    <div className={s.spinner}></div>
                    <p>⏳ Загрузка ещё...</p>
                  </div>
                )}
              </div>
            )}

            {/* Опциональная кнопка "Загрузить ещё" */}
            {hasMore && !loadingMore && (
              <div className="center" style={{ marginTop: "30px" }}>
                <button
                  className="button"
                  onClick={loadMoreTemplates}
                  style={{
                    padding: "12px 32px",
                    fontSize: "16px",
                  }}
                >
                  Загрузить ещё
                </button>
              </div>
            )}

            {/* Сообщение когда все шаблоны загружены */}
            {!hasMore && displayedTemplates.length > ITEMS_PER_PAGE && (
              <div className="center" style={{ marginTop: "30px" }}>
                <p style={{ color: "#999", fontSize: "14px" }}>
                  Все шаблоны загружены
                </p>
              </div>
            )}
            <CategoryFilter mainCategoryCodename="bd" />
            <CategoryFilter mainCategoryCodename="weddinganniversary" />
            <CategoryFilter mainCategoryCodename="calendar" />
          </>
        ) : (
          <div className={s.empty}>
            <img src="/assets/images/скоро-появятся.gif" alt="Нет шаблонов" />
          </div>
        )}
      </div>
    </>
  );
}
