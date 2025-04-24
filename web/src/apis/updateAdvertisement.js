import { api } from "./axiosInstance";

export const updateAdvertisement = async (tokenId, payload) => {
  try {
    const response = await api.put(`/billboard/update-advertisement/${tokenId}`, payload);
    return response?.data?.responseObject;
  } catch (error) {
    console.error(`Error while updating advertisement with tokenId ${tokenId}`, error);
    throw error;
  }
};
