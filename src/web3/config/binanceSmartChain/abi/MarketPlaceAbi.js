import { networkType } from "../../networkType.js";
import collectionDexAbi from "./collectionNft/collectionNftAbi";
import nonCryptoDexAbi from "./nonCryptoDexAbi";

export const fixPriceAbi = [
  {
    constant: false,
    inputs: [
      { name: "nft_a", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "ownerId", type: "string" },
    ],
    name: "buyNFTBnb",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nft_a", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "ownerId", type: "string" },
      { name: "currencyType", type: "uint256" },
    ],
    name: "buyNFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "_supportNft",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "newPrice", type: "uint256" },
      { name: "baseCurrency", type: "uint256" },
      { name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "updatePrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "platform",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "countCopy",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "collectionConfig",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "getSellDetail",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" },
      { name: "", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "nonCryptoNFTVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_price", type: "uint256" },
      { name: "base", type: "uint256" },
      { name: "currencyType", type: "uint256" },
      { name: "tokenId", type: "uint256" },
      { name: "seller", type: "address" },
      { name: "nft_a", type: "address" },
    ],
    name: "calculatePrice",
    outputs: [{ name: "price", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nft_a", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "seller", type: "address" },
      { name: "price", type: "uint256" },
      { name: "baseCurrency", type: "uint256" },
      { name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "sellNFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "nft_a", type: "address" },
    ],
    name: "getPercentages",
    outputs: [
      { name: "mainPerecentage", type: "uint256" },
      { name: "authorPercentage", type: "uint256" },
      { name: "blindRAddress", type: "address" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "cancelSell",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "adminDiscount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_address", type: "address" },
      { name: "percentage", type: "uint256" },
      { name: "price", type: "uint256" },
    ],
    name: "bnbTransfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "adminOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "authorVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "ownerId", type: "string" },
      { name: "royality", type: "uint256" },
      { name: "currencyType", type: "uint256" },
      { name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "MintAndSellNFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nft_a", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "seller", type: "address" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "royalty", type: "uint256" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "SellNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nft_a", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "buyer", type: "address" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "calculated", type: "uint256" },
      { indexed: false, name: "currencyType", type: "uint256" },
    ],
    name: "BuyNFT",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
    ],
    name: "CancelSell",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "newPrice", type: "uint256" },
      { indexed: false, name: "isDollar", type: "bool" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "UpdatePrice",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nft_a", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "buyer", type: "string" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "calculated", type: "uint256" },
      { indexed: false, name: "currencyType", type: "uint256" },
    ],
    name: "BuyNFTNonCrypto",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nft_a", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "seller", type: "string" },
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "SellNFTNonCrypto",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "to", type: "string" },
      { indexed: false, name: "tokenURI", type: "string" },
      { indexed: false, name: "collection", type: "address" },
    ],
    name: "MintWithTokenURINonCrypto",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "to", type: "string" },
      { indexed: false, name: "tokenId", type: "uint256" },
    ],
    name: "TransferPackNonCrypto",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "to", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "uriT", type: "string" },
    ],
    name: "updateTokenEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "updateDiscount",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "creater", type: "address" },
      { indexed: false, name: "collection", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "symbol", type: "string" },
    ],
    name: "Collection",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "xCollection", type: "address" },
      { indexed: false, name: "factory", type: "address" },
    ],
    name: "CollectionsConfigured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "collection", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "minter", type: "address" },
      { indexed: false, name: "tokenURI", type: "string" },
    ],
    name: "MintWithTokenURI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
];

export const auctionDexAbi = [
  {
    constant: false,
    inputs: [
      { name: "_contract", type: "address" },
      { name: "_tokenId", type: "uint256" },
      { name: "_amount", type: "uint256" },
      { name: "awardType", type: "bool" },
      { name: "from", type: "address" },
    ],
    name: "placeBid",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_contract", type: "address" },
      { name: "_tokenId", type: "uint256" },
      { name: "awardType", type: "bool" },
      { name: "from", type: "address" },
    ],
    name: "placeBidBNB",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "_supportNft",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
      { name: "newPrice", type: "uint256" },
      { name: "baseCurrency", type: "uint256" },
      { name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "updatePrice",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_contract", type: "address" },
      { name: "_tokenId", type: "uint256" },
      { name: "_minPrice", type: "uint256" },
      { name: "baseCurrency", type: "uint256" },
      { name: "_endTime", type: "uint256" },
    ],
    name: "setOnAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "_contract", type: "address" },
    ],
    name: "onAuctionOrNot",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "platform",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "countCopy",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "collectionConfig",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "getSellDetail",
    outputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "address" },
      { name: "", type: "uint256" },
      { name: "", type: "uint256" },
      { name: "", type: "bool" },
      { name: "", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "nonCryptoNFTVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_price", type: "uint256" },
      { name: "base", type: "uint256" },
      { name: "currencyType", type: "uint256" },
      { name: "tokenId", type: "uint256" },
      { name: "seller", type: "address" },
      { name: "nft_a", type: "address" },
    ],
    name: "calculatePrice",
    outputs: [{ name: "price", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
      { name: "_contract", type: "address" },
      { name: "_minPrice", type: "uint256" },
      { name: "ownerId", type: "string" },
      { name: "_endTime", type: "uint256" },
      { name: "royality", type: "uint256" },
      { name: "baseCurrency", type: "uint256" },
    ],
    name: "MintAndAuctionNFT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "nft_a", type: "address" },
    ],
    name: "getPercentages",
    outputs: [
      { name: "mainPerecentage", type: "uint256" },
      { name: "authorPercentage", type: "uint256" },
      { name: "blindRAddress", type: "address" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "nftContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "cancelSell",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_contract", type: "address" },
      { name: "_tokenId", type: "uint256" },
      { name: "awardType", type: "bool" },
      { name: "ownerId", type: "string" },
      { name: "from", type: "address" },
    ],
    name: "claimAuction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "adminDiscount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "adminOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "authorVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
    ],
    name: "CancelSell",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "newPrice", type: "uint256" },
      { indexed: false, name: "isDollar", type: "bool" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
      { indexed: false, name: "allowedCurrencies", type: "uint256[]" },
    ],
    name: "UpdatePrice",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "seller", type: "address" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "startPrice", type: "uint256" },
      { indexed: false, name: "endTime", type: "uint256" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
    ],
    name: "OnAuction",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bidder", type: "address" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Bid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "bidder", type: "address" },
      { indexed: false, name: "nftContract", type: "address" },
      { indexed: false, name: "tokenId", type: "uint256" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "seller", type: "address" },
      { indexed: false, name: "baseCurrency", type: "uint256" },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "collection", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: false, name: "minter", type: "address" },
      { indexed: false, name: "tokenURI", type: "string" },
    ],
    name: "MintWithTokenURI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
];

export const mainDexAbi = [
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "_supportNft",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "funcSignatures",
    outputs: [{ name: "", type: "bytes" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "platform",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "countCopy",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_delegate", type: "address" },
      { name: "_functionSignatures", type: "string" },
      { name: "_commitMessage", type: "string" },
    ],
    name: "updateContract",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "collectionConfig",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "nonCryptoNFTVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "bytes4" }],
    name: "delegates",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "adminDiscount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "adminOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "authorVault",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "message", type: "string" }],
    name: "CommitMessage",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "functionId", type: "bytes4" },
      { indexed: true, name: "oldDelegate", type: "address" },
      { indexed: true, name: "newDelegate", type: "address" },
      { indexed: false, name: "functionSignature", type: "string" },
    ],
    name: "FunctionUpdate",
    type: "event",
  },
];

let abi = "";
if (networkType === "testnet") {
  abi = [
    //BSC CollectionDEX ABI
    ...collectionDexAbi,

    //BSC FixPriceDEX ABI
    ...fixPriceAbi,

    //BSC AuctionDex ABI
    ...auctionDexAbi,

    //BSC MainDex ABI
    ...mainDexAbi,

    ...nonCryptoDexAbi,
  ];
} else if (networkType === "mainnet") {
  abi = [
    //BSC CollectionDEX ABI
    ...collectionDexAbi,

    //BSC FixPriceDEX ABI
    ...fixPriceAbi,

    //BSC AuctionDex ABI
    ...auctionDexAbi,

    //BSC MainDex ABI
    ...mainDexAbi,

    ...nonCryptoDexAbi,
  ];
}

export default abi;
