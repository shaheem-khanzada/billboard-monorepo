import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { abi, address } from "../contracts/abi.json";
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'

import { walletConfig } from "../config";
import { formatEther, parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";

export const useMintToken = () => {
  const { address: walletAddress } = useAccount();
  const { data } = useBalance({ address: walletAddress, config: walletConfig });

  return useMutation({
    mutationFn: async (params) => {
      try {
        const value = params.pop();
        const balance = data?.value ? parseFloat(formatEther(data.value)) : 0;
    
        if (!balance || balance < parseFloat(value)) {
          throw new Error("Insufficient balance");
        }
        
        if (!walletAddress) {
          throw new Error("Wallet address not found");
        }
        
        const result = await writeContract(walletConfig, {
          address,
          abi,
          functionName: "mintAdvertisement",
          args: params,
          value: parseEther('0'),
        });

        const receipt = await waitForTransactionReceipt(walletConfig, { hash: result });

        if (receipt.status !== 'success') {
          throw new Error("Mint Advertisement Transaction Failed");
        }

        return receipt;
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
    onError: (error, _variables, context) => {
      const { toastId } = context || {};
      const cause = error?.shortMessage?.split?.(":")?.pop?.()?.trim?.() || 'Unknown Error';
      const defaultMessage = `Mint Advertisement Transaction Failed: ${cause}`;
      toast.error(error.message || defaultMessage, { id: toastId, duration: 7000 });
    },
  });
};
