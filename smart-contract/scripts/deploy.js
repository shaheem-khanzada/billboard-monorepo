const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("Deploying BlockchainBillboard contract...");
  
  // Get constructor parameters from environment variables
  const signerAddress = process.env.SIGNER_ADDRESS;
  const ownerAddress = process.env.OWNER_ADDRESS;

  if (!signerAddress || !ownerAddress) {
    throw new Error("Please set SIGNER_ADDRESS and OWNER_ADDRESS in your .env file");
  }

  console.log("Using signer address:", signerAddress);
  console.log("Using owner address:", ownerAddress);
  
  const BlockchainBillboard = await hre.ethers.getContractFactory("BlockchainBillboard");
  const billboard = await BlockchainBillboard.deploy(signerAddress, ownerAddress);
  
  await billboard.waitForDeployment();
  const address = await billboard.getAddress();
  
  console.log("BlockchainBillboard deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 