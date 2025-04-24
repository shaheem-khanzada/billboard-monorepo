import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateTotalSupply } from "../apis/updateTotalSupply";
import { useAccount } from "wagmi";

export const useUpdateTotalSupply = () => {
  const { address: walletAddress } = useAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (totalSupply) => {
      if (!walletAddress) {
        throw new Error("Wallet address not found");
      }

      const response = await updateTotalSupply({ totalSupply });
      return response;
    },

    onMutate: async () => {
      const toastId = toast.loading("Updating totalSupply...");
      return { toastId };
    },

    onSuccess: (_data, _variables, context) => {
      const { toastId } = context || {};
      toast.success("TotalSupply updated successfully!", { id: toastId, duration: 500 });
      queryClient.invalidateQueries({ queryKey: ["advertisement"] });
    },

    onError: (error, _variables, context) => {
      const errorMessage = error?.response?.data?.message || "Failed to update totalSupply";
      console.error("Update Error:", error);
      const { toastId } = context || {};
      toast.error(errorMessage, { id: toastId, duration: 1000 });
    },
  });
};
