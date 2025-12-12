import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Nếu KHÔNG có token → đẩy về login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Nếu có token và đang ở /login → đẩy về /main
  if (token && ['/', '/login'].includes(location.pathname)) {
    return <Navigate to="/main" replace />;
  }

  // Còn lại: cho vào
  return <Outlet />;
};

export default ProtectedRoute;