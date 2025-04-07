import { useMutation } from "@tanstack/react-query";
import { abi, address } from "../contracts/abi.json";
import { useIPFSUploader } from "./useIPFSUploader";
import { writeContract } from "wagmi/actions";
import { walletConfig } from "../config";

export const useMintToken = () => {
  const { uploadImage, uploadMetadata } = useIPFSUploader();

  return useMutation({
    mutationFn: async ({ title, websiteURL, description, slotPosition, industry, advertisement }) => {
      try {
        // Upload the image to IPFS
        const imageUrl = await uploadImage(advertisement[0]);

        // Construct the metadata
        const tokenMetadata = {
          name: title,
          description,
          image: imageUrl,
          external_link: "https://www.blockchainbillboard.io/",
          attributes: [
            { trait_type: "Industry", value: industry },
            { trait_type: "Blockchain Billboard", value: `#${slotPosition}` },
            { display_type: "number", trait_type: "Original", value: 1 },
            { trait_type: "Website", value: websiteURL },
          ],
        };

        // Upload metadata to IPFS
        const metadataUrl = await uploadMetadata(tokenMetadata);
        console.log("Metadata:", tokenMetadata);

        // Call smart contract to mint the token
        const result = await writeContract(walletConfig, {
          address,
          abi,
          functionName: "mintAdvertisement",
          args: [metadataUrl, BigInt(slotPosition)],
        });

        console.log("Transaction result:", result);
        return result;
      } catch (error) {
        console.error("Error in minting process:", error);
        throw error; // Ensures error is caught by `onError`
      }
    },
    onSuccess: (data) => {
      console.log("Item created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating item:", error);
    },
  });
};
