import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { Loader } from "./components/layouts/loader/loader.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Loader>
      <App />
    </Loader>
  </React.StrictMode>
);
