import { defineChain } from "viem";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { injected } from "wagmi/connectors";

const arbitrumStylusLocal = defineChain({
  id: 412346,
  name: "Arbitrum Stylus Local",
  nativeCurrency: {
    name: "Arbitrum Stylus Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8547"],
    },
  },
  testnet: true,
});

const arbitrumStylusTestnet = defineChain({
  id: 23011913,
  name: "Arbitrum Stylus Testnet",
  nativeCurrency: {
    name: "Arbitrum Stylus Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://stylus-testnet.arbitrum.io/rpc"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arbiscan",
      url: "https://stylus-testnet-explorer.arbitrum.io/",
      apiUrl: "https://api-sepolia.arbiscan.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 81930,
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [arbitrumStylusTestnet],
  transports: {
    [arbitrumStylusTestnet.id]: http(),
  },
  connectors: [injected()],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");
