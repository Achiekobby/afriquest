import { NavLink } from "react-router";
import NavbarShell from "./NavbarShell";
import { ROUTES } from "../../constants/routes";
import { useAuth } from "../../hooks/useAuth";

const linkClass = ({ isActive }) =>
  [
    "relative text-sm transition-colors duration-200",
    isActive
      ? "font-semibold text-brand-green after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand-orange"
      : "font-medium text-brand-muted hover:text-brand-green",
  ].join(" ");

export default function OperatorNavbar() {
  const { user, logout } = useAuth();

  const actions = (
    <>
      <NavLink to={ROUTES.operator.dashboard} className={linkClass}>Operator hub</NavLink>
      <NavLink to={ROUTES.operator.tours} className={linkClass}>My listings</NavLink>
      <NavLink to={ROUTES.home} className={linkClass}>Public site</NavLink>
      <span className="hidden max-w-[10rem] truncate text-sm text-brand-muted xl:inline">
        {user?.organization || user?.name || "Operator"}
      </span>
      <button type="button" onClick={logout} className="btn-secondary">Sign out</button>
    </>
  );

  const mobileActions = (
    <>
      <NavLink to={ROUTES.operator.dashboard} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>Operator hub</NavLink>
      <NavLink to={ROUTES.operator.tours} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>My listings</NavLink>
      <NavLink to={ROUTES.home} className={({ isActive }) => `block rounded-xl px-4 py-3 text-base font-medium ${isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream"}`}>Public site</NavLink>
      <button type="button" onClick={logout} className="btn-secondary w-full justify-center py-3">Sign out</button>
    </>
  );

  return <NavbarShell actions={actions} mobileActions={mobileActions} />;
}
