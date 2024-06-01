import { auth } from "config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect } from "react";
import Routes from "routes";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { setAuthPageLoading, setAuthenticated } from "store/slices/authSlice";
import Loader from "components/ui/Loader";

const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any | null) => {
      if (user) {
        const { token } = await user?.getIdTokenResult();
        dispatch(setAuthenticated({ user, token }));
      }

      dispatch(setAuthPageLoading(false));
    });

    return unsubscribe;
  }, []);

  const DashBoardLayout = lazy(() => import("./DashboardLayout"));
  const PublicLayout = lazy(() => import("./PublicLayout"));

  const Layout = token ? DashBoardLayout : PublicLayout;

  return (
    <Suspense fallback={<Loader />}>
      <Layout>
        <Routes />
      </Layout>
    </Suspense>
  );
};

export default AppLayout;
