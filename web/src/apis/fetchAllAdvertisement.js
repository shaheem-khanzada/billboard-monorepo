import { api } from "./axiosInstance";

export const fetchAllAdvertisement = async () => {
  try {
    const response = await api.get('/billboard/mint-list');
    const balance = response?.data?.responseObject?.advertisement || [];
    return balance;
  } catch (error) {
    console.error(`Error while fetching advertisement`, error);
    throw error;
  }
};