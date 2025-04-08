import axios from "axios";
import { config } from '../config';

// Create Axios instance
export const api = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
