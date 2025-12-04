/**
 * Преобразует данные из API в формат для DesktopNavigation
 * @param {Array} apiData - Массив категорий с API
 * @returns {Array} Массив с нужной структурой для навигации
 */
export const transformCategoryToNavItems = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  return apiData.map((mainCategory) => ({
    label: mainCategory.title, // "С днем рождения"
    href: `/catalog/${mainCategory.codename}`, // "/category/bd"
    items: (mainCategory.categories || []).map((category) => ({
      name: category.name, // "Женщине / девушке"
      href: `/catalog/${category.codename}`, // "/category/bd/woman"
      subcategories: (category.subcategories || []).map((subcategory) => ({
        name: subcategory.name, // "Универсальные"
        href: `/catalog/${subcategory.codename}`, // "/category/bd/woman/general"
      })),
    })),
  }));
};

/**
 * Альтернативный вариант - если нужны ID для ссылок
 */
export const transformCategoryToNavItemsWithId = (apiData) => {
  if (!Array.isArray(apiData) || apiData.length === 0) {
    return [];
  }

  return apiData.map((mainCategory) => ({
    label: mainCategory.title,
    href: `/catalog/${mainCategory.id}`,
    id: mainCategory.id,
    items: (mainCategory.categories || []).map((category) => ({
      name: category.name,
      href: `/catalog/${category.id}`,
      id: category.id,
      subcategories: (category.subcategories || []).map((subcategory) => ({
        name: subcategory.name,
        href: `/catalog/${subcategory.id}`,
        id: subcategory.id,
      })),
    })),
  }));
};
