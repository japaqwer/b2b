"use client";
import React, { useState, useEffect } from "react";
import s from "./GreetingCardsGrid.module.scss";
import { BsPlayFill } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Items } from "./Data";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import Link from "next/link";

export default function GreetingCardsGrid() {
  const [selectedCard, setSelectedCard] = useState(null);
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavoritesStore();

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleClear = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("uploadedBackgrounds");
      localStorage.removeItem("uploadedIntro");
      localStorage.removeItem("appliedPromoCode");
    }
  };

  const handleToggleFavorite = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  // Генерация URL с автовоспроизведением для Kinescope
  const getAutoplayVideoUrl = (demoUrl) => {
    if (!demoUrl) return "";

    // Если URL уже содержит параметры
    if (demoUrl.includes("?")) {
      return `${demoUrl}&autoplay=1&muted=0`;
    }

    return `${demoUrl}?autoplay=1&muted=0`;
  };

  // Блокировка скролла при открытии модалки
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCard]);

  // Закрытие модалки по клавише Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && selectedCard) {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedCard]);

  return (
    <div className={s.container}>
      <div className={s.grid}>
        {Items.map((item) => (
          <div
            key={item.id}
            className={s.card}
            onClick={() => handleCardClick(item)}
          >
            {item.preview && (
              <div
                className={s.cardCover}
                style={{
                  backgroundImage: `url(${item?.preview})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <button className={s.playButton} title="Смотреть демо">
                  <BsPlayFill size={24} />
                </button>
                <button
                  className={`${s.actionButton} ${s.favoriteButton}`}
                  onClick={(e) => handleToggleFavorite(e, item)}
                  title={
                    isFavorite(item?.id)
                      ? "Удалить из избранного"
                      : "Добавить в избранное"
                  }
                >
                  {isFavorite(item?.id) ? (
                    <AiFillHeart size={18} color="#ff3333" />
                  ) : (
                    <AiOutlineHeart size={18} />
                  )}
                </button>
              </div>
            )}
            <div className={s.cardInfo}>
              {/* <h3 className={s.cardName}>{item.name}</h3> */}
              <Link
                href={`/detail/${item?.id}`}
                className={s.createButton}
                onClick={handleClear}
              >
                Создать открытку
              </Link>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div className={s.modal} onClick={handleCloseModal}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={s.closeButton} onClick={handleCloseModal}>
              ✕
            </button>

            <div className={s.videoContainer}>
              <iframe
                key={selectedCard.id} // Добавлен key для перезагрузки iframe при смене видео
                src={getAutoplayVideoUrl(selectedCard.demo)}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                className={s.videoFrame}
                title={selectedCard.name}
                loading="eager"
              />
            </div>

            <div className={s.modalFooter}>
              <h2>
                Вы можете загрузить свои фото
                <br />в этот шаблон открытки
              </h2>
              <Link
                href={`/detail/${selectedCard?.id}`}
                className={s.modalCreateButton}
                onClick={handleClear}
              >
                Создать открытку
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
