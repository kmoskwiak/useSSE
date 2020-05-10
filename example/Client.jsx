import React from "react";
import { hydrate } from "react-dom";
import App from "./App";
import { createBroswerContext } from "use-sse";

const BroswerDataContext = createBroswerContext();

hydrate(
  <BroswerDataContext>
    <App />
  </BroswerDataContext>,
  document.getElementById("app")
);
