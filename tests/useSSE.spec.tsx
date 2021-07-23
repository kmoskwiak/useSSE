import * as React from "react";
import { useContext, FunctionComponent } from "react";
import { render } from "@testing-library/react";
import { useSSE, createServerContext } from "../src/useSSE";

declare global {
  namespace NodeJS {
    interface Global {
      window: any;
    }
  }
}

describe("useSSE", () => {
  const createCustomElement = (
    check: Function = Function.prototype,
    shouldReject: boolean = false,
    shouldResolveAfter: number = 0
  ) => {
    const CustomElement: FunctionComponent = () => {
      const [data, error] = useSSE(() => {
        return new Promise((resolve, reject) => {
          if (shouldReject) {
            return reject({
              code: 401,
              message: "Not authorized",
            });
          }
          if (shouldResolveAfter) {
            setTimeout(() => {
              resolve({ data: "my custom data" });
            }, shouldResolveAfter);
          } else {
            resolve({ data: "my custom data" });
          }
        });
      }, []);
      check(data, error);
      return <div></div>;
    };
    return CustomElement;
  };

  test("element should be able to add server side effect", async (done) => {
    const CustomElement = createCustomElement();
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    let reply = await resolveData();
    expect(reply.data).toEqual({ "0": { data: { data: "my custom data" } } });
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

  test("should handle effect rejection", async (done) => {
    const CustomElement = createCustomElement(() => {}, true);
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    await resolveData();
    const CustomElementTwo = createCustomElement((data: any, error: any) => {
      expect(error).toEqual({
        code: 401,
        message: "Not authorized",
      });
      done();
    });
    render(
      <ServerDataContext>
        <CustomElementTwo />
      </ServerDataContext>
    );
  });

  test("should handle timeout", async (done) => {
    const CustomElement = createCustomElement(() => {}, false, 1000);
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElement />
      </ServerDataContext>
    );
    await resolveData(500);
    const CustomElementTwo = createCustomElement((data: any, error: any) => {
      expect(error).not.toBeNull();
      done();
    });
    render(
      <ServerDataContext>
        <CustomElementTwo />
      </ServerDataContext>
    );
  });

  test("should timeout only specific effects ", async (done) => {
    const CustomElementWithTimeOut = createCustomElement(() => {}, false, 1000);
    const CustomElementNoTimeout = createCustomElement(() => {}, false);
    const CustomElementNoTimeoutError = createCustomElement(() => {}, true);
    const CustomElementNoTimeoutLong = createCustomElement(
      () => {},
      false,
      200
    );
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElementWithTimeOut />
        <CustomElementNoTimeout />
        <CustomElementNoTimeoutError />
        <CustomElementNoTimeoutLong />
      </ServerDataContext>
    );
    await resolveData(500);
    const CustomElement_1 = createCustomElement((data: any, error: any) => {
      expect(error).not.toBeNull();
    });
    const CustomElement_2 = createCustomElement((data: any, error: any) => {
      expect(error).toBeNull();
    });
    const CustomElement_3 = createCustomElement((data: any, error: any) => {
      expect(error).not.toBeNull();
    });
    const CustomElement_4 = createCustomElement((data: any, error: any) => {
      expect(error).toBeNull();
      done();
    });
    render(
      <ServerDataContext>
        <CustomElement_1 />
        <CustomElement_2 />
        <CustomElement_3 />
        <CustomElement_4 />
      </ServerDataContext>
    );
  });

  test("should handle error of only specific effects ", async (done) => {
    const CustomElementWithTimeOut = createCustomElement(() => {}, true);
    const CustomElementNoTimeout = createCustomElement(() => {}, false);
    const CustomElementNoTimeoutError = createCustomElement(() => {}, true);
    const CustomElementNoTimeoutLong = createCustomElement(
      () => {},
      false,
      200
    );
    const { resolveData, ServerDataContext } = createServerContext();
    render(
      <ServerDataContext>
        <CustomElementWithTimeOut />
        <CustomElementNoTimeout />
        <CustomElementNoTimeoutError />
        <CustomElementNoTimeoutLong />
      </ServerDataContext>
    );
    await resolveData();
    const CustomElement_1 = createCustomElement((data: any, error: any) => {
      expect(error).toBeDefined();
    });
    const CustomElement_2 = createCustomElement((data: any, error: any) => {
      expect(error).toBeNull();
    });
    const CustomElement_3 = createCustomElement((data: any, error: any) => {
      expect(error).toBeDefined();
    });
    const CustomElement_4 = createCustomElement((data: any, error: any) => {
      expect(error).toBeNull();
      done();
    });
    render(
      <ServerDataContext>
        <CustomElement_1 />
        <CustomElement_2 />
        <CustomElement_3 />
        <CustomElement_4 />
      </ServerDataContext>
    );
  });
});
