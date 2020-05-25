import React from "react";
export const DataContext = React.createContext({});

export const InternalContext = React.createContext({
  requests: [],
  resolved: false,
  current: 0,
});

import { useContext, useState, useEffect, DependencyList, Props } from "react";

interface IInternalContext {
  requests: {
    promise: Promise<any>;
    id: number;
    cancel: Function;
  }[];
  resolved: boolean;
  current: number;
}
interface IDataContext {
  [k: string]: any;
}

declare global {
  interface Window {
    [k: string]: any;
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
  initial: any,
  effect: () => Promise<any>,
  dependencies?: DependencyList
): T[] {
  const internalContext: IInternalContext = useContext(InternalContext);
  let callId = internalContext.current;
  internalContext.current++;
  const ctx: IDataContext = useContext(DataContext);
  const [data, setData] = useState(ctx[callId] || initial);

  if (!internalContext.resolved) {
    let cancel = Function.prototype;

    const effectPr = new Promise((resolve) => {
      cancel = () => {
        if (!ctx[callId]) {
          ctx[callId] = { isError: true, reason: "timeout", id: callId };
        }
        resolve(callId);
      };
      return effect()
        .then((res) => {
          return res;
        })
        .then((res) => {
          ctx[callId] = res;
          resolve(callId);
        })
        .catch((error) => {
          ctx[callId] = { isError: true, error };
          resolve(callId);
        });
    });

    internalContext.requests.push({
      id: callId,
      promise: effectPr,
      cancel: cancel,
    });
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

export const createBroswerContext = (
  variableName: string = "_initialDataContext"
) => {
  const initial = window && window[variableName] ? window[variableName] : {};
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

const wait = (time: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject({ error: "timeout" });
    }, time);
  });
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
  const resolveData = async (timeout?: number) => {
    const effects = internalContextValue.requests.map((item) => item.promise);

    if (timeout) {
      await Promise.race([Promise.all(effects), wait(timeout)]).catch(
        async () => {
          // timeout happend
          for (let item of internalContextValue.requests) {
            await Promise.race([item.promise, item.cancel()]);
          }
        }
      );
    } else {
      await Promise.all(effects);
    }

    internalContextValue.resolved = true;
    internalContextValue.current = 0;
    return {
      data: ctx,
      toJSON: function () {
        return this.data;
      },
      toHtml: function (variableName: string = "_initialDataContext") {
        return `<script>window.${variableName} = ${JSON.stringify(
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
