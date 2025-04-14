import { useQuery } from "@tanstack/react-query";
import { fetchAllAdvertisement } from '../apis/fetchAllAdvertisement';
import { images } from "../images";
import { freeSlots, getSlotPrice, priceMap } from "../utils";

export const useAdvertisement = () => {
  return useQuery({
    queryKey: ['advertisement'],
    queryFn: async () => fetchAllAdvertisement(),
    select: (ads) => {
      const MAX_SLOTS = 100;
      const allSlotNumbers = Array.from({ length: MAX_SLOTS }, (_, i) => i + 1);
      const tokenIds = new Map(ads.map(ad => [ad.tokenId, ad]));
      const usedSlotIds = new Set(tokenIds.keys());
      const availableSlotIds = allSlotNumbers.filter(slotId => !usedSlotIds.has(slotId));

      const formattedList = allSlotNumbers.map((slot) => {
        const mintedNft = tokenIds.get(slot);
        const isFreeSlot = freeSlots.has(slot);
        const price = priceMap[slot];

        if (mintedNft) {
          return {
            ...mintedNft,
            image: mintedNft.metadata.image,
            minted: true,
          };
        }

        return {
          tokenId: slot,
          minted: false,
          isFreeSlot,
          price
        };
      });

      return {
        list: formattedList,
        availableSlots: availableSlotIds,
      };
    },
    onError: (error) => {
      console.error("Error loading advertisements:", error);
    },
  });
};
