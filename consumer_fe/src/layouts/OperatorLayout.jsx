import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  ExternalLink,
  Landmark,
  LogOut,
  Map,
  Menu,
  Plus,
  UserCircle,
} from "lucide-react";
import ScrollToTop from "../components/misc/ScrollToTop";
import AccountDropdown from "../components/navigation/AccountDropdown";
import { images } from "../config/images";
import { ROUTES } from "../constants/routes";
import { ROLE_META, USER_ROLES } from "../constants/roles";
import { useAuth } from "../hooks/useAuth";

const EASE = [0.22, 1, 0.36, 1];

const NAV_ITEMS = {
  overview: [{ to: ROUTES.operator.dashboard, label: "Dashboard", icon: BarChart3, end: true }],
  listings: [{ to: ROUTES.operator.tours, label: "Tour listings", icon: Map }],
  operations: [{ to: ROUTES.operator.bookings, label: "Bookings", icon: CalendarCheck }],
  account: [{ to: ROUTES.operator.profile, label: "Profile", icon: UserCircle }],
};

function NavItem({ to, label, icon: Icon, end = false, collapsed = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          "group flex items-center gap-3 rounded-xl transition-all duration-200",
          collapsed ? "justify-center px-0 py-3" : "px-3 py-2.5",
          isActive
            ? "bg-white/95 text-brand-green shadow-sm ring-1 ring-brand-green/10"
            : "text-white/65 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={["h-5 w-5 shrink-0 transition-colors", isActive ? "text-brand-green" : "text-white/65 group-hover:text-white"].join(" ")}
            strokeWidth={1.75}
            aria-hidden
          />
          {!collapsed && <span className="truncate text-sm font-semibold">{label}</span>}
          {!collapsed && isActive && (
            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden />
          )}
        </>
      )}
    </NavLink>
  );
}

function NavSection({ title, collapsed, children }) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">{title}</p>
      )}
      {collapsed && <div className="mb-2 border-t border-white/10" />}
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function OperatorSidebar({ user, collapsed, onCollapse, onNavigate }) {
  const { logout } = useAuth();
  const operatorMeta = ROLE_META[USER_ROLES.SITE_OPERATOR];
  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "O";

  return (
    <div className="flex h-full flex-col bg-[#111a16]">
      <div className={["flex items-center gap-3 border-b border-white/10 px-5 py-5", collapsed ? "justify-center px-3" : ""].join(" ")}>
        {!collapsed ? (
          <>
            <img src={images.general_logo} alt="AfriQwest" className="h-8 w-auto" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-gold">Operator hub</p>
              <p className="truncate text-[11px] text-white/40">{operatorMeta.label}</p>
            </div>
          </>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
            <Landmark className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
        )}
      </div>

      <div className={["flex flex-1 flex-col gap-6 overflow-y-auto py-5", collapsed ? "px-3" : "px-4"].join(" ")}>
        <NavSection title="Overview" collapsed={collapsed}>
          {NAV_ITEMS.overview.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </NavSection>

        <NavSection title="Listings" collapsed={collapsed}>
          {NAV_ITEMS.listings.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
          ))}
          {!collapsed ? (
            <NavLink
              to={ROUTES.operator.tourNew}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl border border-brand-orange/30 bg-brand-orange/10 px-3 py-2.5 text-sm font-semibold text-brand-orange transition-colors hover:bg-brand-orange/20"
            >
              <Plus className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              New listing
            </NavLink>
          ) : (
            <NavLink
              to={ROUTES.operator.tourNew}
              onClick={onNavigate}
              title="New listing"
              className="flex justify-center rounded-xl bg-brand-orange py-3 text-white transition-colors hover:bg-brand-orange-dark"
            >
              <Plus className="h-5 w-5" strokeWidth={2} aria-hidden />
            </NavLink>
          )}
        </NavSection>

        <NavSection title="Operations" collapsed={collapsed}>
          {NAV_ITEMS.operations.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </NavSection>

        <NavSection title="Account" collapsed={collapsed}>
          {NAV_ITEMS.account.map((item) => (
            <NavItem key={item.to} {...item} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </NavSection>
      </div>

      <div className={["border-t border-white/10 py-4", collapsed ? "px-3" : "px-4"].join(" ")}>
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-white/5 px-3 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gold text-sm font-bold text-brand-ink">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.organization || user?.name || "Operator"}</p>
                <p className="truncate text-[11px] text-white/45">{user?.name || user?.email || "Site operator"}</p>
              </div>
            </div>
            {user?.isVerified ? (
              <p className="mt-2 inline-flex rounded-full bg-brand-green/15 px-2 py-0.5 text-[10px] font-semibold text-brand-green">
                Verified operator
              </p>
            ) : null}
            <NavLink
              to={ROUTES.home}
              onClick={onNavigate}
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-gold transition-colors hover:text-white"
            >
              View public site
              <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden />
            </NavLink>
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Sign out" : undefined}
          className={[
            "flex w-full items-center gap-3 rounded-xl text-sm font-semibold text-white/60 transition-colors hover:bg-red-500/15 hover:text-red-400",
            collapsed ? "justify-center py-2.5" : "px-3 py-2.5",
          ].join(" ")}
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
          {!collapsed && "Sign out"}
        </button>

        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "mt-2 flex w-full items-center gap-3 rounded-xl text-sm font-semibold text-white/30 transition-colors hover:bg-white/5 hover:text-white/60",
              collapsed ? "justify-center py-2.5" : "px-3 py-2.5",
            ].join(" ")}
          >
            <ChevronLeft
              className={["h-4 w-4 shrink-0 transition-transform duration-300", collapsed ? "rotate-180" : ""].join(" ")}
              strokeWidth={2}
              aria-hidden
            />
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OperatorLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarWidth = collapsed ? "w-[68px]" : "w-72";
  const sidebarPad = collapsed ? "lg:pl-[68px]" : "lg:pl-72";

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      <ScrollToTop />

      <aside className={["fixed inset-y-0 left-0 z-40 hidden transition-all duration-300 lg:block", sidebarWidth].join(" ")}>
        <OperatorSidebar user={user} collapsed={collapsed} onCollapse={() => setCollapsed((current) => !current)} />
      </aside>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <OperatorSidebar user={user} collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className={["flex min-h-screen flex-col transition-all duration-300", sidebarPad].join(" ")}>
        <header className="sticky top-0 z-30 border-b border-black/8 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-border/60 text-brand-muted transition-colors hover:bg-brand-cream lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </button>
              <div className="hidden min-w-0 lg:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Operator hub</p>
                <p className="truncate text-sm font-bold text-brand-ink">{user?.organization || user?.name || "Your dashboard"}</p>
              </div>
              <div className="min-w-0 lg:hidden">
                <p className="truncate text-sm font-bold text-brand-ink">{user?.organization || user?.name || "Operator hub"}</p>
                <p className="truncate text-[11px] text-brand-muted">{user?.name || "Site operator"}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <NavLink
                to={ROUTES.operator.tourNew}
                className="hidden items-center gap-1.5 rounded-xl bg-brand-orange px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange-dark sm:inline-flex"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                New listing
              </NavLink>
              <AccountDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
