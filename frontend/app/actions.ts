"use server";
import * as Client from "@web3-storage/w3up-client";
import { StoreMemory } from "@web3-storage/access/stores/store-memory";
import { importDAG } from "@ucanto/core/delegation";
import { CarReader } from "@ipld/car";
import * as Signer from "@ucanto/principal/ed25519";
import { Block } from "@web3-storage/w3up-client/dist/src/types";

export async function uploadFile(formData: FormData) {
  "use server";
  console.log(formData);
  const file = formData.get("file") as File;
  console.log("Uploading file", file);
  try {
    const principal = Signer.parse(process.env.WEB3_STORAGE_KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });
    const proof = await parseProof(process.env.WEB3_STORAGE_PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());
    const cid = await client.uploadFile(file);
    return cid.toString();
  } catch (error) {
    console.log(error);
  }
}

async function parseProof(data: string) {
  const blocks = [];
  const reader = await CarReader.fromBytes(Buffer.from(data, "base64"));
  for await (const block of reader.blocks()) {
    blocks.push(block);
  }
  return importDAG(blocks as Iterable<Block>);
}
