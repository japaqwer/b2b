"use client";
import React, { memo, useMemo } from "react";
import s from "./Header.module.scss";
import {
  RiArrowLeftSLine,
  RiCloseLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesProvider";

// Мемоизированный пункт меню
const MenuItem = memo(
  ({
    item,
    isCategory,
    hasSubmenu,
    itemLabel,
    itemHref,
    onCategorySelect,
    onSubcategorySelect,
    onClose,
  }) => {
    const handleItemClick = (e) => {
      if (hasSubmenu) {
        e.preventDefault();
        if (isCategory) {
          onCategorySelect(itemLabel);
        } else {
          onSubcategorySelect(itemLabel);
        }
      } else {
        onClose();
      }
    };

    const handleArrowClick = (e) => {
      e.preventDefault();
      if (isCategory) {
        onCategorySelect(itemLabel);
      } else {
        onSubcategorySelect(itemLabel);
      }
    };

    return (
      <div className={s.mobileMenuItem}>
        <Link href={itemHref}>
          <span className={s.mobileMenuItemText} onClick={handleItemClick}>
            {itemLabel}
          </span>
        </Link>
        {hasSubmenu && (
          <button
            className={s.mobileMenuArrow}
            onClick={handleArrowClick}
            aria-label="Раскрыть подменю"
          >
            <RiArrowRightSLine size={24} />
          </button>
        )}
      </div>
    );
  }
);

MenuItem.displayName = "MenuItem";

// Мемоизированная шапка меню
const MobileMenuHeader = memo(
  ({ activeCategory, activeSubcategory, onBack, onClose, menuTitle }) => (
    <div className={s.mobileMenuHeader}>
      {(activeCategory || activeSubcategory) && (
        <button
          className={s.mobileBackBtn}
          onClick={onBack}
          aria-label="Вернуться назад"
        >
          <RiArrowLeftSLine size={24} />
        </button>
      )}
      <span className={s.mobileMenuTitle}>{menuTitle}</span>
      <button
        className={s.mobileCloseBtn}
        onClick={onClose}
        aria-label="Закрыть меню"
      >
        <RiCloseLine size={24} />
      </button>
    </div>
  )
);

MobileMenuHeader.displayName = "MobileMenuHeader";

// Основной компонент меню
export default function MobileMenu({
  isOpen,
  onClose,
  activeCategory,
  activeSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  onBack,
  menuTitle = "Меню",
}) {
  const { items: allCategories, loading, error } = useCategories();

  // Вычисляем текущий список пунктов меню
  const menuItems = useMemo(() => {
    if (!activeCategory && !activeSubcategory) {
      // Показываем основные категории
      return allCategories;
    }

    if (activeCategory && !activeSubcategory) {
      // Показываем подкатегории выбранной категории
      const category = allCategories.find(
        (cat) => cat.label === activeCategory
      );
      return category?.items || [];
    }

    if (activeCategory && activeSubcategory) {
      // Показываем подкатегории
      const category = allCategories.find(
        (cat) => cat.label === activeCategory
      );
      const subcategory = category?.items?.find(
        (item) => item.name === activeSubcategory
      );
      return subcategory?.subcategories || [];
    }

    return [];
  }, [allCategories, activeCategory, activeSubcategory]);

  // Вычисляем заголовок меню
  const computedMenuTitle = useMemo(() => {
    if (activeSubcategory) return activeSubcategory;
    if (activeCategory) return activeCategory;
    return menuTitle;
  }, [activeCategory, activeSubcategory, menuTitle]);

  if (loading) {
    return (
      <>
        {isOpen && <div className={s.mobileMenuOverlay} onClick={onClose} />}
        <div className={`${s.mobileMenuDrawer} ${isOpen ? s.open : ""}`}>
          <div className={s.mobileMenuHeader}>
            <span className={s.mobileMenuTitle}>Загрузка...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {isOpen && <div className={s.mobileMenuOverlay} onClick={onClose} />}
        <div className={`${s.mobileMenuDrawer} ${isOpen ? s.open : ""}`}>
          <div className={s.mobileMenuHeader}>
            <span className={s.mobileMenuTitle}>Ошибка меню</span>
            <button className={s.mobileCloseBtn} onClick={onClose}>
              <RiCloseLine size={24} />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className={s.mobileMenuOverlay}
          onClick={onClose}
          role="presentation"
        />
      )}
      <div
        className={`${s.mobileMenuDrawer} ${isOpen ? s.open : ""}`}
        role="navigation"
        aria-label="Мобильное меню"
      >
        <MobileMenuHeader
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onBack={onBack}
          onClose={onClose}
          menuTitle={computedMenuTitle}
        />

        <div className={s.mobileMenuContent}>
          {menuItems.map((item) => {
            const isCategory = !!item.label;
            const hasSubmenu =
              (item.items && item.items.length > 0) ||
              (item.subcategories && item.subcategories.length > 0);

            const itemLabel = item.label || item.name;
            const itemHref = item.href;

            return (
              <MenuItem
                key={itemLabel}
                item={item}
                isCategory={isCategory}
                hasSubmenu={hasSubmenu}
                itemLabel={itemLabel}
                itemHref={itemHref}
                onCategorySelect={onCategorySelect}
                onSubcategorySelect={onSubcategorySelect}
                onClose={onClose}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
