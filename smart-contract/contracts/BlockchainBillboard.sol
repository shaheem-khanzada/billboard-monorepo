// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockchainBillboard is ERC721URIStorage, Ownable {
    address public secret;
    mapping(bytes => bool) private usedSignatures;
    mapping(uint256 => bool) private mintedTokens;

    event AdvertisementMinted(
        address indexed owner,
        uint256 indexed advertisementId,
        string ipfsURI
    );

    constructor(
        address _signer,
        address owner
    ) ERC721("Blockchain Billboard", "BB") Ownable(owner) {
        secret = _signer;
    }

    function mintAdvertisement(
        string memory ipfsURI,
        uint256 advertisementId,
        bytes calldata _signature
    ) public payable {
        require(
            !usedSignatures[_signature],
            "mintAdvertisement: Signature already used"
        );
        require(
            !mintedTokens[advertisementId],
            "mintAdvertisement: Slot unavailable!"
        );
        require(
            _verifyHashSignature(
                keccak256(abi.encode(msg.sender, ipfsURI, advertisementId)),
                _signature
            ),
            "mintAdvertisement: Signature is invalid"
        );
        usedSignatures[_signature] = true;
        _mintAdvertisement(msg.sender, advertisementId, ipfsURI);
    }

    function _mintAdvertisement(
        address recipient,
        uint256 advertisementId,
        string memory ipfsURI
    ) internal {
        _mint(recipient, advertisementId);
        _setTokenURI(advertisementId, ipfsURI);
        mintedTokens[advertisementId] = true;

        emit AdvertisementMinted(recipient, advertisementId, ipfsURI);
    }

    function withdrawFunds() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function _verifyHashSignature(
        bytes32 freshHash,
        bytes memory signature
    ) internal view returns (bool) {
        bytes32 hash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", freshHash)
        );

        bytes32 r;
        bytes32 s;
        uint8 v;

        if (signature.length != 65) {
            return false;
        }
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        address signer = address(0);
        if (v == 27 || v == 28) {
            // solium-disable-next-line arg-overflow
            signer = ecrecover(hash, v, r, s);
        }
        return secret == signer;
    }
}
