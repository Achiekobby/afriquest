import { Outlet } from "react-router";
import TouristNavbar from "../components/navigation/TouristNavbar";
import ScrollToTop from "../components/misc/ScrollToTop";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <ScrollToTop />
      <TouristNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
