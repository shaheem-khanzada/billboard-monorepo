import React, { useState } from 'react';
import { Link } from 'react-router';
// import Media from 'react-bootstrap/Media';
import { Card, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

const AdvertisingDetailsPage = () => {
  const [showA, setShowA] = useState(false);
  const [showB, setShowB] = useState(false);

  const showModalA = () => setShowA(true);
  const hideModalA = () => setShowA(false);
  const showModalB = () => setShowB(true);
  const hideModalB = () => setShowB(false);

  return (
    <div>
      <Modal
        show={showA}
        onHide={hideModalA}
        dialogClassName="modal-90w"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>Advertising Standards on the BlockchainBillboard</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            📌 It is important that you carefully review <b>ALL</b> the following points before deciding to advertise with us:
          </p>
          <h6>What pixel-size do we recommend?</h6>
          <p>600x800 pixel-size is preferred. However, we will try our best to fit your advertisement needs.</p>
          <h6>What image-format do we recommend?</h6>
          <p>PNG/JPG/GIF image-format is preferred.</p>
          <h6>How long does it take for your advertisement to be displayed on the BlockchainBillboard?</h6>
          <p>
            Please wait about 30 minutes for our system to update the BlockchainBillboard. This can be expedited if you send us a verification email with your advertisement attached prior to issuing your NFT Advertisement.
          </p>
          <h6>How is the advertising price calculated?</h6>
          <p>
            The advertising price is a royalty-free, one-time payment based on your selected <i>Advertisement Slot Position</i>. We have decided to go with a half-ether drop in price for every second row. To stir things up, we decided to scatter 10 free advertisement spots on the BlockchainBillboard. See if you can find one! 🍀
          </p>
          <h6>What is our return policy?</h6>
          <p>No return policy. Please understand that we cannot alter transactions on the Ethereum blockchain.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModalA} variant="outline-dark">Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showB}
        onHide={hideModalB}
        dialogClassName="modal-90w"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h4>Tokenizing Standards on the BlockchainBillboard</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            📌 It is important that you carefully review <b>ALL</b> the following points before deciding to advertise with us:
          </p>
          <h6>What does an NFT Advertisement do for you?</h6>
          <p>
            Each advertisement slot position is backed by a NFT that verifies your right to your selected slot position. The total supply is capped at 100 NFT Advertisements where each token serves as proof of ownership.
          </p>
          <p>
            <b>-</b> Your selected <i style={{ color: '#CA5010' }}>Advertisement Slot Position</i> will be equivalent to your NFT Advertisement's <i style={{ color: '#CA5010' }}>TokenId</i>.
          </p>
          <h6>What does the metadata look like?</h6>
          <p>Simply, the information we request upon issuing your NFT Advertisement:</p>
          <p>
            <b>-</b> Title, Description, Company Website, Industry, Advertisement Image, and Advertisement Slot Position.
          </p>
          <h6>Will your NFT Advertisement be included in our OpenSea NFT Store?</h6>
          <p>
            Yes! Although the token is issued to your address, all issued NFTs will be visible in our NFT Store. Note that you can easily transfer or sell your NFT Advertisement on a different platform.
          </p>
          <h6>What does OpenSea have to do with NFT Advertisements?</h6>
          <p>
            Absolutely nothing! Your NFT will live on the Ethereum blockchain. OpenSea simply supports this blockchain standard. They have the infrastructure which will help you transfer or sell your NFTs. However, you do not have to adhere to selling your token on OpenSea. The token exists independent of any single platform.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hideModalB} variant="outline-dark">Close</Button>
        </Modal.Footer>
      </Modal>

      <Container style={{ maxWidth: '98%' }}>
        <br />
        <br />
        {[
          {
            img: 'https://i.imgur.com/PHnLrEN.png',
            title: 'What is the BlockchainBillboard?',
            content: 'Introducing the advertising dApp, BlockchainBillboard - a place on the internet where business owners can now verifiably issue a forever-lasting advertisement on the world\'s first NFT-backed digital billboard!'
          },
          {
            img: 'https://i.imgur.com/WeSG1Hx.png',
            title: 'What are NFT Advertisements?',
            content: <>
              A <a href="https://sepolia.etherscan.io/address/0x7299457936a2A15Ab7BE0af327E4B65D694aBd91" style={{ color: '#CA5010' }} target="_blank" rel="noreferrer">non-fungible token</a> (ERC-721) serving as proof of ownership for your digital advertisement on the BlockchainBillboard.
              Total supply is programmatically capped at 100 tokens. Each token will have a unique <i>TokenId</i> between 1 and 100.
            </>
          },
          {
            img: 'https://i.imgur.com/PpjOsCD.png',
            title: 'How does it work?',
            content: <>
              Your advertisement must be <i>high-quality</i>, <i>original</i>, and most importantly, <i>informative</i>.
              We are not willing to advertise <i>vulgar</i> or <i>disrespectful</i> advertisements. Therefore, we recommend that you first send us an email with your advertisement attached so that we can confirm its eligibility.
              We ask that you please review our <a href="#" style={{ color: '#CA5010' }} onClick={showModalA}>advertising standards</a> and <a href="#" style={{ color: '#CA5010' }} onClick={showModalB}>tokenizing standards</a>. We also require a URL to your company's website so that we can redirect traffic from the BlockchainBillboard.
            </>
          },
          {
            img: 'https://i.imgur.com/JXJc5EX.png',
            title: 'Is advertising space limited?',
            content: <>
              Yes, advertising space is limited to 100 advertisements. Our <a href="https://sepolia.etherscan.io/address/0x7299457936a2A15Ab7BE0af327E4B65D694aBd91" style={{ color: '#CA5010' }} target="_blank" rel="noreferrer">smart contract</a> will immediately halt the issuing of further NFT Advertisements once the BlockchainBillboard reaches peak capacity. Be a part of blockchain internet history! 🌎
            </>
          },
          {
            img: 'https://i.imgur.com/pWW1gc4.png',
            title: 'How much does it cost to advertise?',
            content: <>
              Like most things, it depends... the total cost to issue your NFT Advertisement depends on your selected <i>Advertisement Slot Position</i> + <i>Gas-Fees</i>.
              Since each advertisement on the BlockchainBillboard is backed by a non-fungible token, we have decided to issue tokens strictly on a <i>first-come, first-serve</i> basis. To stir things up, we decided to scatter 10 free advertisement spots on the BlockchainBillboard.
              Learn more about our pricing standards by clicking <a href="#" style={{ color: '#CA5010' }} onClick={showModalA}>here</a>.
            </>
          },
          {
            img: 'https://i.imgur.com/U26M2mi.png',
            title: 'Why do we only support MetaMask?',
            content: <>
              We are hoping to add other wallet providers soon. For now, please use <a href="https://www.google.com/chrome/" style={{ color: '#CA5010' }} target="_blank" rel="noreferrer">Google Chrome</a> w/ the <a href="https://metamask.io/" style={{ color: '#CA5010' }} target="_blank" rel="noreferrer">MetaMask</a> extension.
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button variant="outline-dark" onClick={showModalA}>Advertising Standards</Button>
                <Button variant="outline-dark" onClick={showModalB}>Tokenizing Standards</Button>
                <Link to="/issue-advertisement">
                  <Button variant="outline-success">Issue NFT Advertisement</Button>
                </Link>
              </div>
            </>
          }
        ].map((item, index) => (
          <div key={index}>
            <Card as="li" style={{ display: 'flex', flexDirection: 'row', textAlign: 'left' }}>
              <img width={110} height={110} className="mr-3" src={item.img} alt={`Bird ${index + 1}`} />
              <Card.Body>
                <h5>{item.title}</h5>
                <p>{item.content}</p>
              </Card.Body>
            </Card>
            <br />
          </div>
        ))}
      </Container>
    </div>
  );
};

export default AdvertisingDetailsPage;
