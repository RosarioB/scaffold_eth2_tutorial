// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    struct TokenData {
        string name;
        string description;
        string imageUrl;
        address owner;
    }

    TokenData[] public tokens;

    event TokenMinted(uint256 tokenId, address to, string name, string description, string imageUrl);

    constructor(address initialOwner)
        ERC721("MyNFT", "MNFT")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory _name, string memory _description, string memory _imageUrl) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        tokens.push();
        TokenData storage token = tokens[tokens.length -1];
        token.name = _name;
        token.description = _description;
        token.imageUrl = _imageUrl;
        token.owner = to;
        emit TokenMinted(tokenId, to, _name, _description, _imageUrl);
    }
    
    function getAllTokens() public view returns (TokenData[] memory) {
        return tokens;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
