import React, { useState } from 'react';
import { Link } from 'react-router'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { useAccount } from 'wagmi';
import { useForm } from 'react-hook-form';

import { useMintToken } from '../hooks/useMintToken';
import { useAdvertisement } from '../hooks/useAdvertisement';
import { useUploadFiles } from '../hooks/useUploadFiles';


const FormExample = ({ account }) => {
  const { data } = useAdvertisement();
  const { availableSlots, advertisements } = data || {};
  const { mutateAsync: uploadFiles, isPending: isUploading } = useUploadFiles();
  const { mutate: mintToken, isPending: isMinting } = useMintToken();
  const [currentPrice, setCurrentPrice] = useState('');
  const [currentSlot, setCurrentSlot] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleSlotChange = (event) => {
    const currentSlot = parseInt(event.target.value);
    const advertisement = advertisements.find((ad) => ad.tokenId === currentSlot);
    const price = advertisement.isFreeMint ? 0 : advertisement.price;
    setCurrentPrice(price);
    setCurrentSlot(currentSlot);
  };

  const onSubmit = async (data) => {
    const { advertisement, ...rest } = data;
    const params = await uploadFiles({ image: advertisement[0], metadata: { ...rest, wallet: account }, });
    console.log("Upload params:", [...params, currentPrice]);
    mintToken([...params, currentPrice]);
  }

  return (
    <div>
      <Form style={{ textAlign: 'left', gap: 30, display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="walletAddress">
          <Form.Label>
            Wallet Address
            <Form.Text className="text-muted p-2">
              (Thank you for connecting your wallet)
            </Form.Text>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            defaultValue={account}
            disabled
          />
        </Form.Group>
        <Form.Group controlId="title">
          <Form.Label>
            * Title
            <Form.Text className="text-muted p-2">
              (What is a great title for your advertisement?)
            </Form.Text>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a title for your NFT Advertisement"
            {...register("title", { required: "Title is required" })}
            isInvalid={!!errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="websiteURL">
          <Form.Label>
            * Company Website URL
            <Form.Text className="text-muted p-2">
              (Which website would you like to advertise?)
            </Form.Text>
          </Form.Label>
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
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>
            * Description
            <Form.Text className="text-muted p-2">
              (How would you describe your advertisement?)
            </Form.Text>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a description for you NFT Advertisement"
            {...register("description", { required: "Description is required" })}
            isInvalid={!!errors.description}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="slotPosition">
          <Form.Label>
            * Advertisement Slot Position
            <Form.Text className="text-muted p-2">
              (Which slot position would you prefer on the Blockchain Billboard?)
            </Form.Text>
          </Form.Label>
          <Form.Control
            as="select"
            {...register("slotPosition", { required: "Slot position is required" })}
            onChange={handleSlotChange}
            isInvalid={!!errors.slotPosition}
          >
            <option value="">Select a slot</option>
            {(availableSlots || []).map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.slotPosition?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="industry">
          <Form.Label>
            * Industry
            <Form.Text className="text-muted p-2">
              (Which industry are you working in?)
            </Form.Text>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your company's industry here"
            {...register("industry", { required: "Industry is required" })}
            isInvalid={!!errors.industry}
          />
          <Form.Control.Feedback type="invalid">
            {errors.industry?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="advertisement">
          <Form.Label>
            * Advertisement Image
            <Form.Text className="text-muted p-2">
              (We only support PNG/JPG/GIF image format)
            </Form.Text>
          </Form.Label>
          <Form.Control required type="file" accept='image/*'  {...register("advertisement", { required: "Image is required" })} placeholder="Upload your advertisement" />
        </Form.Group>
        <Form.Group controlId="cost">
          <Form.Label>Final Price</Form.Label>
          <Form.Control
            type="text"
            value={currentPrice + " ETH"}
            disabled
          />
        </Form.Group>

        <Form.Label className="text-muted">Issue your NFT Advertisement and gain verifiable rights to slot position (#{currentSlot}) on the <Link to="/" style={{ color: '#CA5010' }}>BlockchainBillboard</Link>.</Form.Label>
        <Button
          className="btn btn-lg btn-block mb-8"
          type="submit"
          disabled={isUploading || isMinting}
          variant="outline-dark"
        >
          <span>
            {(isUploading || isMinting) && <Spinner animation="border" size="sm" variant="dark" className='mr-2' />}
            {(isUploading || isMinting) ? "Minting your NFT Advertisement..." : "Mint your NFT Advertisement 🚀"}
          </span>
        </Button>
      </Form>
    </div>
  );
}

const IssueAdvertisementPage = () => {
  const { isConnected, address } = useAccount();
  return (
    <div style={{ paddingBottom: 50 }}>
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

      <div>
        <Container>
          {isConnected ? (
            <div>
              <h2>Interested in advertising space? Let's issue your NFT Advertisement.</h2>
              <p className="text-muted">Please note that the following metadata will be attached to your NFT Advertisement forever ❤️</p>
              <FormExample
                account={address}
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