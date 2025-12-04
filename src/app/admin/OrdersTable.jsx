import React from "react";
import s from "./Orderstable.module.scss";

export default function OrdersTable({
  orders,
  loading,
  pagination,
  onPageChange,
}) {
  const getStatusBadge = (status) => {
    const statusMap = {
      paid: { label: "Оплачено", class: s.statusPaid },
      pending: { label: "В ожидании", class: s.statusPending },
      completed: { label: "Завершено", class: s.statusCompleted },
      cancelled: { label: "Отменено", class: s.statusCancelled },
      invoice_requested: {
        label: "счет фактура запрошена",
        class: s.statusPending,
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      class: s.statusDefault,
    };

    return (
      <span className={`${s.tableStatus} ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return <div className={s.tableLoading}>Загрузка заказов...</div>;
  }

  return (
    <div className={s.ordersTable}>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>Телефон</th>
              <th>Статус</th>
              <th>Шаблон</th>
              <th>Код</th>
              <th>Цена</th>
              <th>Дата создания</th>
              <th>Промо-код</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className={s.tableRow}>
                  <td className={s.tableCell}>
                    <a href={`tel:${order.phone}`}>{order.phone}</a>
                  </td>
                  <td className={s.tableCell}>
                    {getStatusBadge(order.status)}
                  </td>
                  {/* <td className={s.tableCell}>
                    <div className={s.templateInfo}>
                      <img
                        src={order.template.cover}
                        alt={order.template.name}
                        className={s.templateInfoCover}
                      />
                      <span>{order.template.name}</span>
                    </div>
                  </td> */}
                  <td className={s.tableCell}>{order.code}</td>
                  <td className={s.tableCell}>
                    <strong>{order.price}₽</strong>
                  </td>
                  <td className={s.tableCell}>
                    {formatDate(order.created_time)}
                  </td>
                  <td className={s.tableCell}>
                    {order.promo_code ? (
                      <span className={s.promoBadge}>{order.promo_code}</span>
                    ) : (
                      <span className={s.textMuted}>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={s.tableEmpty}>
                  Заказы не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={s.tablePagination}>
        <div className={s.paginationInfo}>
          Страница {pagination.page} из {pagination.totalPages} (всего:{" "}
          {pagination.total})
        </div>

        <div className={s.paginationControls}>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className={s.paginationBtn}
          >
            ← Назад
          </button>

          <div className={s.paginationPages}>
            {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
              const pageNum =
                pagination.page - 2 + idx < 1
                  ? idx + 1
                  : pagination.page - 2 + idx;

              if (pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`${s.paginationPage} ${
                    pageNum === pagination.page ? s.active : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
            className={s.paginationBtn}
          >
            Вперед →
          </button>
        </div>
      </div>
    </div>
  );
}
