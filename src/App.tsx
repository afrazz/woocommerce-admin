import { BrowserRouter } from "react-router-dom";
import AppLayout from "./components/common/AppLayout";
import { Provider, useDispatch } from "react-redux";
import store from "store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "config/firebaseConfig";
import { setAuthenticated } from "store/slices/authSlice";

const App = () => {
  //TODO: Add Custom History
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
