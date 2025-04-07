import { useQuery } from "@tanstack/react-query";
import { fetchAllAdvertisement } from '../apis/fetchAllAdvertisement';
import { images } from "../images";

export const useAdvertisement = () => {
  return useQuery({
    queryKey: ['advertisement'],
    queryFn: async () => fetchAllAdvertisement(),
    select: (advertisement) => {
      const totalSlots = Array.from({ length: 100 }, (_, i) => i + 1);
      const takenSlots = new Set(advertisement.map(item => item.tokenId));

      const availableSlots = totalSlots.filter(slot => !takenSlots.has(slot));

      const list = images.map((image, index) => {
        if (advertisement[index]) {
          return {
            ...advertisement[index],
            image: advertisement[index].metadata.image,
            ...image
          }
        }
        return { ...image, tokenId: image.id, image: image.src };
      })

      return {
        list: list || [],
        availableSlots: availableSlots,
      }
    },
    onError: (error) => {
      console.error("Error Advertisement:", error);
    },
  });
};