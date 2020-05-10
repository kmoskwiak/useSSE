import express from "express";
import React from "react";
import { renderToNodeStream, renderToString } from "react-dom/server";
import App from "./App";
import pageParts from "./index.html";
import path from "path";

import { createServerContext } from "use-sse";

const app = express();
app.use("/static", express.static(path.resolve(__dirname, "./build")));

app.use("/", async (req, res) => {
  if (req.url !== "/") {
    return res.status(404).end();
  }

  const { ServerDataContext, resolveData } = createServerContext();

  res.write(pageParts[0]);

  renderToString(
    <ServerDataContext>
      <App />
    </ServerDataContext>
  );

  const data = await resolveData();
  res.write(data.toHtml());

  res.write(pageParts[1]);

  const htmlStream = renderToNodeStream(
    <ServerDataContext>
      <App />
    </ServerDataContext>
  );

  htmlStream.pipe(res, { end: false });
  htmlStream.on("end", () => {
    res.write(pageParts[2]);
    res.end();
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log(`${new Date()} Server listening on port 3000`);
});
