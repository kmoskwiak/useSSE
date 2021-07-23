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
 * @param effect runction returning promise
 * @param dependencies  list of dependencies like in useEffect
 */
export function useSSE<T>(
  effect: () => Promise<any>,
  dependencies?: DependencyList
): T[] {
  const internalContext: IInternalContext = useContext(InternalContext);
  let callId = internalContext.current;
  internalContext.current++;
  const ctx: IDataContext = useContext(DataContext);
  const [data, setData] = useState(ctx[callId]?.data || null);
  const [error, setError] = useState(ctx[callId]?.error || null);

  if (!internalContext.resolved) {
    let cancel = Function.prototype;

    const effectPr = new Promise((resolve) => {
      cancel = () => {
        if (!ctx[callId]) {
          ctx[callId] = { error: { message: "timeout" }, id: callId };
        }
        resolve(callId);
      };
      return effect()
        .then((res) => {
          return res;
        })
        .then((res) => {
          ctx[callId] = { data: res };
          resolve(callId);
        })
        .catch((error) => {
          ctx[callId] = { error: error };
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
      effect()
        .then((res) => {
          setData(res);
        })
        .catch((error) => {
          setError(error);
        });
    }
    delete ctx[callId];
  }, dependencies);

  return [data, error];
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
      const timeOutPr = wait(timeout);

      await Promise.all(
        internalContextValue.requests.map((effect, index) => {
          return Promise.race([effect.promise, timeOutPr]).catch(() => {
            return effect.cancel();
          });
        })
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
