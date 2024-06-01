import { useAppSelector } from "hooks/useStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute: React.FC = () => {
  const { token } = useAppSelector((state) => state.auth);

  return token ? <Navigate to={"/dashboard/default"} /> : <Outlet />;
};

export default PublicRoute;
