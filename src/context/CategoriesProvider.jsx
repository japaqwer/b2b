"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { transformCategoryToNavItems } from "@/components/layout/Header/navTransformer";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  const fetchCategories = useCallback(async () => {
    // Если данные уже загружены, не загружаем снова
    if (isFetched) return;

    if (loading) return; // Предотвращаем множественные запросы

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://api-workhub.site/api/v1/base/main-category/detail/?is_active=true",
        {
          timeout: 10000, // 10 секунд
        }
      );

      const data = response.data?.data || [];
      const navItems = transformCategoryToNavItems(data);

      setItems(navItems);
      setIsFetched(true);
    } catch (err) {
      console.error("Ошибка загрузки категорий:", err);
      setError(err.message || "Ошибка загрузки категорий");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isFetched, loading]);

  // Загружаем категории при монтировании провайдера
  useEffect(() => {
    if (!isFetched && !loading) {
      fetchCategories();
    }
  }, [isFetched, loading, fetchCategories]);

  const resetCategories = useCallback(() => {
    setItems([]);
    setIsFetched(false);
    setError(null);
  }, []);

  const value = {
    items,
    loading,
    error,
    isFetched,
    fetchCategories,
    resetCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error(
      "useCategories должен использоваться внутри CategoriesProvider"
    );
  }

  return context;
};
