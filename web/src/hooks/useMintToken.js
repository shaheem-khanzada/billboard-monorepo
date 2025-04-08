import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { abi, address } from "../contracts/abi.json";
import { writeContract } from "wagmi/actions";
import { walletConfig } from "../config";
import { parseEther } from "viem";

export const useMintToken = () => {
  return useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Minting parameters:", params);
        const result = await writeContract(walletConfig, {
          address,
          abi,
          functionName: "mintAdvertisement",
          args: params,
          value: parseEther('0.001'), 
        });

        console.log("Transaction result:", result);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onMutate: async () => {
      const toastId = toast.loading(`Processing: Mint Advertisement...`);
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      const { toastId } = context || {};
      toast.success("Mint Advertisement Transaction Successfull", { id: toastId, duration: 7000 });
    },
    onError: (_error, _variables, context) => {
      const { toastId } = context || {};
      const defaultMessage = 'Mint Advertisement Transaction Failed';
      toast.error(defaultMessage, { id: toastId, duration: 7000 });
    },
  });
};
