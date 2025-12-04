"use client";
import React, { memo } from "react";
import s from "./Header.module.scss";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import Link from "next/link";
import { useCategories } from "@/context/CategoriesProvider";

// Мемоизируем подкомпоненты для оптимизации
const NavItemSubmenu = memo(
  ({ subitem, openSubcategory, onSubcategoryEnter, onSubcategoryLeave }) => {
    const hasSubcategories =
      subitem.subcategories && subitem.subcategories.length > 0;

    return (
      <div
        className={s.submenuItemWrapper}
        onMouseEnter={() => onSubcategoryEnter(subitem.name)}
        onMouseLeave={onSubcategoryLeave}
      >
        <Link href={subitem.href}>
          <span className={s.submenuItem}>
            {subitem.name}
            {hasSubcategories && (
              <span className={s.arrow}>
                <RiArrowRightSLine />
              </span>
            )}
          </span>
        </Link>

        {hasSubcategories && openSubcategory === subitem.name && (
          <div
            className={s.undersubmenu}
            onMouseEnter={() => onSubcategoryEnter(subitem.name)}
            onMouseLeave={onSubcategoryLeave}
          >
            {subitem.subcategories.map((undersubitem) => (
              <Link key={undersubitem.name} href={undersubitem.href}>
                <span className={s.undersubmenuItem}>{undersubitem.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
);

NavItemSubmenu.displayName = "NavItemSubmenu";

const NavItem = memo(
  ({
    item,
    openDropdown,
    openSubcategory,
    onMouseEnter,
    onMouseLeave,
    onSubcategoryEnter,
    onSubcategoryLeave,
    onSubmenuEnter,
    onSubmenuLeave,
  }) => {
    const hasSubmenu = item.items && item.items.length > 0;
    const isOpen = openDropdown === item.label;

    return (
      <div
        className={s.navItem}
        onMouseEnter={() => onMouseEnter(item.label)}
        onMouseLeave={onMouseLeave}
      >
        <Link href={item.href}>
          <span className={s.navLabel}>
            {item.label}
            {hasSubmenu && (
              <span className={s.chevron}>
                <RiArrowDownSLine size={21} />
              </span>
            )}
          </span>
        </Link>

        {hasSubmenu && isOpen && (
          <div
            className={s.submenu}
            onMouseEnter={onSubmenuEnter}
            onMouseLeave={onSubmenuLeave}
          >
            {item.items.map((subitem) => (
              <NavItemSubmenu
                key={subitem.name}
                subitem={subitem}
                openSubcategory={openSubcategory}
                onSubcategoryEnter={onSubcategoryEnter}
                onSubcategoryLeave={onSubcategoryLeave}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

NavItem.displayName = "NavItem";

export default function DesktopNavigation({
  openDropdown,
  openSubcategory,
  onMouseEnter,
  onMouseLeave,
  onSubcategoryEnter,
  onSubcategoryLeave,
  onSubmenuEnter,
  onSubmenuLeave,
}) {
  const { items, loading, error } = useCategories();

  if (loading) {
    return (
      <nav className={`container ${s.nav}`}>
        <div className={s.skeleton}>Загрузка меню...</div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className={`container ${s.nav}`}>
        <div className={s.error}>Ошибка загрузки меню</div>
      </nav>
    );
  }

  if (!items || items.length === 0) {
    return (
      <nav className={`container ${s.nav}`}>
        <div className={s.empty}>Меню недоступно</div>
      </nav>
    );
  }

  return (
    <nav className={`container ${s.nav}`}>
      {items.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          openDropdown={openDropdown}
          openSubcategory={openSubcategory}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onSubcategoryEnter={onSubcategoryEnter}
          onSubcategoryLeave={onSubcategoryLeave}
          onSubmenuEnter={onSubmenuEnter}
          onSubmenuLeave={onSubmenuLeave}
        />
      ))}
    </nav>
  );
}
