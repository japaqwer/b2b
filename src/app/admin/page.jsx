"use client";
import React, { useState, useCallback, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useOrders from "@/hooks/useOrders";
import LoginForm from "./LoginForm";
import OrdersTable from "./OrdersTable";
import s from "./Crm.module.scss";

export default function CRM() {
  const { isAuthenticated, logout } = useAuth();
  const { orders, loading, error, pagination, fetchOrders, changePage } =
    useOrders(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className={s.crm}>
      <header className={s.crm__header}>
        <h1>CRM Dashboard</h1>
        <button onClick={logout} className={s.crm__logout_btn}>
          Выход
        </button>
      </header>

      <div className={s.crm__content}>
        {error && <div className={s.crm__error}>{error}</div>}

        <div className={s.crm__table_wrapper}>
          <OrdersTable
            orders={orders}
            loading={loading}
            pagination={pagination}
            onPageChange={changePage}
          />
        </div>
      </div>
    </div>
  );
}
