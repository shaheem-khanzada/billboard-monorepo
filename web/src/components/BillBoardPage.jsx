import React, { useState } from 'react';
import { images } from "../images";
import { Link } from 'react-router'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import { useAdvertisement } from '../hooks/useAdvertisement';
import PhotoGallery from './PhotoGallary';

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

const BillBoardPage = ({ authorized }) => {
  const { data } = useAdvertisement();
  const [showBanner, setShowBanner] = useState(true);

  console.log("data", data);

  return (
    <div style={{ background: 'white' }}>
      <div>
        <Alert show={showBanner} dismissible variant="primary" onClose={() => setShowBanner(false)}>
          Deployed on the <b>Rinkeby Test Network</b> - The world's first NFT-backed digital billboard. Limited advertising space available. Be a part of blockchain internet history! &nbsp;&nbsp;  <i>#TokenizeYourAdvertisement</i> 🖼️
        </Alert>
      </div>
      <div className="jumbotron text-center">
        <h1 className="font-weight-normal">Welcome to the <b>BlockchainBillboard</b> 🐎</h1>
        <h6 className="font-weight-normal">Tokenized advertisements stored on the Ethereum blockchain. 100 advertisements for 100 NFTs. <b> Be a part of blockchain internet history!</b> &nbsp;&nbsp;  <i>#TokenizeYourAdvertisement</i> 🖼️</h6>
        <br />
        {authorized
          ? <div>
            <Link to={'/issue-advertisement'}>
              <button className="btn btn-outline-dark">Issue NFT Advertisement</button>
            </Link>
            <span>
              &nbsp;&nbsp;
              <button className="btn btn-outline-dark" onClick={() => window.open('https://testnets.opensea.io/collection/blockchainbillboard-nfts')}>NFT Store @ OpenSea</button>
            </span>
          </div>
          : <Link to={'/getting-started'}>
            <button className="btn btn-outline-dark mb-4">Start Here</button>
          </Link>
        }
      </div>

      <div style={{ lineHeight: '16px' }}>
        <Container style={{ border: '2px dashed #212529' }}>
          <PhotoGallery data={data?.list} />
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
