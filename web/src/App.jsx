import React from 'react';
import { Routes, Route, Link, Outlet } from "react-router";
import { Toaster } from 'react-hot-toast';
import './App.css';

import BillBoardPage from './components/BillBoardPage';
import AdvertisingDetailsPage from './components/AdvertisingDetailsPage';
import IssueAdvertisementPage from './components/IssueAdvertisementPage';
import DoesNotExistPage from './components/DoesNotExistPage';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { walletConfig } from './config';
import AdminPage from './components/AdminPage';
import Header from './components/Header';

const App = () => {
  const queryClient = new QueryClient();

  const loggedIn = false;
  const metaMaskNotInstalled = true;
  const account = {};
  const contract = {};
  const networkId = 4; // Rinkeby
  const eth_instance = {};

  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className='App'>
            <Header/>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ style: { background: '#383838', color: 'white', maxWidth: '100%' } }}
            />
            <Routes>
              <Route exact path='/' element={<BillBoardPage authorized={loggedIn} account={account} />} />
              <Route path='/getting-started' element={<AdvertisingDetailsPage authorized={loggedIn} />} />
              <Route path='/admin' element={<AdminPage />} />
              <Route path='/issue-advertisement' element={<IssueAdvertisementPage  />} />
              <Route path='/*' element={<DoesNotExistPage />} />
            </Routes>
            <Outlet />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
