import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { QueryProvider } from "./providers/QueryProvider";

createRoot(document.getElementById("root")).render(
  <QueryProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryProvider>,
);
