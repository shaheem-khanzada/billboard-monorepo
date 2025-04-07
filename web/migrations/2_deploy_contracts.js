const BlockchainBillboard = artifacts.require("BlockchainBillboard");

module.exports = function(deployer) {
  deployer.deploy(BlockchainBillboard);
  // Additional contracts can be deployed here
};