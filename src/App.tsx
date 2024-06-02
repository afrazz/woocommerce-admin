import { BrowserRouter } from "react-router-dom";
import AppLayout from "./components/common/AppLayout";
import { Provider } from "react-redux";
import store from "store";

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
