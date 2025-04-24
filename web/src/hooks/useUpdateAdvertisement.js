import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateAdvertisement } from "../apis/updateAdvertisement";
import { useAccount } from "wagmi";

export const useUpdateAdvertisement = () => {
  const { address: walletAddress } = useAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tokenId, payload }) => {
      if (!walletAddress) {
        throw new Error("Wallet address not found");
      }

      const response = await updateAdvertisement(tokenId, payload);
      return response;
    },

    onMutate: async () => {
      const toastId = toast.loading("Updating advertisement...");
      return { toastId };
    },

    onSuccess: (_data, _variables, context) => {
      const { toastId } = context || {};
      toast.success("Advertisement updated successfully!", { id: toastId, duration: 500 });
      queryClient.invalidateQueries({ queryKey: ["advertisement"] });
    },

    onError: (_error, _variables, context) => {
      console.error("Update Error:", _error);
      const { toastId } = context || {};
      toast.error("Failed to update advertisement", { id: toastId, duration: 500 });
    },
  });
};
