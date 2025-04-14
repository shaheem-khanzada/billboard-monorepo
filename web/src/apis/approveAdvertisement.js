import { api } from "./axiosInstance";

export const approveAdvertisement = async (body) => {
  try {
    const response = await api.post('/billboard/approve-advertisement', body);
    return response?.data?.responseObject?.advertisement || {};
  } catch (error) {
    console.error(`Error while fetching advertisement`, error);
    throw error;
  }
};