"use client";

import { wagmiConfig, projectId } from "@/config/wagmiConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import React, { type ReactNode } from "react";
import { type State, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

createWeb3Modal({
  wagmiConfig,
  projectId: projectId!,
});

function WalletConnectProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: State | undefined;
}) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default WalletConnectProvider;
