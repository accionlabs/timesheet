import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import App from "./App.jsx";
import store from "./store";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);
