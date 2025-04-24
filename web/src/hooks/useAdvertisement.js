import { useQuery } from "@tanstack/react-query";
import { fetchAllAdvertisement } from '../apis/fetchAllAdvertisement';

export const useAdvertisement = () => {
  return useQuery({
    queryKey: ['advertisement'],
    queryFn: async () => fetchAllAdvertisement(),
    select: ({ advertisements, totalSupply }) => {
      const availableSlotIds = advertisements.filter(ad => ad.isMinted === false).map(ad => ad.tokenId);
      return {
        advertisements: advertisements,
        availableSlots: availableSlotIds,
        totalSupply
      };
    },
    onError: (error) => {
      console.error("Error loading advertisements:", error);
    },
  });
};
