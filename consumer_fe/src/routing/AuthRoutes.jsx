import { Route } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../pages/auth/DashboardPage";
import MyInquiriesPage from "../pages/auth/MyInquiriesPage";
import ProfilePage from "../pages/auth/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

/**
 * Authenticated-only area — requires OTP session.
 */
const authRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<AuthLayout />}>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="my-inquiries" element={<MyInquiriesPage />} />
    </Route>
  </Route>
);

export default authRoutes;
