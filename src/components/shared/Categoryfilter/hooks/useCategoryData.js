import { useState, useEffect } from "react";
import axios from "axios";

export const useCategoryData = (mainCategoryCodename) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://api-workhub.site/api/v1/base/main-category/detail/?in_codename=${mainCategoryCodename}&is_active=true`
        );

        if (response.data.code === 200 && response.data.data) {
          const mainCat = Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data;

          setData(mainCat);
        } else {
          setError("Ошибка при загрузке данных");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    if (mainCategoryCodename) {
      fetchData();
    }
  }, [mainCategoryCodename]);

  return { data, loading, error };
};
