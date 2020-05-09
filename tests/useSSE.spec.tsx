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
});
