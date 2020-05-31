# useSSE

![useSSE](https://repository-images.githubusercontent.com/262809605/78398700-a279-11ea-9ba2-4c15b6a1ec9a)
[![npm version](https://badgen.net/npm/v/use-sse)](https://www.npmjs.com/package/use-sse)
![Node.js CI](https://github.com/kmoskwiak/useSSE/workflows/Node.js%20CI/badge.svg?branch=master)

`useSSE` is abbreviation for use server-side effect. It is a custom React hook to perform asynchronous effects both on client and serve side.

```
npm i use-sse
```

## Usage

Use `useSSE` to fetch data in component:

```jsx
import React from "react";
import { useSSE } from "use-sse";

const MyComponent = () => {
  const [data, error] = useSSE(
    {
      title: "my initial data",
    },
    () => {
      return fetch("https://myapi.example.com").then((res) => res.json());
    },
    []
  );

  return <div>{data.title}</div>;
};
```

All effects will be resolved on server side during rendering.

This is a part of server side render phase. Se an example for the whole code.

```js
const { ServerDataContext, resolveData } = createServerContext();

// We need to render app twice.
// First - render App to reqister all effects
renderToString(
  <ServerDataContext>
    <App />
  </ServerDataContext>
);

// Wait for all effects to finish
const data = await resolveData();

// Inject into html initial data
res.write(data.toHtml());

// Render App for the second time
// This time data form effects will be avaliable in components
const htmlStream = renderToNodeStream(
  <ServerDataContext>
    <App />
  </ServerDataContext>
);
```

On client side of application use `BroswerDataContext`:

```js
// This will create context will all data fetched during server side rendering
const BroswerDataContext = createBroswerContext();

hydrate(
  <BroswerDataContext>
    <App />
  </BroswerDataContext>,
  document.getElementById("app")
);
```

## API

### useSSE hook

```js
const [data, error] = useSSE(initial, effect, dependencies);
```

#### Params

| param          | type                 | required | description                                              | example                                            |
| -------------- | -------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------- |
| `initial`      | `any`                | true     | initial state                                            | `{}`                                               |
| `effect`       | `() => Promise<any>` | true     | effect function returning promise which resolves to data | `() => fetch('example.com').then(res=>res.json())` |
| `dependencies` | `any[]`              | false    | list of dependencies like in useEffect                   | []                                                 |

#### Returns

Returns an array with two elements `[data, error]`.

- `data` - resolved response from effect
- `error` - an error if effect rejected or if timeout happend.

---

### createServerContext()

Creates server side context.

```js
const { ServerDataContext, resolveData } = createServerContext();
```

#### Returns

`ServerDataContext` - React context provider component.

```html
<ServerDataContext>
  <App />
</ServerDataContext>
```

`resolveData` - function to resolve all effects.

```js
const data = await resolveData(timeout);
```

| param     | type     | required | default value | description                                     |
| --------- | -------- | -------- | ------------- | ----------------------------------------------- |
| `timeout` | `number` | false    | `undefined`   | max number of ms to wait for effects to resolve |

`data` is an object containing value of context.

Calling `data.toHtml(variableName)` will return a html script tak with stringified data:

| param          | type     | required | default value        | description             |
| -------------- | -------- | -------- | -------------------- | ----------------------- |
| `variableName` | `string` | false    | \_initialDataContext | name of global variable |

```js
data.toHtml();
// "<script>window._initialDataContext = { context data };</script>"
```

Both should be used in server side render function.

---

### createBroswerContext()

Creates client side context.

```js
createBroswerContext(variableName);
```

#### params

| param          | type     | required | default value        | description             |
| -------------- | -------- | -------- | -------------------- | ----------------------- |
| `variableName` | `string` | false    | \_initialDataContext | name of global variable |

#### returns

`BroswerDataContext` - React context provider for client side application

```html
<BroswerDataContext>
  <App />
</BroswerDataContext>
```

## Examples

See [example](./example) directory for React with SSR and useSSE.

The same example is avaliable on [CodeSandbox](https://codesandbox.io/s/falling-waterfall-wnlwc?file=/README.md).
