import React from 'react';
import {  Routes, Route, Link, Outlet } from "react-router";
import { ToastContainer } from 'react-toastify';
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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link to="/" className="navbar-brand"><b>BlockchainBillboard</b> 🐎</Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link to="/getting-started" className="nav-link active">Getting Started</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/issue-advertisement" className="nav-link active">Issue Advertisement</Link>
                  </li>
                  <li className="nav-item">
                    <a target="_blank" rel="noreferrer" className="nav-link active" href="https://testnets.opensea.io/collection/blockchainbillboard-nfts">NFT Store</a>
                  </li>
                  <li className="nav-item">
                    <a target="_blank" rel="noreferrer" className="nav-link active" href="mailto:contact@blockchainbillboard.io?&subject=The%20subject%20of%20the%20email&body=The%20body%20of%20the%20email">Contact Us</a>
                  </li>
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link active">Admin</Link>
                  </li>
                </ul>
                <ConnectButton />
              </div>
            </nav>
            <ToastContainer />
            <Routes>
              <Route exact path='/' element={<BillBoardPage authorized={loggedIn} account={account} />} />
              <Route path='/getting-started' element={<AdvertisingDetailsPage authorized={loggedIn} />} />
              <Route path='/admin' element={<AdminPage />} />
              <Route path='/issue-advertisement' element={<IssueAdvertisementPage authorized={loggedIn} metaMaskNotInstalled={metaMaskNotInstalled} account={account} contract={contract} networkId={networkId} eth_instance={eth_instance} />} />
              <Route path='/*' element={<DoesNotExistPage />} />
            </Routes>
            <Outlet/>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
