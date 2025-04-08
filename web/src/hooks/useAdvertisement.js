import { useQuery } from "@tanstack/react-query";
import { fetchAllAdvertisement } from '../apis/fetchAllAdvertisement';
import { images } from "../images";

export const useAdvertisement = () => {
  return useQuery({
    queryKey: ['advertisement'],
    queryFn: async () => fetchAllAdvertisement(),
    select: (ads) => {
      const MAX_SLOTS = 100;
      const allSlotNumbers = Array.from({ length: MAX_SLOTS }, (_, i) => i + 1);

      // Map ads by tokenId for quick lookup
      const adByTokenId = new Map(ads.map(ad => [ad.tokenId, ad]));

      const usedSlotIds = new Set(adByTokenId.keys());
      const availableSlotIds = allSlotNumbers.filter(slotId => !usedSlotIds.has(slotId));

      // Build final list, matching ads to their corresponding images
      const formattedList = images.map((img) => {
        const matchedAd = adByTokenId.get(img.id);

        if (matchedAd) {
          return {
            ...matchedAd,
            image: matchedAd.metadata.image,
            ...img,
          };
        }

        return {
          ...img,
          tokenId: img.id,
          image: img.src,
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
