# useSSE example

This is simple React with SSR example with useSSE.

Inside `example` directory execute:

```bash
npm install
npm start
```

Go to `localhost:3000`.

Expected output in broswer:

```
Hello world from async API!
Request ID: 0.17319854371244103
```

Where `Request ID` should be the same as in server log.

Expected page source:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      window._initialDataContext = {
        my_data: {
          message:
            "Hello world from async API!\nRequest ID: 0.17319854371244103",
        },
      };
    </script>
  </head>
  <body>
    <div id="app">
      <pre>
Hello world from async API!
Request ID: 0.17319854371244103</pre
      >
      <button>refresh</button>
    </div>
  </body>
  <script src="/static/Client.js"></script>
</html>
```

Next click `refresh` button, which will execute effect again, but now on client side. After 1s refresh ID should change.
