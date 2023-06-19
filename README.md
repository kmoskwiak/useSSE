# useSSE 3.x.x-beta

> [!CAUTION]
> 3.x.x is still in beta

> [!NOTE]
> You are viewing a v3.x.x version of hook which is designed to be compatible with React 18. This version of hook is still in beta.
> If you are using React <18 check latest stable [2.x.x version of useSSE](https://github.com/kmoskwiak/useSSE/tree/v2.0.1)

![useSSE](https://repository-images.githubusercontent.com/262809605/78398700-a279-11ea-9ba2-4c15b6a1ec9a)
[![npm version](https://badgen.net/npm/v/use-sse)](https://www.npmjs.com/package/use-sse)
![Node.js CI](https://github.com/kmoskwiak/useSSE/workflows/CI/badge.svg?branch=master)

`useSSE` is abbreviation for use server-side effect. It is a custom React hook to perform asynchronous effects both on client and serve side.

```
npm i use-sse
```

## Usage

Use `useSSE` to fetch data in component:

```jsx
import { useSSE } from "use-sse";

/**
 * Create a custom component with effect 
 **/
const TitleComponent = () => {
  const [data, error] = useSSE(() => {
    return fetch("https://myapi.example.com").then((res) => res.json());
  }, []);

  return <h1>{data.title}</h1>;
};

/**
 * To take full advantage of a Suspense boundaries wrap each component in UniversalDataProvider 
 * You can also use ServerDataProvider or BrowserDataProvider
 **/
export const Title = () => {
	return (
		<UniversalDataProvider>
			<TitleComponent />
		</UniversalDataProvider>
	)
}
```

Load component using Suspense API:

```jsx
import * as React from 'react';
import Title from './Title';

export const App = () => (
	<div>
		<React.Suspense fallback={'Loading...'}>
			<Title/>
		</React.Suspense>
	</div>
);
```

All effects will be resolved on server side during rendering.

This is a part of server side render phase. See an example for the whole code.

```jsx
const stream = renderToPipeableStream(
		<App />,
		{
			onShellReady() {
				res.statusCode = didError ? 500 : 200;
				res.setHeader('Content-type', 'text/html');
				stream.pipe(res);
			},
			onShellError() {
				res.statusCode = 500;
				res.send('<h1>An error occurred</h1>');
			},
			onError(err) {
				didError = true;
				console.error(err);
			},
		},
	);
```

On client side of application use `BroswerDataContext`:

```jsx
hydrate(
  <App />,
  document.getElementById("app")
);
```

## API

### useSSE

```js
const [data, error] = useSSE(effect, dependencies);
```

#### Params

| param          | type                 | required | description                                              | example                                            |
| -------------- | -------------------- | -------- | -------------------------------------------------------- | -------------------------------------------------- |
| `effect`       | `() => Promise<any>` | true     | effect function returning promise which resolves to data | `() => fetch('example.com').then(res=>res.json())` |
| `dependencies` | `any[]`              | false    | list of dependencies like in useEffect                   | []                                                 |

#### Returns

Returns an array with two elements `[data, error]`.

- `data` - resolved response from effect
- `error` - an error if effect rejected or if timeout happend.



## Examples

See [example](./example) directory for React with SSR and useSSE.

The same example is avaliable on [CodeSandbox](https://codesandbox.io/s/falling-waterfall-wnlwc?file=/README.md).
