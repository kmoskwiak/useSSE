import React, { useState } from "react";
import { useSSE } from "use-sse";

const App = () => {
  const [shouldRefresh, setRefresh] = useState(0);
  const refresh = () => {
    setRefresh(shouldRefresh + 1);
  };

  const [data] = useSSE(
    { message: "Hello!" },
    "my_data",
    () => {
      return new Promise((resolve) => {
        // Resolve data after 1s
        setTimeout(() => {
          let number = Math.random();
          console.log(`Request ID is ${number}`);
          resolve({
            message: `Hello world from async API!\nRequest ID: ${number}`,
          });
        }, 1000);
      });
    },
    [shouldRefresh]
  );

  return (
    <>
      <pre>{data.message}</pre>
      <button onClick={refresh}>refresh</button>
    </>
  );
};

export default App;
