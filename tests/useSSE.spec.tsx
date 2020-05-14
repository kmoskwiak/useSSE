import * as React from "react";
import { useContext, FunctionComponent } from "react";
import { render } from "@testing-library/react";
import {
  useSSE,
  createServerContext,
  DataContext,
  InternalContext,
} from "../src/useSSE";

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
