import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNTNjNmEwMi0wMTBhLTQ3OTgtOWUzOS00MTNiZDNkNWFkOWQiLCJlbWFpbCI6Im1zaGFoZWVta3pAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImU3NTNkODExN2EyZDg4ZmJmNmQ1Iiwic2NvcGVkS2V5U2VjcmV0IjoiYTBhN2U2M2IyNjJmYzI4YTRhMjhmNjNlYWRmYjk1YzMyZGVmMTYxMTU3Mzk3OTRkYzk3MmUwZGJhMTYxN2QwOSIsImV4cCI6MTc3NTEzMzg1NH0.iM1hfns8QYCWTVhSHmAuD7Z11zItKPkNpVoRM7EwpD4",
  pinataGateway: "sapphire-fellow-albatross-317.mypinata.cloud",
});

export function useIPFSUploader() {

  // Upload an image to IPFS
  const uploadImage = async (file) => {

    console.log("Image uploadeding:");

    try {
      const { cid } = await pinata.upload.public.file(file);
      const fileUrl = `https://sapphire-fellow-albatross-317.mypinata.cloud/ipfs/${cid.toString()}`;

      console.log("✅ Image uploaded:", fileUrl);
      return fileUrl;
    } catch (err) {
      console.error("❌ IPFS Upload Error:", err);
      throw err;
    }
  };

  // Upload JSON metadata to IPFS
  const uploadMetadata = async (metadata) => {
    try {
      const name = `metadata_${new Date().getTime()}.json`;
      const objectString = JSON.stringify(metadata);
      const blob = new Blob([objectString], { type: "application/json" });
      const file = new File([blob], name, { type: "application/json" });
      const { cid } = await pinata.upload.public.file(file);
      const metadataUrl = `https://sapphire-fellow-albatross-317.mypinata.cloud/ipfs/${cid.toString()}`;

      console.log("✅ Metadata uploaded:", metadataUrl);
      return metadataUrl;
    } catch (err) {
      console.error("❌ Metadata Upload Error:", err);
      throw err;
    }
  };

  return { uploadImage, uploadMetadata };
}
