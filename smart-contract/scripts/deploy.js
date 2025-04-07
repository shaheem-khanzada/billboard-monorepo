const hre = require("hardhat");

async function main() {
  console.log("Deploying BlockchainBillboard contract...");
  
  const BlockchainBillboard = await hre.ethers.getContractFactory("BlockchainBillboard");
  const billboard = await BlockchainBillboard.deploy();
  
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