import React from "react";
import { hydrate } from "react-dom";
import App from "./App";
import AppWithTimeout from "./AppWithTimeout";
import { createBrowserContext } from "use-sse";

const BrowserDataContext = createBrowserContext();

hydrate(
  <BrowserDataContext>
    <App />
    <AppWithTimeout />
  </BrowserDataContext>,
  document.getElementById("app")
);
