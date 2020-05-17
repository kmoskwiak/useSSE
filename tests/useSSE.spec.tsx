import * as React from "react";
import { useContext, FunctionComponent } from "react";
import { render } from "@testing-library/react";
import {
  useSSE,
  createServerContext,
  createBroswerContext,
  DataContext,
  InternalContext,
} from "../src/useSSE";

declare global {
  namespace NodeJS {
    interface Global {
      window: any;
    }
  }
}

describe("createServerContext", () => {
  const createCustomElement = (check: Function) => {
    const CustomElement: FunctionComponent = () => {
      const data = useContext(DataContext);
      const internal = useContext(InternalContext);
      check(data, internal);
      return <div></div>;
    };
    return CustomElement;
  };

  test("should create ServerDataContext with initial data", (done) => {
    const check = (data: any, internal: any) => {
      expect(data).toEqual({});
      expect(internal).toEqual({ requests: [], resolved: false, current: 0 });
      done();
    };

    const CustomElement = createCustomElement(check);
    const { ServerDataContext } = createServerContext();

    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
  });

  test("element should be able to add request to context", (done) => {
    const check = (data: any, internal: any) => {
      expect(data).toEqual({});

      internal.requests.push(
        () =>
          new Promise((resolve) => {
            resolve();
          })
      );

      expect(internal.requests.length).toBe(1);
      done();
    };
    const CustomElement = createCustomElement(check);
    const { ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
  });

  test("element should be able to add request to context and modify context", async (done) => {
    const check = (data: any, internal: any) => {
      internal.requests.push(
        new Promise((resolve) => {
          data["my_key"] = "123";
          resolve();
        })
      );
    };
    const CustomElement = createCustomElement(check);
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    let reply = await resolveData();
    expect(reply.data).toEqual({ my_key: "123" });
    done();
  });

  test("data.toHtml() should return html with defualt global variable name", async (done) => {
    const check = (data: any, internal: any) => {
      internal.requests.push(
        new Promise((resolve) => {
          data["my_key"] = "123";
          resolve();
        })
      );
    };
    const CustomElement = createCustomElement(check);
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    let reply = await resolveData();
    expect(reply.toHtml()).toEqual(
      `<script>window._initialDataContext = ${JSON.stringify({
        my_key: "123",
      })};</script>`
    );
    done();
  });

  test("data.toHtml() should return html with specific global variable name", async (done) => {
    const check = (data: any, internal: any) => {
      internal.requests.push(
        new Promise((resolve) => {
          data["my_key"] = "123";
          resolve();
        })
      );
    };
    const CustomElement = createCustomElement(check);
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    let reply = await resolveData();
    expect(reply.toHtml("my_global_variable")).toEqual(
      `<script>window.my_global_variable = ${JSON.stringify({
        my_key: "123",
      })};</script>`
    );
    done();
  });
});

describe("createBroswerContext", () => {
  const createCustomElement = (check: Function) => {
    const CustomElement: FunctionComponent = () => {
      const data = useContext(DataContext);
      const internal = useContext(InternalContext);
      check(data, internal);
      return <div></div>;
    };
    return CustomElement;
  };

  beforeEach(() => {
    global.window = {};
  });

  test("should create BroswerContext with data from global variable", async (done) => {
    global.window._initialDataContext = { myData: 123 };

    const BroswerContext = createBroswerContext();
    const CustomElement = createCustomElement(check);

    function check(data: any) {
      expect(data).toEqual({ myData: 123 });
      done();
    }

    render(
      <BroswerContext>
        <CustomElement />
      </BroswerContext>
    );
  });

  test("should create BroswerContext with data from custom named global variable", async (done) => {
    global.window.myCustomVar = { myData: 123 };

    const BroswerContext = createBroswerContext("myCustomVar");
    const CustomElement = createCustomElement(check);

    function check(data: any) {
      expect(data).toEqual({ myData: 123 });
      done();
    }

    render(
      <BroswerContext>
        <CustomElement />
      </BroswerContext>
    );
  });

  test("resolved value in internal context should be true", async (done) => {
    global.window.myCustomVar = { myData: 123 };

    const BroswerContext = createBroswerContext("myCustomVar");
    const CustomElement = createCustomElement(check);

    function check(data: any, internal: any) {
      expect(internal.resolved).toBe(true);
      done();
    }

    render(
      <BroswerContext>
        <CustomElement />
      </BroswerContext>
    );
  });

  test("current value in internal context should be zero", async (done) => {
    global.window.myCustomVar = { myData: 123 };

    const BroswerContext = createBroswerContext("myCustomVar");
    const CustomElement = createCustomElement(check);

    function check(data: any, internal: any) {
      expect(internal.current).toBe(0);
      done();
    }

    render(
      <BroswerContext>
        <CustomElement />
      </BroswerContext>
    );
  });
});

describe("useSSE", () => {
  const createCustomElement = (check: Function = Function.prototype) => {
    const CustomElement: FunctionComponent = () => {
      const [data] = useSSE(
        {},
        () => {
          return new Promise((resolve) => {
            resolve({ data: "my custom data" });
          });
        },
        []
      );

      check(data);

      return <div></div>;
    };
    return CustomElement;
  };

  test("element should be able to add serer side effect", async (done) => {
    const CustomElement = createCustomElement();

    const { resolveData, ServerDataContext } = createServerContext();

    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );

    let reply = await resolveData();

    expect(reply.data).toEqual({ "0": { data: "my custom data" } });
    done();
  });

  test("state should be updated by server side effect", async (done) => {
    const CustomElement = createCustomElement();
    const { resolveData, ServerDataContext } = createServerContext();

    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );

    await resolveData();

    const CustomElementTwo = createCustomElement((data: any) => {
      expect(data).toEqual({ data: "my custom data" });
      done();
    });

    render(
      <ServerDataContext>
        <CustomElementTwo />
      </ServerDataContext>
    );
  });
});
