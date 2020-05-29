import React, { useState } from "react";
import { useSSE } from "use-sse";

const AppWithTimeout = () => {
  const [data] = useSSE(
    {},
    () => {
      return new Promise(() => {
        // This will never resolve
      });
    },
    []
  );

  return <>{data.isError ? <pre>Error! Server did not respond.</pre> : null}</>;
};

export default AppWithTimeout;
