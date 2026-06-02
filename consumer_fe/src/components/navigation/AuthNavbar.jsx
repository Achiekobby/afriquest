import { NavLink } from "react-router";
import NavbarShell from "./NavbarShell";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

const authLinkClass = ({ isActive }) =>
  [
    "relative text-sm transition-colors duration-200",
    isActive
      ? "font-semibold text-brand-green after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand-orange"
      : "font-medium text-brand-muted hover:text-brand-green",
  ].join(" ");

export default function AuthNavbar() {
  const { user, logout } = useAuth();

  const authActions = (
    <>
      <NavLink to={ROUTES.dashboard} className={authLinkClass}>
        Dashboard
      </NavLink>
      <NavLink to={ROUTES.myBookings} className={authLinkClass}>
        My bookings
      </NavLink>
      <NavLink to={ROUTES.myInquiries} className={authLinkClass}>
        My inquiries
      </NavLink>
      <span className="hidden max-w-[8rem] truncate text-sm text-brand-muted xl:inline">
        {user?.name || user?.phone || "Account"}
      </span>
      <button type="button" onClick={logout} className="btn-secondary">
        Sign out
      </button>
    </>
  );

  const authMobileActions = (
    <>
      <NavLink
        to={ROUTES.dashboard}
        className={({ isActive }) =>
          [
            "block rounded-xl px-4 py-3 text-base font-medium",
            isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream",
          ].join(" ")
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to={ROUTES.myBookings}
        className={({ isActive }) =>
          [
            "block rounded-xl px-4 py-3 text-base font-medium",
            isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream",
          ].join(" ")
        }
      >
        My bookings
      </NavLink>
      <NavLink
        to={ROUTES.myInquiries}
        className={({ isActive }) =>
          [
            "block rounded-xl px-4 py-3 text-base font-medium",
            isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream",
          ].join(" ")
        }
      >
        My inquiries
      </NavLink>
      <p className="px-4 text-sm text-brand-muted">
        {user?.name || user?.phone || "Account"}
      </p>
      <button type="button" onClick={logout} className="btn-secondary w-full justify-center py-3">
        Sign out
      </button>
    </>
  );

  return <NavbarShell actions={authActions} mobileActions={authMobileActions} />;
}
