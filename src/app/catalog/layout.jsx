import s from "./Catalog.module.scss";

export default function CatalogLayout({ children }) {
  return <div className={s.layout}>{children}</div>;
}
