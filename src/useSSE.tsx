import * as React from "react";
export const DataContext = React.createContext({});

import { useContext, useState, useEffect, DependencyList, Props } from "react";

interface IDataContext {
  requests?: undefined | Promise<any>[];
  [k: string]: any;
}

declare global {
  interface Window {
    _initialDataContext: object;
  }
}

export function useSSE<T>(
  initial: T,
  key: string,
  effect: () => Promise<T>,
  dependencies?: DependencyList
): T[] {
  const ctx: IDataContext = useContext(DataContext);
  const [data, setData] = useState(ctx[key] || initial);

  if (ctx.requests) {
    ctx.requests.push(
      new Promise((resolve) => {
        return effect()
          .then((res) => {
            return res;
          })
          .then((res) => {
            ctx[key] = res;
            resolve();
          })
          .catch((error) => {
            ctx[key] = { isError: true, error };
            resolve();
          });
      })
    );
  }

  useEffect(() => {
    if (!ctx.requests && !ctx[key]) {
      effect().then((res) => {
        setData(res);
      });
    }
  }, dependencies);

  return [data];
}

export const createBroswerContext = () => {
  const initial =
    window && window._initialDataContext ? window._initialDataContext : {};

  function BroswerDataContext<T>(props: Props<T>) {
    return (
      <DataContext.Provider value={initial}>
        {props.children}
      </DataContext.Provider>
    );
  }

  return BroswerDataContext;
};

export const createServerContext = () => {
  let ctx: IDataContext = {
    requests: [],
  };
  function ServerDataContext<T>(props: Props<T>) {
    return (
      <DataContext.Provider value={ctx}>{props.children}</DataContext.Provider>
    );
  }
  const resolveData = async () => {
    await Promise.all(ctx.requests);
    delete ctx.requests;
    return {
      data: ctx,
      toJSON: function () {
        return this.data;
      },
      toHtml: function () {
        return `<script>window._initialDataContext = ${JSON.stringify(
          this
        )};</script>`;
      },
    };
  };
  return {
    ServerDataContext,
    resolveData,
  };
};
