// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainBillboard is ERC721URIStorage, Ownable {
    uint256 public totalMintedTokens;
    uint256 public maxSupply = 100;
    mapping(uint256 => bool) private mintedTokens;

    event AdvertisementMinted(address indexed owner, uint256 indexed advertisementId, string ipfsURI);
    
    constructor() ERC721("NFT Advertisement", "BB") Ownable(msg.sender) {
        totalMintedTokens = 0;
    }

    function mintAdvertisement(string memory ipfsURI, uint256 advertisementId) public payable {
        require(!mintedTokens[advertisementId], "Slot unavailable!");
        require(totalMintedTokens < maxSupply, "Max capacity reached!");

        _mintAdvertisement(msg.sender, advertisementId, ipfsURI);
    }

    function _mintAdvertisement(address recipient, uint256 advertisementId, string memory ipfsURI) internal {
        _mint(recipient, advertisementId);
        _setTokenURI(advertisementId, ipfsURI);
        mintedTokens[advertisementId] = true;
        totalMintedTokens++;

        emit AdvertisementMinted(recipient, advertisementId, ipfsURI);
    }

    function updateMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply > maxSupply, "New limit must be higher!");
        maxSupply = newMaxSupply;
    }

    function withdrawFunds() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
