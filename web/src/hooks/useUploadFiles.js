import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import { uploadFiles } from "../apis/uploadFiles";

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: async ({ image, metadata }) => {
      try {
        const upload = await uploadFiles(image, metadata);
        return upload;
      } catch (error) {
        console.error("Error in minting process:", error);
        throw error; // Ensures error is caught by `onError`
      }
    },
    onMutate: async () => {
      const toastId = toast.loading(`Uploading: Mint Advertisement...`);
      return { toastId };
    },
    onSuccess: (_data, _variables, context) => {
      const { toastId } = context || {};
      toast.success("Mint Advertisement Uploaded", { id: toastId });
    },
    onError: (_error, _variables, context) => {
      const { toastId } = context || {};
      const defaultMessage = 'Mint Advertisement Upload Failed';
      toast.error(defaultMessage, { id: toastId });
    },
  });
};
