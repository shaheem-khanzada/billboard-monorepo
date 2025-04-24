import React, { useState } from 'react';
import { Link } from 'react-router'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import { useAdvertisement } from '../hooks/useAdvertisement';
import PhotoGallery from '../components/PhotoGallary';
import { useAccount, useChainId } from 'wagmi';

const BillBoardPage = () => {
  const { isConnected } = useAccount();
  const { data } = useAdvertisement();
  const [showBanner, setShowBanner] = useState(true);
  const chainId = useChainId();
  console.log('chainId', chainId);
  console.log('data useAdvertisement', data);

  return (
    <div style={{ background: 'white' }}>
      <div>
        <Alert show={showBanner} dismissible variant="primary" onClose={() => setShowBanner(false)}>
          Deployed on the <b>Sepolia Test Network</b> - The world's first NFT-backed digital billboard. Limited advertising space available. Be a part of blockchain internet history!  <i>#TokenizeYourAdvertisement</i> 🖼️
        </Alert>
      </div>
      <div className="jumbotron text-center">
        <h1 className="font-weight-normal">Welcome to the <b>BlockchainBillboard</b> 🐎</h1>
        <h6 className="font-weight-normal">Tokenized advertisements stored on the Ethereum blockchain. 100 advertisements for 100 NFTs. <b> Be a part of blockchain internet history!</b>  <i>#TokenizeYourAdvertisement</i> 🖼️</h6>
        {isConnected
          ? <div className='m-4 d-flex justify-content-center gap-2'>
            <Link to={'/issue-advertisement'}>
              <button className="btn btn-outline-dark">Issue NFT Advertisement</button>
            </Link>
             <span>
              <button className="btn btn-outline-dark" onClick={() => window.open('https://testnets.opensea.io/collection/blockchain-billboard-nfts')}>NFT Store @ OpenSea</button>
            </span>
          </div>
          : <Link to={'/getting-started'}>
            <button className="btn btn-outline-dark">Start Here</button>
          </Link>
        }
      </div>

      <div style={{ lineHeight: '16px' }}>
        <Container style={{ border: '2px dashed #212529' }}>
          <PhotoGallery data={data?.advertisements} />
        </Container>
        <br />
      </div>

      <div style={{ textAlign: 'center', background: 'transparent' }}>
        <br />
        <h5>#TokenizeYourAdvertisement 🖼️</h5>
        <br />
        <h2 className="font-weight-normal">Developed with ❤️ for the 🌎</h2>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default BillBoardPage;
