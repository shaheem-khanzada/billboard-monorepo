const hre = require("hardhat");

async function main() {
  const accounts = await hre.ethers.getSigners();
  
  console.log("Private Keys for Local Network:");
  console.log("=============================");
  
  accounts.forEach((account, index) => {
    console.log(`\nAccount ${index + 1}:`);
    console.log(`Address: ${account.address}`);
    console.log(`Private Key: ${Object.keys(account)}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 