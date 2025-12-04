"use client";
import React, { useState } from "react";
import s from "./Header.module.scss";
import Link from "next/link";
import { MENU_ITEMS } from "./Data";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import DesktopNavigation from "./DesktopNavigation";
import MobileMenu from "./MobileMenu";
import FavoritesDrawer from "./FavoritesDrawer";
import FavoritesButton from "./FavoritesButton";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState(null);
  const [closeTimer, setCloseTimer] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState(null);
  const [mobileActiveSubcategory, setMobileActiveSubcategory] = useState(null);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState(false);
  const { favorites, removeFavorite } = useFavoritesStore();
  const handleMouseEnter = (label) => {
    if (closeTimer) clearTimeout(closeTimer);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenDropdown(null);
      setOpenSubcategory(null);
    }, 300);
    setCloseTimer(timer);
  };

  const handleSubcategoryMouseEnter = (subcatName) => {
    if (closeTimer) clearTimeout(closeTimer);
    setOpenSubcategory(subcatName);
  };

  const handleSubcategoryMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenSubcategory(null);
    }, 200);
    setCloseTimer(timer);
  };

  const handleSubmenuMouseEnter = () => {
    if (closeTimer) clearTimeout(closeTimer);
  };

  const handleSubmenuMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenSubcategory(null);
    }, 200);
    setCloseTimer(timer);
  };

  const openMobileCategoryMenu = (label) => {
    setMobileActiveCategory(label);
    setMobileActiveSubcategory(null);
  };

  const openMobileSubcategoryMenu = (subcatName) => {
    setMobileActiveSubcategory(subcatName);
  };

  const goBackMobileMenu = () => {
    if (mobileActiveSubcategory) {
      setMobileActiveSubcategory(null);
    } else if (mobileActiveCategory) {
      setMobileActiveCategory(null);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileActiveCategory(null);
    setMobileActiveSubcategory(null);
  };

  const getCurrentMobileMenuItems = () => {
    if (mobileActiveSubcategory) {
      const category = MENU_ITEMS.find((m) => m.label === mobileActiveCategory);
      const subcategory = category?.items.find(
        (item) => item.name === mobileActiveSubcategory
      );
      return subcategory?.subcategories || [];
    }

    if (mobileActiveCategory) {
      const category = MENU_ITEMS.find((m) => m.label === mobileActiveCategory);
      return category?.items || [];
    }

    return MENU_ITEMS;
  };

  const getMobileMenuTitle = () => {
    if (mobileActiveSubcategory) {
      return mobileActiveSubcategory;
    }
    if (mobileActiveCategory) {
      return "Выбрать поздравление";
    }
    return "Выбрать поздравление";
  };

  const mobileMenuItems = getCurrentMobileMenuItems();

  return (
    <div className={s.header}>
      <div className={`container ${s.flex}`}>
        <Link href={"/"}>
          <img className={s.logo} src="/assets/images/logo.png" alt="logo" />
        </Link>

        <button
          className={s.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={s.actions}>
          <FavoritesButton
            count={favorites.length}
            onClick={() => setFavoritesDrawerOpen(true)}
          />
        </div>
      </div>
      <h2>Музыкальные открытки с фото</h2>
      {/* Desktop Navigation */}
      <DesktopNavigation
        items={MENU_ITEMS}
        openDropdown={openDropdown}
        openSubcategory={openSubcategory}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onSubcategoryEnter={handleSubcategoryMouseEnter}
        onSubcategoryLeave={handleSubcategoryMouseLeave}
        onSubmenuEnter={handleSubmenuMouseEnter}
        onSubmenuLeave={handleSubmenuMouseLeave}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        activeCategory={mobileActiveCategory}
        activeSubcategory={mobileActiveSubcategory}
        onCategorySelect={openMobileCategoryMenu}
        onSubcategorySelect={openMobileSubcategoryMenu}
        onBack={goBackMobileMenu}
        menuItems={mobileMenuItems}
        menuTitle={getMobileMenuTitle()}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={favoritesDrawerOpen}
        onClose={() => setFavoritesDrawerOpen(false)}
        favorites={favorites}
        onRemove={removeFavorite}
      />
    </div>
  );
}
