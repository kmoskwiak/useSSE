import React from "react";
import { hydrate } from "react-dom";
import App from "./App";
import AppWithTimeout from "./AppWithTimeout";
import { createBroswerContext } from "use-sse";

const BroswerDataContext = createBroswerContext();

hydrate(
  <BroswerDataContext>
    <App />
    <AppWithTimeout />
  </BroswerDataContext>,
  document.getElementById("app")
);
