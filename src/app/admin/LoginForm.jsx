import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import s from "./Loginform.module.scss";

export default function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Заполните все поля");
      return;
    }

    const success = await login(email, password);

    if (!success) {
      setLocalError(error || "Ошибка при входе");
    }
  };

  return (
    <div className={s.login_form}>
      <div className={s.login_form__container}>
        <h1 className={s.login_form__title}>CRM System</h1>
        <p className={s.login_form__subtitle}>Вход в систему</p>

        <form onSubmit={handleSubmit} className={s.login_form__form}>
          <div className={s.login_form__field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={s.login_form__field}>
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {(localError || error) && (
            <div className={s.login_form__error}>{localError || error}</div>
          )}

          <button
            type="submit"
            className={s.login_form__btn}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
