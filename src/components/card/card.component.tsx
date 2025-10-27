import type { Item } from "../../services/item/item.service";
import refImg from "../../assets/construccion-icon.png";


type Props = {
  item: Item;
  onView?: (item: Item) => void;
};

export default function ServiceItemCard({ item, onView }: Props) {
  const maxChars = 120;
  const descripcionCompleta = item.descripcion || "";
  const descripcionCorta =
    descripcionCompleta.length > maxChars
      ? descripcionCompleta.slice(0, maxChars).trimEnd() + "…"
      : descripcionCompleta;

  return (
    <div className="product-card shadow-soft h-100 d-flex flex-column">
      <div className="product-img-wrap">
        <img
          src={refImg}
          alt={item.nombre}
          className="product-img"
        />
      </div>

      <div className="product-body text-start d-flex flex-column flex-grow-1">
        <h6 className="mb-1" style={{ lineHeight: 1.25 }}>
          {item.nombre}
        </h6>

        <p
          className="product-desc text-muted flex-grow-1"
          style={{ minHeight: 42 }}
        >
          {descripcionCorta}
        </p>

        <div className="d-flex align-items-baseline gap-2 mt-1">
          <strong>${item.precio.toLocaleString("es-CL")}</strong>
        </div>

        <hr className="product-divider my-3" />

        <button
          className="btn btn-product w-100 mt-auto"
          onClick={() => onView?.(item)}
          aria-label={`Ver producto ${item.nombre}`}
        >
          Ver Producto
        </button>
      </div>
    </div>
  );
}
