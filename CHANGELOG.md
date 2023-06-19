# Changelog

## 3.x.x

## 3.0.0 Bling bang bang born

## 2.x.x

### 2.0.x

Initial state is no longer passed to hook. It will be always set to `null`.

```js
// before
const [data, error] = useSSE(
  { data: 'initial data' }
  () => {
    return fetch();
  },
  []
);
```

```js
// after
const [data, error] = useSSE(() => {
  return fetch();
}, []);
```

## 1.x.x

### 1.2.x

Errors are returned separately from data.

```js
// before
const [data] = useSSE();
// if error happend data.isError was true
```

```js
// now
const [data, error] = useSSE();
// error has all error details
```

### 1.1.x

#### timeout

If effect does not resolve before timeout error will be returned. Timeout value can be added to `resolveData` function.

### 1.0.x

This version comes with breaking changes. Versions `0.x.x` are not compatible.

- `key` param is no longer needed,
- name of global variable is now customizable,
- seperation of data an internal contexts.

Migration from `0.x.x` consists in removing `key` param from the `useSSE` hook calls:

```js
// before
const [data] = useSSE(
  {},
  "my_key",
  () => {
    return fetch();
  },
  []
);
```

```js
// after
const [data] = useSSE(
  {},
  () => {
    return fetch();
  },
  []
);
```
