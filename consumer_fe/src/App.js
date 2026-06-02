import { Navigate, Route, Routes } from "react-router";
import { ROUTES } from "./constants/routes";
import authRoutes from "./routing/AuthRoutes";
import guestRoutes from "./routing/GuestRoutes";
import Toastr from "./utils/Toastr";

function App() {
  return (
    <>
      <Toastr />
      <Routes>
        {guestRoutes}
        {authRoutes}
        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </>
  );
}

export default App;
