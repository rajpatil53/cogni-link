"use client";
import { useComposeClient } from "@/providers/ComposeClientContextProvider";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession, getAccountIdByDID } from "did-session";
import { createContext, useContext, useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import { getAddress } from "viem";
import { useAccount } from "wagmi";
import { wagmiConfig } from "@/config/wagmiConfig";
import { watchAccount } from "@wagmi/core";

const AuthSessionContext = createContext<{
  did: string;
  address: `0x${string}` | undefined;
  isConnecting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
}>({
  did: "UNAUTHENTICATED",
  address: undefined,
  isConnecting: false,
  isConnected: false,
  isAuthenticated: false,
});

export const AuthSessionProviderProvider = ({ children }: any) => {
  const { composeClient } = useComposeClient();
  const [session, setSession] = useState<DIDSession>();
  const [did, setDid] = useState<string>("UNAUTHENTICATED");

  const { address, isConnecting, isConnected } = useAccount();

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange(currentAccount, prevAccount) {
        console.log("Account changed!", currentAccount, prevAccount);
        if (
          currentAccount.address &&
          currentAccount.address != prevAccount.address
        ) {
          authenticate(currentAccount.address);
        } else if (!currentAccount.address && prevAccount.address && session) {
          DIDSession.remove(getAccountIdByDID(session.id));
          setSession(undefined);
          setDid("UNAUTHENTICATED");
        }
      },
    });

    return () => {
      unwatch();
    };
  }, [session]);

  useEffect(() => {
    loadPreviousSession();
  }, []);

  useEffect(() => {
    if (session) {
      setSessionId(session);
      (async () => {
        await set("did-session", session.serialize());
      })();
    }
  }, [session]);

  const loadPreviousSession = async () => {
    const prevSessionStr = await get<string>("did-session");
    if (prevSessionStr) {
      const prevSession = await DIDSession.fromSession(prevSessionStr);
      if (prevSession) {
        setSession(prevSession);
        return prevSession;
      }
    }
  };

  const getSessionForAddress = async (address: string) => {
    const ethProvider = window.ethereum;

    const accountId = await getAccountId(ethProvider, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethProvider,
      accountId
    );

    const newSession = await DIDSession.authorize(authMethod, {
      resources: composeClient.resources,
    });
    setSession(newSession);
    return newSession;
  };

  const setSessionId = (currentSession: DIDSession) => {
    composeClient.setDID(currentSession.did);
    setDid(currentSession.id);
  };

  const authenticate = async (address: string) => {
    if (!window.ethereum) {
      alert("Please download MetaMask.");
      return;
    }
    let currentSession = session || (await loadPreviousSession());
    if (
      !currentSession ||
      (currentSession.hasSession && currentSession.isExpired)
    ) {
      currentSession = await getSessionForAddress(address);
    }

    if (currentSession) {
      const sessionAccountId = getAccountIdByDID(currentSession.id);
      if (getAddress(sessionAccountId.address) != address) {
        currentSession = await getSessionForAddress(address);
      }

      setSessionId(currentSession);
    }
  };

  return (
    <AuthSessionContext.Provider
      value={{
        did,
        address,
        isConnecting,
        isConnected,
        isAuthenticated: did == "UNAUTHENTICATED",
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
};

export const useAuthSessionContext = () => useContext(AuthSessionContext);
