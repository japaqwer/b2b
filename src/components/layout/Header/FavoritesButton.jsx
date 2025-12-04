"use client";
import React from "react";
import s from "./Header.module.scss";
import { AiFillHeart } from "react-icons/ai";

export default function FavoritesButton({ count, onClick }) {
  return (
    <button className={s.favoritesBtn} onClick={onClick}>
      <AiFillHeart size={24} />
      <span>Избранные</span>
      {count > 0 && <span className={s.badge}>{count}</span>}
    </button>
  );
}
