import { NavLink, useNavigate } from "react-router-dom";
import type { NavItem } from "../../models/components/navbar/NavItem.model";
import { logout } from "../../services/login/logout.service";
import { navIcons } from "../../constants/navbar.icons";

type MenuItemProps = { item: NavItem };

export default function MenuItem({ item }: MenuItemProps) {
  const navigate = useNavigate();
  const hasChildren = !!(item.submenu && item.submenu.length > 0);

  const handleClick = (route?: string) => {
    if (!route || route === "#") return;
    if (route === "/logout") { logout(); return; }
    if (route.startsWith("/")) navigate(route);
    else window.location.href = route;
  };

  if (hasChildren) {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          onClick={(e) => e.preventDefault()}
        >
          {navIcons[item.menuname] ?? null}
          <span className="ms-1">{item.menuname}</span>
        </a>
        <ul className="dropdown-menu">
          {item.submenu!.map((sub) => (
            <li key={sub.route ?? sub.menuname}>
              {sub.route ? (
                <NavLink
                  to={sub.route}
                  className={({ isActive }) => "dropdown-item" + (isActive ? " active" : "")}
                >
                  {sub.menuname}
                </NavLink>
              ) : (
                <a className="dropdown-item disabled" href="#" onClick={(e) => e.preventDefault()}>
                  {sub.menuname}
                </a>
              )}
            </li>
          ))}
        </ul>
      </li>
    );
  }

  if (item.route) {
    return (
      <li
        className="nav-item mx-2"
        style={{ cursor: "pointer", display: "flex", alignItems: "center", fontWeight: 500 }}
        onClick={() => handleClick(item.route!)}
      >
        {navIcons[item.menuname] ?? null}
        {item.displayMenuName !== false && <span className="nav-link">{item.menuname}</span>}
      </li>
    );
  }

  return (
    <li className="nav-item mx-2">
      <span className="nav-link disabled" aria-disabled="true">
        {navIcons[item.menuname] ?? null}
        <span className="ms-1">{item.menuname}</span>
      </span>
    </li>
  );
}
