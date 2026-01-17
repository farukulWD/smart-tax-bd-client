"use client";

import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import DataProvider from "./data-provider";

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <DataProvider>{children}</DataProvider>
    </Provider>
  );
};

export default ReduxProvider;
