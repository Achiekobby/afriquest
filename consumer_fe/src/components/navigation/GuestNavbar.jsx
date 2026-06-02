import { Link } from "react-router";
import NavbarShell from "./NavbarShell";
import { ROUTES } from "../../constants/routes";

const guestActions = (
  <>
    <Link
      to={ROUTES.myBookings}
      className="text-sm font-medium text-brand-green transition-colors duration-200 hover:text-brand-green-dark"
    >
      My bookings
    </Link>
    <Link
      to={ROUTES.login}
      className="text-sm font-medium text-brand-muted transition-colors duration-200 hover:text-brand-green"
    >
      Sign in
    </Link>
    <Link
      to={ROUTES.signup}
      className="btn-accent shadow-[0_8px_20px_-8px_rgba(212,97,26,0.65)]"
    >
      Get started
    </Link>
  </>
);

const guestMobileActions = (
  <>
    <Link to={ROUTES.myBookings} className="btn-secondary w-full justify-center py-3">
      My bookings
    </Link>
    <Link to={ROUTES.login} className="btn-secondary w-full justify-center py-3">
      Sign in
    </Link>
    <Link
      to={ROUTES.signup}
      className="btn-accent w-full justify-center py-3 shadow-[0_8px_20px_-8px_rgba(212,97,26,0.65)]"
    >
      Get started
    </Link>
  </>
);

export default function GuestNavbar() {
  return <NavbarShell actions={guestActions} mobileActions={guestMobileActions} />;
}
