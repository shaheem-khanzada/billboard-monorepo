import { api } from "./axiosInstance";

export const updateTotalSupply = async (payload) => {
  try {
    const response = await api.put(`/billboard/update-supply`, payload);
    return response?.data?.responseObject;
  } catch (error) {
    console.error(`Error while updating totalSupply`, error);
    throw error;
  }
};
