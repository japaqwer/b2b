"use client";
import React from "react";
import s from "./FavoritesDrawer.module.scss";
import { RiCloseLine } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import Link from "next/link";

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onRemove,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className={s.favoritesOverlay} onClick={onClose}></div>
      <div className={s.favoritesModal}>
        <div className={s.favoritesModalHeader}>
          <h2>Избранные посты</h2>
          <button className={s.favoritesModalCloseBtn} onClick={onClose}>
            <RiCloseLine size={24} />
          </button>
        </div>
        <div className={s.favoritesModalContent}>
          {favorites.length === 0 ? (
            <div className={s.emptyState}>
              <AiOutlineStar size={64} color="#ddd" />
              <p className={s.emptyText}>Здесь пусто</p>
              <p className={s.emptySubtext}>Добавляйте Отложенные с помощью</p>
            </div>
          ) : (
            <div className={s.favoritesList}>
              {favorites.map((item) => (
                <div key={item.id} className={s.favoriteItem}>
                  {/* Background + Cover as single image */}
                  <div
                    className={s.favoriteItemImage}
                    style={{
                      backgroundImage: `url(${item.background})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <img src={item.cover} alt={item.name} />
                  </div>

                  <div className={s.favoriteInfo}>
                    <h3>{item.name}</h3>
                    <p>{item.title}</p>
                    <div className={s.favoriteActions}>
                      <Link
                        href={`/create/${item.folder_name}`}
                        className={s.favoriteCreateBtn}
                      >
                        Подробнее
                      </Link>
                      <button
                        className={s.favoriteRemoveBtn}
                        onClick={() => onRemove(item.id)}
                        title="Удалить"
                      >
                        <RiCloseLine size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={s.favoritesModalFooter}>
          <button className={s.favoritesContinueBtn} onClick={onClose}>
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
}
