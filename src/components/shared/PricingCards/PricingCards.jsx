"use client";
import React from "react";
import s from "./Pricingcards.module.scss";
import Link from "next/link";
import { BsPlayFill } from "react-icons/bs";

const pricingPlans = [
  {
    id: 1,
    name: "СТАНДАРТ",
    price: "300₽",
    title: "Видео поздравление ученикам от Деда Мороза",
    duration: null,
    image:
      "https://3051c4dd-6445-4f5d-8dd4-ca4d65add868.selstorage.ru/templates/schoolDM720x720/preview/82e8633f-1d9c-4143-8625-0ef7c5804226.png",
    demoUrl: "https://kinescope.io/embed/23QBdNEg7huhR6h7tGkrL2",
    href: "/kvadrat/bf2a63a9-2a84-429f-8373-586ebc55ab5c",
  },
  {
    id: 2,
    name: "СТАНДАРТ ПЛЮС",
    price: "600₽",
    title: "Видео поздравление ученикам от Деда Мороза",
    duration: "Продолжительность 2:20 минуты",
    image:
      "https://3051c4dd-6445-4f5d-8dd4-ca4d65add868.selstorage.ru/templates/schoolDM/preview/2168d65e-1fa5-4b45-9b6c-4c335caab074.jpg",
    demoUrl: "https://kinescope.io/embed/vN9xb1wUGnGk75D83nj5Tj",
    // featured: true,
    href: "/detail/f5c43f0d-47b8-4222-afaf-b63bb94895df",
  },
  {
    id: 3,
    name: "ПРЕМИУМ от",
    price: "1500₽",
    title: "Видео поздравление ученикам от Деда Мороза",
    duration: "Продолжительность 2:20 минуты",
    image:
      "https://3051c4dd-6445-4f5d-8dd4-ca4d65add868.selstorage.ru/templates/schoolDM/preview/2168d65e-1fa5-4b45-9b6c-4c335caab074.jpg",
    demoUrl: "https://kinescope.io/embed/7vgMJydBP6KF7voc7iJPiA",
    // featured: true,
    href: "#",
  },
];

export default function PricingCards() {
  const [selectedCard, setSelectedCard] = React.useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const getAutoplayVideoUrl = (demoUrl) => {
    if (!demoUrl) return "";
    if (demoUrl.includes("?")) {
      return `${demoUrl}&autoplay=1&muted=0`;
    }
    return `${demoUrl}?autoplay=1&muted=0`;
  };

  React.useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedCard]);

  React.useEffect(() => {
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
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`${s.card} ${plan.featured ? s.featured : ""}`}
          >
            <div className={s.cardImage} onClick={() => handleCardClick(plan)}>
              <img src={plan.image} alt={plan.name} />
              <button className={s.playButton} title="Смотреть демо">
                <BsPlayFill size={32} />
              </button>
            </div>

            <div className={s.cardContent}>
              <h3 className={s.planName}>
                {plan.name} <span className={s.price}>{plan.price}</span>
              </h3>
              <p className={s.planTitle}>{plan.title}</p>
              {plan.duration && (
                <p className={s.planDuration}>{plan.duration}</p>
              )}
              <Link href={plan.href} className={s.createButton}>
                Создать поздравление
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
                key={selectedCard.id}
                src={getAutoplayVideoUrl(selectedCard.demoUrl)}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                className={s.videoFrame}
                title={selectedCard.name}
                loading="eager"
              />
            </div>

            <div className={s.modalFooter}>
              <h2>Демонстрация шаблона</h2>
              <Link href={selectedCard.href}>
                <button className={s.modalCreateButton}>
                  Создать поздравление
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
