import { Outlet } from "react-router";
import Footer from "../components/layout/Footer";
import AuthNavbar from "../components/navigation/AuthNavbar";
import GuestNavbar from "../components/navigation/GuestNavbar";
import ScrollToTop from "../components/misc/ScrollToTop";
import { useAuth } from "../hooks/useAuth";

export default function GuestLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {isAuthenticated ? <AuthNavbar /> : <GuestNavbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
