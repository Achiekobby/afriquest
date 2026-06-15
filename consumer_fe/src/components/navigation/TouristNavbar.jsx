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

export default function TouristNavbar() {
  const { user, logout } = useAuth();

  const actions = (
    <>
      <NavLink to={ROUTES.dashboard} className={authLinkClass}>Dashboard</NavLink>
      <NavLink to={ROUTES.myBookings} className={authLinkClass}>My bookings</NavLink>
      <NavLink to={ROUTES.myInquiries} className={authLinkClass}>My inquiries</NavLink>
      <NavLink to={ROUTES.profile} className={authLinkClass}>Profile</NavLink>
      <span className="hidden max-w-[8rem] truncate text-sm text-brand-muted xl:inline">
        {user?.name || user?.phone || "Traveler"}
      </span>
      <button type="button" onClick={logout} className="btn-secondary">Sign out</button>
    </>
  );

  const mobileActions = (
    <>
      <NavLink to={ROUTES.dashboard} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>Dashboard</NavLink>
      <NavLink to={ROUTES.myBookings} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>My bookings</NavLink>
      <NavLink to={ROUTES.myInquiries} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>My inquiries</NavLink>
      <NavLink to={ROUTES.profile} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>Profile</NavLink>
      <button type="button" onClick={logout} className="btn-secondary w-full justify-center py-3">Sign out</button>
    </>
  );

  return <NavbarShell actions={actions} mobileActions={mobileActions} />;
}
