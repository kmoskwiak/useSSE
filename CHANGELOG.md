# Changelog

## 1.x.x

### 1.0.0

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
