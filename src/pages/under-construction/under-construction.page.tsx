import logoPng from "../../assets/logo.svg";
import underConstruction from "../../assets/site-under-construction.png";
import "./under-construction.page.scss";
import { Link } from "react-router-dom";

export default function UnderConstructionPage() {
  return (
    <section className="uc-wrapper d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <img src={logoPng} alt="logo animation" className="logo-icon" />
            </div>

            <div className="mb-2">
              <h2 className="uc-title">Bajo</h2>
              <h1 className="uc-title">Construcción</h1>
            </div>

            <div className="mb-4">
              <p className="text-muted mb-0">
                Estamos trabajando en esta sección. Pronto estará disponible.
                Mientras tanto, puedes volver al inicio o contactarnos.
              </p>
            </div>

            <div>
              <Link to="/home" className="btn btn-primary">Home</Link>
            </div>
          </div>

          <div className="col-12 col-lg-6 text-center">
            <img
              src={underConstruction}
              alt="Under construction"
              className="img-fluid uc-hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
