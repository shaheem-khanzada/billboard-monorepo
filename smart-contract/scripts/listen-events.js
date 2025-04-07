const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const Billboard = await hre.ethers.getContractFactory("BlockchainBillboard");
  
  // Get the deployed contract address (you'll need to replace this with your deployed contract address)
  const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";
  const billboard = Billboard.attach(contractAddress);

  console.log("Listening to Billboard events...");

  // Listen to MessagePosted event
  billboard.on("MessagePosted", (messageId, sender, content, price, event) => {
    console.log("\nNew Message Posted!");
    console.log("==================");
    console.log(`Message ID: ${messageId}`);
    console.log(`Sender: ${sender}`);
    console.log(`Content: ${content}`);
    console.log(`Price: ${hre.ethers.formatEther(price)} ETH`);
    console.log(`Transaction Hash: ${event.transactionHash}`);
    console.log("==================\n");
  });

  // Listen to MaxSupplyUpdated event
  billboard.on("MaxSupplyUpdated", (newMaxSupply, event) => {
    console.log("\nMax Supply Updated!");
    console.log("==================");
    console.log(`New Max Supply: ${newMaxSupply}`);
    console.log(`Transaction Hash: ${event.transactionHash}`);
    console.log("==================\n");
  });

  // Listen to Withdrawal event
  billboard.on("Withdrawal", (amount, event) => {
    console.log("\nWithdrawal Made!");
    console.log("==================");
    console.log(`Amount: ${hre.ethers.formatEther(amount)} ETH`);
    console.log(`Transaction Hash: ${event.transactionHash}`);
    console.log("==================\n");
  });

  // Keep the script running
  console.log("Event listener is active. Press Ctrl+C to stop.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 