import { create } from "kubo-rpc-client";

const projectId = "ab0761a1593a42f4a43864939d2f94b4";
const projectSecret = "pY0wjALHi2GepoSE2ZQVGFx2lhuqw/tm/lzyW2nYvB8EbPbmSFx6pg";
const auth =
  "Basic " + Buffer.from(`${projectId}:${projectSecret}`).toString("base64");

// Connect to Infura’s IPFS node
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export default ipfs;
