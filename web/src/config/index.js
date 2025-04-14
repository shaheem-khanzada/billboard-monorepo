import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from 'wagmi';
import { localhost, mainnet, sepolia } from "viem/chains";

export const config = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://billboard-backend.furqan.codes'
}

export const walletConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'f5c370fd3a6a98eb32086e81f44f223d',
  chains: [mainnet, sepolia, localhost],
  ssr: false,
  transports: {
    [sepolia.id]: http('https://sepolia.infura.io/v3/ab0761a1593a42f4a43864939d2f94b4'),
    [mainnet.id]: http('https://mainnet.infura.io/v3/ab0761a1593a42f4a43864939d2f94b4'),
  },
});
