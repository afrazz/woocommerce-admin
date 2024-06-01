import { protectedRoutes, publicRoutes } from "config/RoutesConfig";
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { useAppSelector } from "hooks/useStore";
import Loader from "components/ui/Loader";

const Routes: React.FC = () => {
  const { authPageLoading } = useAppSelector((state) => state.auth);
  return (
    <>
      {authPageLoading ? (
        <Loader />
      ) : (
        <RouterRoutes>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<Navigate replace to={"/dashboards/orders"} />}
            />
            {protectedRoutes.map((route, index) => {
              return (
                <Route
                  key={route.key + index}
                  path={route.path}
                  element={<route.component />}
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          <Route path="/" element={<PublicRoute />}>
            {publicRoutes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              );
            })}
          </Route>
        </RouterRoutes>
      )}
    </>
  );
};

export default Routes;
