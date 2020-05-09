import * as React from "react";
import { useContext, FunctionComponent } from "react";
import { render } from "@testing-library/react";
import { useSSE, createServerContext, DataContext } from "../src/useSSE";

describe("createServerContext", () => {
  const createCustomElement = (check: Function) => {
    const CustomElement: FunctionComponent = () => {
      const data = useContext(DataContext);
      check(data);
      return <div></div>;
    };
    return CustomElement;
  };

  test("should create ServerDataContext with initial data", (done) => {
    const check = (data: any) => {
      expect(data).toEqual({ requests: [] });
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
    const check = (data: any) => {
      expect(data).toEqual({ requests: [] });

      data.requests.push(
        () =>
          new Promise((resolve) => {
            resolve();
          })
      );

      expect(data.requests.length).toBe(1);
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
    const check = (data: any) => {
      data.requests.push(
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
  const createCustomElement = () => {
    const CustomElement: FunctionComponent = () => {
      const data = useContext(DataContext);

      useSSE(
        {},
        "my_custom_key",
        () => {
          return new Promise((resolve) => {
            resolve({ data: 123 });
          });
        },
        []
      );

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

    expect(reply.data).toEqual({ my_custom_key: { data: 123 } });
    done();
  });
});
