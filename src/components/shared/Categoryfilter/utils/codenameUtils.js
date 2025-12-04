/**
 * Преобразует кодовое имя в URL путь
 * Пример: "bd/woman/general" -> "/bd/woman/general"
 */
export const getHrefFromCodename = (codename) => {
  return `/${codename.replace(/\//g, "/")}`;
};

/**
 * Преобразует кодовое имя в читаемый текст для URL
 * Пример: "bd" -> "bd", "bd/woman" -> "bd-woman"
 */
export const codenameToUrlSlug = (codename) => {
  return codename.replace(/\//g, "-");
};

/**
 * Получает родительское кодовое имя
 * Пример: "bd/woman/general" -> "bd/woman"
 */
export const getParentCodename = (codename) => {
  const parts = codename.split("/");
  return parts.slice(0, -1).join("/");
};

/**
 * Получает последний уровень кодового имени
 * Пример: "bd/woman/general" -> "general"
 */
export const getLastLevelCodename = (codename) => {
  const parts = codename.split("/");
  return parts[parts.length - 1];
};

/**
 * Проверяет, содержит ли кодовое имя фильтр
 */
export const matchesFilter = (codename, filter) => {
  return codename.includes(filter);
};
