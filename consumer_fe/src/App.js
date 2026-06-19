import { Navigate, Route, Routes } from "react-router";
import { ROUTES } from "./constants/routes";
import adminRoutes from "./routing/AdminRoutes";
import authRoutes from "./routing/AuthRoutes";
import guestRoutes from "./routing/GuestRoutes";
import operatorRoutes from "./routing/OperatorRoutes";
import Toastr from "./utils/Toastr";

function App() {
  return (
    <>
      <Toastr />
      <Routes>
        {adminRoutes}
        {guestRoutes}
        {authRoutes}
        {operatorRoutes}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}

export default App;
