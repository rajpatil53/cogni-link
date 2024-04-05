import { Abi } from "viem";

export const abi = [
  {
    inputs: [{ internalType: "string", name: "did", type: "string" }],
    name: "addDid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "project_id", type: "string" },
      { internalType: "string", name: "doc_cid", type: "string" },
    ],
    name: "addDocCid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "project_id", type: "string" },
      { internalType: "string", name: "editor_did", type: "string" },
    ],
    name: "addEditor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "project_id", type: "string" }],
    name: "canEdit",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "project_id", type: "string" }],
    name: "createProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "project_id", type: "string" }],
    name: "getAuthors",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "project_id", type: "string" }],
    name: "getDocCid",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];
