import React from "react";
import ReactDOM from "react-dom";
// HashRouter so deep links and page refreshes work on GitHub Pages (static hosting, no server rewrites).
import { HashRouter as BrowserRouter } from "react-router-dom";
import App from "./App";
import { StoreProvider } from "./context/StoreContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
