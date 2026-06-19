import { ROUTES } from "./routes";

export const USER_ROLES = {
  TOURIST: "tourist",
  SITE_OPERATOR: "site_operator",
  ADMINISTRATOR: "administrator",
};

export const ROLE_META = {
  [USER_ROLES.TOURIST]: {
    label: "Traveler",
    shortLabel: "Traveler",
    description: "Browse tours, book trips, and manage your reservations.",
    icon: "luggage",
  },
  [USER_ROLES.SITE_OPERATOR]: {
    label: "Site operator",
    shortLabel: "Operator",
    description: "Manage tourist site listings, departures, and bookings.",
    icon: "landmark",
  },
  [USER_ROLES.ADMINISTRATOR]: {
    label: "Administrator",
    shortLabel: "Admin",
    description: "Manage platform users, bookings, listings, and internal operations.",
    icon: "shield",
  },
};

export function getHomeRouteForRole(role) {
  if (role === USER_ROLES.ADMINISTRATOR) return ROUTES.admin.dashboard;
  if (role === USER_ROLES.SITE_OPERATOR) return ROUTES.operator.dashboard;
  return ROUTES.dashboard;
}

/** Public landing after sign-in — travelers return to the marketing home. */
export function getGuestLandingRoute(role) {
  if (role === USER_ROLES.ADMINISTRATOR) return ROUTES.admin.dashboard;
  if (role === USER_ROLES.SITE_OPERATOR) return ROUTES.operator.dashboard;
  return ROUTES.home;
}

export function isOperatorRole(role) {
  return role === USER_ROLES.SITE_OPERATOR;
}

export function isTouristRole(role) {
  return role === USER_ROLES.TOURIST;
}

export function isAdminRole(role) {
  return role === USER_ROLES.ADMINISTRATOR;
}

const TOURIST_ONLY_PREFIXES = ["/dashboard", "/profile", "/my-inquiries", "/my-bookings"];
const OPERATOR_PREFIX = "/operator";
const ADMIN_PREFIX = "/admin";

export function canAccessPath(pathname, role) {
  if (!pathname) return true;
  if (pathname.startsWith(ADMIN_PREFIX)) return isAdminRole(role);
  if (pathname.startsWith(OPERATOR_PREFIX)) return isOperatorRole(role);
  if (TOURIST_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return isTouristRole(role);
  }
  return true;
}

export function resolvePostAuthRedirect(pathname, role) {
  if (pathname && canAccessPath(pathname, role)) return pathname;
  return getHomeRouteForRole(role);
}
