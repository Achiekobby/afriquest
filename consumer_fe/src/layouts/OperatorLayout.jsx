import { NavLink, Outlet } from "react-router";
import { motion } from "motion/react";
import ScrollToTop from "../components/misc/ScrollToTop";
import { ROUTES } from "../constants/routes";
import { ROLE_META, USER_ROLES } from "../constants/roles";
import { images } from "../config/images";
import { useAuth } from "../hooks/useAuth";
import AppIcon from "../components/icons/AppIcon";

const EASE = [0.16, 1, 0.3, 1];

const NAV_ITEMS = [
  { to: ROUTES.operator.dashboard, label: "Overview", icon: "grid" },
  { to: ROUTES.operator.tours, label: "Tour listings", icon: "map" },
  { to: ROUTES.operator.bookings, label: "Bookings", icon: "calendar" },
  { to: ROUTES.operator.profile, label: "Profile", icon: "user" },
];

function NavIcon({ name }) {
  return <AppIcon name={name} className="h-5 w-5" />;
}

function SidebarLink({ to, label, icon, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-white text-brand-green shadow-sm ring-1 ring-brand-green/15"
            : "text-white/75 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      <NavIcon name={icon} />
      {label}
    </NavLink>
  );
}

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const operatorMeta = ROLE_META[USER_ROLES.SITE_OPERATOR];

  return (
    <div className="min-h-screen bg-brand-cream">
      <ScrollToTop />
      <div className="lg:flex">
        <aside className="hidden w-72 shrink-0 bg-brand-ink lg:fixed lg:inset-y-0 lg:flex lg:flex-col">
          <div className="flex flex-1 flex-col px-5 py-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
              <img src={images.general_logo} alt="AfriQwest" className="h-9 w-auto" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold">Operator hub</p>
                <p className="text-[11px] text-white/60">Tourist sites</p>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <SidebarLink key={item.to} to={item.to} label={item.label} icon={item.icon} end={item.to === ROUTES.operator.dashboard} />
              ))}
            </nav>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white">{user?.organization || user?.name || "Site operator"}</p>
              <p className="mt-1 text-[11px] text-white/55">{operatorMeta.label} account</p>
              <NavLink to={ROUTES.home} className="mt-3 inline-flex text-[11px] font-semibold text-brand-gold hover:underline">
                View public site →
              </NavLink>
            </div>

            <div className="mt-auto space-y-2 border-t border-white/10 pt-5">
              <NavLink to={ROUTES.operator.tourNew} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-brand-orange-dark">
                + New listing
              </NavLink>
              <button type="button" onClick={logout} className="w-full rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition-all hover:bg-white/10">
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
          <header className="sticky top-0 z-30 border-b border-brand-border/50 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="lg:hidden">
                <img src={images.general_logo} alt="AfriQwest" className="h-8 w-auto" />
              </div>
              <p className="hidden text-sm text-brand-muted lg:block">
                Managing listings for <span className="font-semibold text-brand-ink">{user?.organization || "your tourist site"}</span>
              </p>
              <div className="flex items-center gap-2 lg:hidden">
                <NavLink to={ROUTES.operator.tourNew} className="rounded-lg bg-brand-orange px-3 py-2 text-xs font-semibold text-white">+ New</NavLink>
                <button type="button" onClick={logout} className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-muted">Sign out</button>
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ROUTES.operator.dashboard}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${isActive ? "bg-brand-green text-white" : "bg-brand-cream text-brand-muted"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE }}>
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
