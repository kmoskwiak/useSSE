# useSSE

> use server-side effect

![useSSE](https://repository-images.githubusercontent.com/262809605/fa573c80-947f-11ea-82f7-3b07879599c4)

## Usage

Use `useSSE` to fetch data in component:

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
const [data] = useSSE(initial, key, effect, dependencies);
```

#### Params

| param          | type                 | required | description                                              | example                                            |
| -------------- | -------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------- |
| `initial`      | `any`                | true     | initial state                                            | `{}`                                               |
| `key`          | `string`             | true     | unique key to keep data in store                         | `'my_unique_key'`                                  |
| `effect`       | `() => Promise<any>` | true     | effect function returning promise which resolves to data | `() => fetch('example.com').then(res=>res.json())` |
| `dependencies` | `any[]`              | false    | list of dependencies like in useEffect                   | []                                                 |

#### Returns

`[data]` - where data is resolved data from effect.

### `createServerContext`

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
const data = await resolveData();
```

`data` is an object containing value of context.

Calling `data.toHtml()` will return a html script tak with stringified data:

```js
data.toHtml();
// "<script>window._initialDataContext = { context data };</script>"
```

Both should be used in server side render function.

### `createBroswerContext`

Creates client side context.

```js
const BroswerDataContext = createBroswerContext();
```

This function creates context provider for client side application.

```html
<BroswerDataContext>
  <App />
</BroswerDataContext>
```

## Examples

See [example](./example) directory for React with SSR and useSSE.

The same example is avaliable on [CodeSandbox](https://codesandbox.io/s/falling-waterfall-wnlwc?file=/README.md).
