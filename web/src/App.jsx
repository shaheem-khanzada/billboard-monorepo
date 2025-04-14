import React from 'react';
import { Toaster } from 'react-hot-toast';
import './App.css';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { walletConfig } from './config';
import Header from './components/Header';
import Navigation from './routes';

const App = () => {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className='App'>
            <Header />
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ style: { background: '#383838', color: 'white', maxWidth: '100%' } }}
            />
            <Navigation />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
