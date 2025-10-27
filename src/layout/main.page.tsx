import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar.component";
import Footer from "../components/footer/footer.component";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header>
        <Navbar />
      </header>

      <main className="">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
