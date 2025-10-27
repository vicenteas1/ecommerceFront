import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logoSvg from "../../assets/logo.svg";
import MenuItem from "../menuItem/menu-item.component";
import { getNavbar } from "../../services/navbar/navbar.service";
import type { NavItem } from "../../models/components/navbar/NavItem.model";
import "./navbar.component.scss";
import CartButton from "./cartButton.component";

export default function Navbar() {
  const [menu, setMenu] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const nav = await getNavbar();
        setMenu(nav.items);
      } catch (err) {
        console.error("Error cargando navbar:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  if (loading) return null;

  return (
    <nav className="navbar navbar-expand-lg custom-navbar shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand" to="/home">
          <img src={logoSvg} alt="prosaav-logo" className="logo-icon" />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {menu.map((item) => {
              if (item.menuname.toLowerCase() === "carrito") {
                return (
                  <li key={item.menuname} className="nav-item ms-2">
                    <CartButton />
                  </li>
                );
              }
              return <MenuItem key={item.menuname} item={item} />;
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
