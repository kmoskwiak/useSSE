# useSSE

> use server-side effect

```jsx
import React from "react";
import { useSSE } from "use-sse";

const MyComponent = () => {
  const [data] = useSSE(
    {
      title: "my initial data",
    },
    "myComponentState",
    () => {
      return fetch("https://myapi.example.com").then((res) => res.json());
    },
    []
  );

  return <div>{data.title}</div>;
};
```
