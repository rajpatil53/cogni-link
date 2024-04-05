"use client";
import { createContext, useContext } from "react";
import { ComposeClient } from "@composedb/client";

import { definition } from "../__generated__/definition.js";
import { RuntimeCompositeDefinition } from "@composedb/types";
import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { RelayEnvironmentProvider } from "react-relay";

const composeClient = new ComposeClient({
  ceramic: "http://localhost:7007",
  serverURL: "http://localhost:5001/graphql",
  definition: definition as RuntimeCompositeDefinition,
});

const ComposeClientContext = createContext({
  composeClient: composeClient,
});

const network = Network.create(((request, variables) => {
  return composeClient.executeQuery(request.text!, variables);
}) as FetchFunction);

export const environment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export const ComposeClientContextProvider = ({ children }: any) => {
  return (
    <ComposeClientContext.Provider value={{ composeClient }}>
      <RelayEnvironmentProvider environment={environment}>
        {children}
      </RelayEnvironmentProvider>
    </ComposeClientContext.Provider>
  );
};

export const useComposeClient = () => useContext(ComposeClientContext);
