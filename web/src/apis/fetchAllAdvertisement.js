import { api } from "./axiosInstance";

export const fetchAllAdvertisement = async () => {
  try {
    const response = await api.get('/billboard/advertisements');
    return response?.data?.responseObject;
  } catch (error) {
    console.error(`Error while fetching advertisement`, error);
    throw error;
  }
};