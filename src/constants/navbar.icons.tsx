import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import type { JSX } from "@emotion/react/jsx-runtime";

export const navIcons: Record<string, JSX.Element> = {
  "Carrito": <ShoppingCartIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Iniciar Sesión": <LoginIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Cerrar Sesión": <LogoutIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Perfil": <AccountCircleIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Gestion": <ManageAccountsIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Servicios": <HomeRepairServiceIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Sobre Nosotros": <InfoIcon sx={{ fontSize: 22, mr: 1 }} />,
  "Contacto": <ContactMailIcon sx={{ fontSize: 22, mr: 1 }} />,
};
