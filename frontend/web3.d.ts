import type { Web3BaseProvider } from "web3";

declare global {
  interface Window {
    ethereum: Web3BaseProvider;
  }
}
