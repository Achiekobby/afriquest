import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, LayoutDashboard, LogOut, Luggage, User } from "lucide-react";
import { ADMIN_PERMISSIONS } from "../../constants/adminPermissions";
import { ROUTES } from "../../constants/routes";
import { USER_ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";

const EASE = [0.16, 1, 0.3, 1];

function getMenuItems(role, user, hasAdminPermission) {
  if (role === USER_ROLES.ADMINISTRATOR) {
    const items = [{ to: ROUTES.admin.dashboard, label: "Dashboard", icon: LayoutDashboard }];

    if (hasAdminPermission(ADMIN_PERMISSIONS.BOOKING_MANAGEMENT)) {
      items.push({ to: ROUTES.admin.bookings, label: "Bookings", icon: Luggage });
    }

    items.push({ to: ROUTES.admin.profile, label: "Profile", icon: User });
    return items;
  }

  return [
    { to: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
    { to: ROUTES.myBookings, label: "My bookings", icon: Luggage },
    { to: ROUTES.profile, label: "Profile", icon: User },
  ];
}

function getInitials(user) {
  const first = user?.firstName?.[0] || user?.name?.[0] || "";
  const last = user?.lastName?.[0] || "";
  const initials = `${first}${last}`.toUpperCase();
  return initials || "AQ";
}

function getDisplayName(user) {
  return user?.name || user?.firstName || user?.email || user?.phone || "Account";
}

export function AccountMenuLinks({ onNavigate, className = "" }) {
  const { logout, role, user, hasAdminPermission } = useAuth();
  const menuItems = getMenuItems(role, user, hasAdminPermission);

  return (
    <div className={className}>
      {menuItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-brand-green/10 text-brand-green" : "text-brand-ink hover:bg-brand-cream",
            ].join(" ")
          }
        >
          <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden />
          {label}
        </NavLink>
      ))}
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          logout();
        }}
        className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} aria-hidden />
        Sign out
      </button>
    </div>
  );
}

export default function AccountDropdown() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const displayName = getDisplayName(user);
  const initials = getInitials(user);
  const subtitle = user?.email || user?.phone || "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={[
          "inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-sm font-semibold transition-all",
          open
            ? "border-brand-green/30 bg-brand-green/5 text-brand-green ring-2 ring-brand-green/15"
            : "border-brand-border/70 bg-white/80 text-brand-ink hover:border-brand-green/30 hover:bg-white",
        ].join(" ")}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <span className="hidden max-w-[7rem] truncate sm:inline">{displayName}</span>
        <ChevronDown
          className={["h-4 w-4 text-brand-muted transition-transform duration-200", open ? "rotate-180" : ""].join(" ")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-brand-border/60 bg-white shadow-[0_16px_48px_-20px_rgba(28,43,38,0.35)]"
            role="menu"
          >
            <div className="border-b border-brand-border/50 bg-brand-cream/40 px-4 py-3">
              <p className="truncate text-sm font-semibold text-brand-ink">{displayName}</p>
              {subtitle ? <p className="mt-0.5 truncate text-xs text-brand-muted">{subtitle}</p> : null}
            </div>

            <div className="p-2">
              <AccountMenuLinks onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function AccountMobileSection({ onNavigate }) {
  const { user } = useAuth();
  const displayName = getDisplayName(user);
  const subtitle = user?.email || user?.phone || "";

  return (
    <div className="rounded-2xl border border-brand-border/50 bg-brand-cream/50 p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-brand-green text-sm font-bold text-white">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="" className="h-full w-full object-cover" />
          ) : (
            getInitials(user)
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-ink">{displayName}</p>
          {subtitle ? <p className="truncate text-xs text-brand-muted">{subtitle}</p> : null}
        </div>
      </div>
      <AccountMenuLinks onNavigate={onNavigate} />
    </div>
  );
}
