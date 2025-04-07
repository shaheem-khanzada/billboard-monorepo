import axios from "axios";
import { config } from '../config';

// Create Axios instance
const api = axios.create({
    baseURL: config.baseUrl, // Use environment variable for API URL
    headers: {
      "Content-Type": "application/json",
    },
  });

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