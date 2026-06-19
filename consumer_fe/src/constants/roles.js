import { ROUTES } from "./routes";

export const USER_ROLES = {
  TOURIST: "tourist",
  SITE_OPERATOR: "site_operator",
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
};

export function getHomeRouteForRole(role) {
  return role === USER_ROLES.SITE_OPERATOR
    ? ROUTES.operator.dashboard
    : ROUTES.dashboard;
}

/** Public landing after sign-in — travelers return to the marketing home. */
export function getGuestLandingRoute(role) {
  return role === USER_ROLES.SITE_OPERATOR
    ? ROUTES.operator.dashboard
    : ROUTES.home;
}

export function isOperatorRole(role) {
  return role === USER_ROLES.SITE_OPERATOR;
}

export function isTouristRole(role) {
  return role === USER_ROLES.TOURIST;
}

const TOURIST_ONLY_PREFIXES = ["/dashboard", "/profile", "/my-inquiries", "/my-bookings"];
const OPERATOR_PREFIX = "/operator";

export function canAccessPath(pathname, role) {
  if (!pathname) return true;
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
