import React, { useState } from 'react';
import { Link } from 'react-router'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';

import { useMintToken } from '../hooks/useMintToken';
import { useAdvertisement } from '../hooks/useAdvertisement';
import { getSlotPrice } from '../utils';


const FormExample = ({ account }) => {
  const { data: advertisement } = useAdvertisement();
  const { mutate: mintToken, isPending } = useMintToken();
  const [currentPrice, setCurrentPrice] = useState('');
  const [currentSlot, setCurrentSlot] = useState('');
  // const { data } = useReadContract({
  //   abi,
  //   address: address,
  //   functionName: 'tokenURI',
  //   args: [BigInt(currentSlot)],
  // });

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleSlotChange = (event) => {
    const currentSlot = parseInt(event.target.value);
    setCurrentPrice(getSlotPrice(currentSlot));
    setCurrentSlot(currentSlot);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(mintToken)}>
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="walletAddress">
            <Form.Label>Wallet Address</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              defaultValue={account}
              disabled
            />
            <Form.Text className="text-muted">
              Thank you for connecting your wallet
            </Form.Text>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="title">
            <Form.Label>* Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a title for your NFT Advertisement"
              {...register("title", { required: "Title is required" })}
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              What is a great title for your advertisement?
            </Form.Text>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md="6" controlId="websiteURL">
            <Form.Label>* Company Website URL </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your company's website here"
              {...register("websiteURL", {
                required: "Website URL is required",
              })}
              isInvalid={!!errors.websiteURL}
            />
            <Form.Control.Feedback type="invalid">
              {errors.websiteURL?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Which website would you like to advertise?
            </Form.Text>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="description">
            <Form.Label>* Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a description for you NFT Advertisement"
              {...register("description", { required: "Description is required" })}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              How would you describe your advertisement?
            </Form.Text>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md="6" controlId="slotPosition">
            <Form.Label>* Advertisement Slot Position </Form.Label>
            <Form.Control
              as="select"
              {...register("slotPosition", { required: "Slot position is required" })}
              onChange={handleSlotChange}
              isInvalid={!!errors.slotPosition}
            >
              <option value="">Select a slot</option>
              {(advertisement?.availableSlots || []).map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.slotPosition?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Which slot position would you prefer on the Blockchain Billboard?
            </Form.Text>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="industry">
            <Form.Label>* Industry</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your company's industry here"
              {...register("industry", { required: "Industry is required" })}
              isInvalid={!!errors.industry}
            />
            <Form.Control.Feedback type="invalid">
              {errors.industry?.message}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Which industry are you working in?
            </Form.Text>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} md="6" controlId="advertisement">
            <Form.Label>* Advertisement Image</Form.Label>
            <Form.Control required type="file" accept='image/*'  {...register("advertisement", { required: "Image is required" })} placeholder="Upload your advertisement" />
            <Form.Text className="text-muted">
              We only support PNG/JPG/GIF image format
            </Form.Text>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="cost">
            <Form.Label>Final Price</Form.Label>
            <Form.Control
              type="text"
              value={currentPrice + " ETH"}
              disabled
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Row>
            <Form.Label className="text-muted">Issue your NFT Advertisement and gain verifiable rights to slot position (#{currentSlot}) on the <Link to="/" style={{ color: '#CA5010' }}>BlockchainBillboard</Link>.</Form.Label>
            <Button
              className="btn btn-lg btn-block"
              type="submit"
              disabled={isPending}
              variant="outline-dark"
            >
              <span>
                {isPending && <Spinner animation="border" size="sm" variant="dark" className='mr-2' />}
                {isPending ? "Minting your NFT Advertisement..." : "Mint your NFT Advertisement 🚀"}
              </span>
            </Button>
          </Form.Row>
        </Form.Group>
      </Form>
    </div>
  );
}

const IssueAdvertisementPage = ({ contract, eth_instance }) => {
  const { isConnected, address } = useAccount();
  return (
    <div>
      {isConnected && (
        <Alert show={true} variant="success">
          Thank you for connecting your wallet. We are delighted that you would consider advertising on the <b>BlockchainBillboard</b>. Be apart of blockchain internet history! 🌎
        </Alert>
      )}

      {!isConnected && (
        <Alert show={true} variant="success">
          Please connect with your wallet before issuing your NFT Advertisement. Limited advertising space available. 100 advertisements for 100 NFTs. &nbsp;&nbsp;<i>#TokenizeYourAdvertisement</i> 🖼️
        </Alert>
      )}

      <div style={{ lineHeight: '16px' }}>
        <Container>
          {isConnected ? (
            <div>
              <h2>Interested in advertising space? Let's issue your NFT Advertisement.</h2>
              <p className="text-muted">Please note that the following metadata will be attached to your NFT Advertisement forever ❤️</p>
              <FormExample
                account={address}
                contract={contract}
                eth_instance={eth_instance}
              />
            </div>
          ) : (
            <div className="App" style={{ textAlign: 'center' }}>
              <h2>Please connect with MetaMask... 🦊</h2>
              <img src="https://i.imgur.com/SemOdvB.png" width="150px" height="150px" alt='...' />
            </div>
          )}

          {!isConnected && (
            <div>
              <div className="row text-center">
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title font-weight-normal"><b>Learn about NFT Advertisements</b></h6>
                      <p className="card-text font-weight-normal">Prove ownership of your advertisement via a unique token</p>
                      <Link to={'/getting-started'}>
                        <button className="btn btn-outline-dark">NFT Advertisements</button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title font-weight-normal"><b>Explore our NFT Store @ OpenSea</b></h6>
                      <p className="card-text font-weight-normal">Consider exploring other advertisements via our NFT Store</p>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => window.open('https://testnets.opensea.io/collection/blockchainbillboard-nfts')}
                      >
                        NFT Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>

        {!isConnected && (
          <footer style={{ position: 'absolute', bottom: '0', width: '100%', height: '40px', backgroundColor: '#F8F9FA' }}>
            <Container style={{ margin: '11px' }}>
              <h6>BlockchainBillboard &copy; 2021 - Purchased by Charles via the <a type='text' style={{ color: '#CA5010' }} rel="noreferrer" target='_blank' href="https://flippa.com/">Flippa</a> platform.</h6>
            </Container>
          </footer>
        )}
      </div>
    </div>
  );
}

export default IssueAdvertisementPage;