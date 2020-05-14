import React from "react";
export const DataContext = React.createContext({});

export const InternalContext = React.createContext({
  requests: [],
  resolved: false,
  current: 0,
});

import { useContext, useState, useEffect, DependencyList, Props } from "react";

interface IInternalContext {
  requests: Promise<any>[];
  resolved: boolean;
  current: number;
}
interface IDataContext {
  [k: string]: any;
}

declare global {
  interface Window {
    _initialDataContext: object;
  }
}

/**
 *
 * @param initial initial value of state
 * @param effect runction returning promise
 * @param dependencies  list of dependencies like in useEffect
 */
export function useSSE<T>(
  initial: T,
  effect: () => Promise<T>,
  dependencies?: DependencyList
): T[] {
  const internalContext: IInternalContext = useContext(InternalContext);
  let callId = internalContext.current;
  internalContext.current++;

  const ctx: IDataContext = useContext(DataContext);
  const [data, setData] = useState(ctx[callId] || initial);

  if (!internalContext.resolved) {
    internalContext.requests.push(
      new Promise((resolve) => {
        return effect()
          .then((res) => {
            return res;
          })
          .then((res) => {
            ctx[callId] = res;
            resolve();
          })
          .catch((error) => {
            ctx[callId] = { isError: true, error };
            resolve();
          });
      })
    );
  }

  useEffect(() => {
    if (internalContext.resolved && !ctx[callId]) {
      effect().then((res) => {
        setData(res);
      });
    }
    delete ctx[callId];
  }, dependencies);

  return [data];
}

export const createBroswerContext = () => {
  const initial =
    window && window._initialDataContext ? window._initialDataContext : {};
  let internalContextValue: IInternalContext = {
    current: 0,
    resolved: true,
    requests: [],
  };
  function BroswerDataContext<T>(props: Props<T>) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        <DataContext.Provider value={initial}>
          {props.children}
        </DataContext.Provider>
      </InternalContext.Provider>
    );
  }

  return BroswerDataContext;
};

export const createServerContext = () => {
  let ctx: IDataContext = {};
  let internalContextValue: IInternalContext = {
    current: 0,
    resolved: false,
    requests: [],
  };
  function ServerDataContext<T>(props: Props<T>) {
    return (
      <InternalContext.Provider value={internalContextValue}>
        <DataContext.Provider value={ctx}>
          {props.children}
        </DataContext.Provider>
      </InternalContext.Provider>
    );
  }
  const resolveData = async () => {
    await Promise.all(internalContextValue.requests);
    internalContextValue.resolved = true;
    internalContextValue.current = 0;
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
