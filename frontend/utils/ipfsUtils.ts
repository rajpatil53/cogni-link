export const fetchMarkdownFromIpfs = async (
  cid: string
): Promise<string | undefined> => {
  try {
    const resp = await fetch(`https://${cid}.ipfs.w3s.link`);
    const text = await resp.text();
    console.log(text);
    return text;
  } catch (e) {
    console.error("Error getting markdown from IPFS", cid, "Error: ", e);
  }
};
