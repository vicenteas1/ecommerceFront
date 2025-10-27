import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/main.page";
import HomePage from "../pages/home/home.page";
import About from "../pages/about/about.page";
import UnderConstruction from "../pages/under-construction/under-construction.page";
import LoginPage from "../pages/login/login.page";
import RegisterPage from "../pages/register/register";
import UsersManagementPage from "../pages/gestion/usuarios/user.page";
import GestionCategoriasPage from "../pages/gestion/categorias/categories.page";
import GestionTiposPage from "../pages/gestion/tipos/tipos.page";
import GestionItemsPage from "../pages/gestion/items/items.page";
import QuienesSomosPage from "../pages/about/about.page";
import ProyectosPage from "../pages/about/proyectos.page";
import MisionVisionPage from "../pages/about/mision-vision.page";
import ServiciosListadoPage from "../pages/servicios/listar-servicios";
import ContactoPage from "../pages/contact/contact.page";
import ProfilePage from "../pages/profile/profile.page";
import ServiciosDetallePage from "../pages/servicios/detalle-servicios";
import CarritoPage from "../pages/cart/cart.page";
import CheckoutSuccessPage from "../pages/checkout/success.page";
import CheckoutFailurePage from "../pages/checkout/failure.page";
import CheckoutPendingPage from "../pages/checkout/pending.page";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="gestion/items" element={<GestionItemsPage />} />
          <Route path="gestion/usuarios" element={<UsersManagementPage />} />
          <Route path="gestion/categorias" element={<GestionCategoriasPage />} />
          <Route path="gestion/tipos" element={<GestionTiposPage />} />
          <Route path="profile" element={<UsersManagementPage />} />
          <Route path="/servicio/quienes-somos"      element={<QuienesSomosPage />} />
          <Route path="/servicio/nuestros-proyectos" element={<ProyectosPage />} />
          <Route path="/servicio/mision-vision"      element={<MisionVisionPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/servicios" element={<ServiciosListadoPage />} />
          <Route path="/servicio"  element={<ServiciosListadoPage />} />
          <Route path="/servicios/detalle/:id" element={<ServiciosDetallePage />}/>
          <Route path="/cart" element={<CarritoPage />}/>
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/failure" element={<CheckoutFailurePage />} />
          <Route path="/checkout/pending" element={<CheckoutPendingPage />} />
          <Route path="*" element={<UnderConstruction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
