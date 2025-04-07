import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { localhost, mainnet, sepolia } from "viem/chains";

export const config = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://billboard-backend.furqan.codes'
}

export const walletConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia, localhost],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
