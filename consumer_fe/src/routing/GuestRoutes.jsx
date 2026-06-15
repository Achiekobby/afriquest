import { Route } from "react-router";
import GuestLayout from "../layouts/GuestLayout";
import AuthPageLayout from "../layouts/AuthPageLayout";
import AboutPage from "../pages/guest/AboutPage";
import ContactPage from "../pages/guest/ContactPage";
import ExperiencesPage from "../pages/guest/ExperiencesPage";
import HomePage from "../pages/guest/HomePage";
import LoginPage from "../pages/guest/LoginPage";
import SignupPage from "../pages/guest/SignupPage";
import StoriesPage from "../pages/guest/StoriesPage";
import StoryDetailPage from "../pages/guest/StoryDetailPage";
import MyBookingsPage from "../pages/guest/MyBookingsPage";
import TourBookingPage from "../pages/guest/TourBookingPage";
import TourDetailPage from "../pages/guest/TourDetailPage";
import ToursPage from "../pages/guest/ToursPage";
import WhyUsPage from "../pages/guest/WhyUsPage";
import { USER_ROLES } from "../constants/roles";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import RoleRoute from "./RoleRoute";

/**
 * Public marketing site — accessible to guests and authenticated users.
 * Login and signup use AuthPageLayout (no nav/footer, viewport-locked).
 */
const guestRoutes = (
  <>
    <Route element={<GuestLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="experiences" element={<ExperiencesPage />} />
      <Route path="tours" element={<ToursPage />} />
      <Route path="tours/:slug/book" element={<TourBookingPage />} />
      <Route path="tours/:slug" element={<TourDetailPage />} />
      <Route path="why-us" element={<WhyUsPage />} />
      <Route path="stories" element={<StoriesPage />} />
      <Route path="stories/:slug" element={<StoryDetailPage />} />
      <Route path="contact" element={<ContactPage />} />
    </Route>

    <Route element={<GuestLayout />}>
      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={[USER_ROLES.TOURIST]} />}>
          <Route path="my-bookings" element={<MyBookingsPage />} />
        </Route>
      </Route>
    </Route>

    <Route element={<AuthPageLayout />}>
      <Route element={<PublicOnlyRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Route>
  </>
);

export default guestRoutes;
