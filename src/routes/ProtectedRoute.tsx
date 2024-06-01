import React from "react";
import { useAppSelector } from "hooks/useStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);
  if (!token) {
    return <Navigate to={`/public/login`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
