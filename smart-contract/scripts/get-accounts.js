const hre = require("hardhat");

async function main() {
  // Get the network
  const network = await hre.ethers.provider.getNetwork();
  
  // Get the accounts
  const accounts = await hre.ethers.getSigners();
  
  console.log("Local Test Accounts:");
  console.log("===================");
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);
  
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const balance = await hre.ethers.provider.getBalance(account.address);
    
    console.log(`\nAccount ${i + 1}:`);
    console.log(`Address: ${account.address}`);
    console.log(`Private Key: ${account.privateKey}`);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 