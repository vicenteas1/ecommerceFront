import { useEffect, useMemo, useRef, useState } from "react";
import "./home.page.scss";
import heroImg from "../../assets/hero-image.jpg";
import refImg from "../../assets/construccion-icon.png";
import { getCategories } from "../../services/categories/categories.service";
import type { CategoryItem } from "../../models/services/categories/categories.model";

function toTypeObj(t: CategoryItem["type"]): { _id: string; nombre: string; slug: string } {
  return typeof t === "string" ? { _id: t, nombre: "", slug: "" } : t;
}

export default function HomePage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        const normalized: CategoryItem[] = (cats ?? []).map((c: any) => ({
          _id: c._id ?? c.id,
          nombre: c.nombre,
          slug: c.slug,
          type: c.type,
        }));
        setCategories(normalized.slice(0, 12));
      } catch (err) {
        console.error("Error cargando categorías:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const slides = useMemo(() => {
    const perSlide = 3;
    const chunk: CategoryItem[][] = [];
    for (let i = 0; i < categories.length; i += perSlide) {
      chunk.push(categories.slice(i, i + perSlide));
    }
    return chunk;
  }, [categories]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "87vh",
          position: "relative",
        }}
      >
        <div className="overlay" />
        <div className="hero-content container position-relative">
          <h1 className="display-3 fw-bold mb-3 home-title">Prosaav</h1>
          <p className="lead mb-4 home-subtitle">
            Soluciones en base a la experiencia y compromiso
          </p>
          <a
            href="#servicios"
            className="btn btn-primary btn-lg px-4"
            onClick={(e) => handleScrollTo(e, "servicios")}
          >
            Conoce nuestros servicios
          </a>
        </div>
      </section>

      <section className="py-5 home-content bg-light text-center">
        <div className="container">
          <h2 className="mb-4">Experiencia que construye confianza</h2>
          <p className="lead">
            Nuestra empresa se especializa en la resolución de problemas en el
            ámbito de la <strong>construcción e inspección de obras</strong>.
          </p>
          <p>
            Contamos con profesionales con más de 20 años de experiencia en{" "}
            <strong>viviendas, hospitales y escuelas</strong>.
          </p>
          <p className="text-muted">
            Entregamos servicios de <strong>construcción, asesoría, inspección y pericia</strong> a un
            precio justo, siempre enfocados en el cliente final.
          </p>
        </div>
      </section>

      <section id="servicios" className="py-5 bg-white">
        <div className="container position-relative">
          <h3 className="text-center mb-4">Nuestros servicios</h3>

          {loading ? (
            <p className="text-center text-muted">Cargando servicios...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted">No hay servicios disponibles.</p>
          ) : (
            <div
              id="servicesCarousel"
              className="carousel slide"
              data-bs-ride="false"
              ref={carouselRef}
            >
              <div>
                <div className="carousel-inner">
                  {slides.map((group, idx) => (
                    <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                      <div className="row g-4 justify-content-center">
                        {group.map((cat) => {
                          const t = toTypeObj(cat.type);
                          const typeName = t.nombre || "servicio";
                          const typeSlug = t.slug || "servicio";
                          const catSlug = cat.slug;

                          return (
                            <div key={cat._id} className="col-12 col-md-6 col-lg-4">
                              <div className="product-card shadow-soft">
                                <div className="product-img-wrap">
                                  <img
                                    src={refImg}
                                    alt={`${typeName} - ${cat.nombre}`}
                                    className="product-img"
                                  />
                                </div>

                                <div className="product-body text-center">
                                  <div className="badge bg-secondary mb-2" style={{ textTransform: "capitalize" }}>
                                    {typeName}
                                  </div>

                                  <h5 className="product-title" style={{ textTransform: "capitalize" }}>
                                    {cat.nombre}
                                  </h5>

                                  <p className="product-desc">&nbsp;</p>

                                  <hr className="product-divider" />

                                  <a
                                    className="btn btn-product"
                                    href={`/servicios?tipo=${encodeURIComponent(typeSlug)}&categoria=${encodeURIComponent(catSlug)}`}
                                    aria-label={`Ver ${typeName} disponibles en ${cat.nombre}`}
                                  >
                                    Ver {typeName} de {cat.nombre} disponibles
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev square-arrow"
                  type="button"
                  data-bs-target="#servicesCarousel"
                  data-bs-slide="prev"
                  aria-label="Anterior"
                >
                  <span className="arrow-icon">‹</span>
                </button>
                <button
                  className="carousel-control-next square-arrow"
                  type="button"
                  data-bs-target="#servicesCarousel"
                  data-bs-slide="next"
                  aria-label="Siguiente"
                >
                  <span className="arrow-icon">›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
