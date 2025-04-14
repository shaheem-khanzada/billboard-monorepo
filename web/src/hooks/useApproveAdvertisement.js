import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { approveAdvertisement } from "../apis/approveAdvertisement";
import { useAccount } from "wagmi";

export const useApproveAdvertisement = () => {
  const { address: walletAddress } = useAccount();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      try {
        if (!walletAddress) {
          throw new Error("Wallet address not found");
        }

        const receipt = await approveAdvertisement(body);
        return receipt;
      } catch (error) {
        throw error;
      }
    },
    onMutate: async () => {
      const toastId = toast.loading(`Processing: Approving advertisement...`);
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      const { toastId } = context || {};
      toast.success("Approving advertisement Successfull", { id: toastId, duration: 7000 });
      queryClient.invalidateQueries({ queryKey: ['advertisement'] });
    },
    onError: (_error, _variables, context) => {
      console.log(_error);
      const { toastId } = context || {};
      const defaultMessage = `Approving advertisement Failed`;
      toast.error(defaultMessage, { id: toastId, duration: 7000 });
    },
  });
};
