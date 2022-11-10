import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import store from '../store';
import ImagesSrc from '../constants/Images';
import { networkType } from '../common/networkType';

//===================== Global Variables ===============================
export const IsTestNet = networkType === 'testnet' ? true : false;
export const SCAN_WALLET = 'SCAN_WALLET';
export const SCAN_APP = 'SCAN_APP';

//===================== Number Formatter Function ===============================
const numFormatter = price => {
  let num = parseFloat(price);
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  } else if (num <= 999) {
    return num; // if value < 1000, nothing to do
  }
};

//===================== Amount Validation Function ===============================
export const amountValidation = (e, currentValue = '') => {
  const reg = /^\d+(\.\d{0,8})?$/;

  let value = currentValue;

  if (e.length > 0 && reg.test(e)) {
    value = e;
  } else if (e.length == 1 && e === '.') {
    value = '0.';
  } else if (e.length == 0) {
    value = e;
  }
  return value;
};

//===================== RPC Urls (testnet) ===============================
// export const test_ethRpc = 'https://kovan.infura.io/v3/d9d12a4cf6ec4ea786890cd8c5dcc599';
export const test_ethRpc =
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
export const test_bnbRpc = 'https://data-seed-prebsc-2-s1.binance.org:8545/';
// export const test_bnbRpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
export const test_polRpc = 'https://rpc-mumbai.maticvigil.com/';
export const test_xanaRpc = 'https://testnet.xana.net/ext/bc/2dNW4t2bMKcnAamjCX7e79iFw1LEvyb8CYWXcX7NeUUQM9TdM8/rpc';

//===================== RPC Urls (mainnet) ===============================
export const ethRpc =
  'https://mainnet.infura.io/v3/e2fddb9deb984ba0b9e9daa116d1702a';
export const bnbRpc = 'https://bsc-dataseed1.binance.org/';
export const polRpc = 'https://polygon-rpc.com/';

//===================== WebSocket Links ===============================
export const _webSocketLinkEth =
  'wss://kovan.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a';
export const _webSocketLinkBsc =
  'wss://sparkling-lively-thunder.bsc.quiknode.pro/07fd71e94b68817b6a596dc947910035f41d7382/';
export const _webSocketLinkPolygon =
  'wss://ws-matic-mumbai.chainstacklabs.com/';

export const webSocketLinkEth =
  'wss://mainnet.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a';
export const webSocketLinkBsc =
  'wss://sparkling-lively-thunder.bsc.quiknode.pro/07fd71e94b68817b6a596dc947910035f41d7382/';
export const webSocketLinkPolygon = 'wss://ws-matic-mainnet.chainstacklabs.com';

///===================== To check Transaction Success/Failure Details ===============================
//========================= Urls (testnet) ================================
export const test_BscScanURL = 'https://testnet.bscscan.com/tx/';
export const test_PolygonScanURL = 'https://mumbai.polygonscan.com/tx/';
export const test_EthereumScanURL = 'https://kovan.etherscan.io/tx/';
//========================= Urls (mainnet) ================================
export const BscScanURL = 'https://testnet.bscscan.com/tx/';
export const PolygonScanURL = 'https://mumbai.polygonscan.com/tx/';
export const EthereumScanURL = 'https://kovan.etherscan.io/tx/';

//testnet
export const polygonNftDex = '0xC84E3F06Ae0f2cf2CA782A1cd0F653663c99280d';
export const polygonNftAbi = [
  {
    constant: true,
    inputs: [
      {
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'cancelSell',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFromAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'newPrice',
        type: 'uint256',
      },
      {
        name: 'newDollarPrice',
        type: 'uint256',
      },
    ],
    name: 'updatePrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'stringId',
        type: 'string',
      },
      {
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'updateAliaBalance',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenIdT',
        type: 'uint256',
      },
      {
        name: 'uriT',
        type: 'string',
      },
    ],
    name: 'updateTokenURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: '_supportNft',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: '_minPrice',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        name: '_endTime',
        type: 'uint256',
      },
    ],
    name: 'setOnAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'sellerId',
        type: 'string',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'sellNFTNonCrypto',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'platform',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: 'bidAddr',
        type: 'address',
      },
      {
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'updateBidder',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'nft_a',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
    ],
    name: 'buyNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: '_amount',
        type: 'uint256',
      },
      {
        name: 'awardType',
        type: 'bool',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'placeBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: '_royality',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'mintAliaForNonCrypto',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'allTokens',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nonCryptoNFTVault',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'ownerId',
        type: 'string',
      },
    ],
    name: 'getNonCryptoWallet',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'tokensOfOwner',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    name: 'addMinter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceMinter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getSellDetail',
    outputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: 'awardType',
        type: 'bool',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'claimAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenIdFunction',
        type: 'uint256',
      },
    ],
    name: 'getAuthor',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'sellList',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isMinter',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'adminDiscount',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'quantity',
        type: 'uint256',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: 'royality',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        name: '_isArtist',
        type: 'bool',
      },
    ],
    name: 'MintAndSellNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'nft_a',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'sellNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getNonCryptoOwner',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: '_dollarPrice',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'quantity',
        type: 'uint256',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_minPrice',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: '_endTime',
        type: 'uint256',
      },
      {
        name: 'royality',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'MintAndAuctionNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'onSell',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'adminOwner',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
    ],
    name: 'blindBox',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_discount',
        type: 'uint256',
      },
    ],
    name: 'setAdminDiscount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'authorVault',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'dollarPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'royalty',
        type: 'uint256',
      },
    ],
    name: 'SellNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'BuyNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'CancelSell',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'newPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'newDollarPrice',
        type: 'uint256',
      },
    ],
    name: 'UpdatePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'startPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'OnAuction',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'awardType',
        type: 'bool',
      },
    ],
    name: 'Bid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'awardType',
        type: 'bool',
      },
    ],
    name: 'Claim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'buyer',
        type: 'string',
      },
    ],
    name: 'BuyNFTNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'seller',
        type: 'string',
      },
      {
        indexed: false,
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'dollarPrice',
        type: 'uint256',
      },
    ],
    name: 'SellNFTNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'string',
      },
      {
        indexed: false,
        name: 'tokenURI',
        type: 'string',
      },
      {
        indexed: false,
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'flag',
        type: 'bool',
      },
    ],
    name: 'MintWithTokenURINonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'seller',
        type: 'string',
      },
      {
        indexed: false,
        name: 'startPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'awardAuctionNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'string',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'TransferPackNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'uriT',
        type: 'string',
      },
    ],
    name: 'updateTokenEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'updateDiscount',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'action',
        type: 'string',
      },
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenURI',
        type: 'string',
      },
      {
        indexed: false,
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'flag',
        type: 'bool',
      },
      {
        indexed: false,
        name: 'token',
        type: 'uint256',
      },
    ],
    name: 'MintWithTokenURI',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'MinterAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'MinterRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
];

export const maticNftDex_new = '0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3';
export const ethNftDex_new = '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852';
export const binanceNftDex_new = '0x1B96B92314C44b159149f7E0303511fB2Fc4774f';
export const xetaNftDex_new = '0x1B96B92314C44b159149f7E0303511fB2Fc4774f';
export const binanceNftAbi_new = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'burn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: '_reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token1',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const binanceNftDex = '0xc2F19E2be5c5a1AA7A998f44B759eb3360587ad1';
export const binanceNftAbi = [
  {
    constant: true,
    inputs: [
      {
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'cancelSell',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFromAdmin',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'newPrice',
        type: 'uint256',
      },
      {
        name: 'newDollarPrice',
        type: 'uint256',
      },
    ],
    name: 'updatePrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenIdT',
        type: 'uint256',
      },
      {
        name: 'uriT',
        type: 'string',
      },
    ],
    name: 'updateTokenURI',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: '_supportNft',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: '_minPrice',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        name: '_endTime',
        type: 'uint256',
      },
    ],
    name: 'setOnAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'token',
        type: 'uint256',
      },
    ],
    name: 'getboxNameByToken',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'sellerId',
        type: 'string',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'sellNFTNonCrypto',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'info',
        type: 'string',
      },
    ],
    name: 'getrevenueAddressBlindBox',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'add',
        type: 'address',
      },
    ],
    name: 'setDex',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'platform',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'nft_a',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
    ],
    name: 'buyNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: '_amount',
        type: 'uint256',
      },
      {
        name: 'awardType',
        type: 'bool',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'placeBid',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: '_royality',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'mintAliaForNonCrypto',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'allTokens',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'nonCryptoNFTVault',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'ownerId',
        type: 'string',
      },
    ],
    name: 'getNonCryptoWallet',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'tokensOfOwner',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'isOwner',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    name: 'addMinter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceMinter',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getSellDetail',
    outputs: [
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'address',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256',
      },
      {
        name: 'awardType',
        type: 'bool',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: 'from',
        type: 'address',
      },
    ],
    name: 'claimAuction',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenIdFunction',
        type: 'uint256',
      },
    ],
    name: 'getAuthor',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: 'boxName',
        type: 'string',
      },
    ],
    name: 'blindBox',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: 'sellList',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isMinter',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'adminDiscount',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'quantity',
        type: 'uint256',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: 'royality',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
      {
        name: '_isArtist',
        type: 'bool',
      },
    ],
    name: 'MintAndSellNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'nft_a',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: 'seller',
        type: 'address',
      },
      {
        name: 'price',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'sellNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'from',
        type: 'address',
      },
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenId',
        type: 'uint256',
      },
      {
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getNonCryptoOwner',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    name: '_dollarPrice',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'to',
        type: 'address',
      },
      {
        name: 'tokenURI',
        type: 'string',
      },
      {
        name: 'quantity',
        type: 'uint256',
      },
      {
        name: 'flag',
        type: 'bool',
      },
      {
        name: '_contract',
        type: 'address',
      },
      {
        name: '_minPrice',
        type: 'uint256',
      },
      {
        name: 'ownerId',
        type: 'string',
      },
      {
        name: '_endTime',
        type: 'uint256',
      },
      {
        name: 'royality',
        type: 'uint256',
      },
      {
        name: 'priceDollar',
        type: 'uint256',
      },
    ],
    name: 'MintAndAuctionNFT',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'onSell',
    outputs: [
      {
        name: '',
        type: 'uint256[]',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_address',
        type: 'address',
      },
      {
        name: 'name',
        type: 'string',
      },
    ],
    name: 'registerAddressBlindbox',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    name: 'adminOwner',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'owner',
        type: 'address',
      },
      {
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_discount',
        type: 'uint256',
      },
    ],
    name: 'setAdminDiscount',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'authorVault',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'dollarPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'royalty',
        type: 'uint256',
      },
    ],
    name: 'SellNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'BuyNFT',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'CancelSell',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'newPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'newDollarPrice',
        type: 'uint256',
      },
    ],
    name: 'UpdatePrice',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'seller',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'startPrice',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'endTime',
        type: 'uint256',
      },
    ],
    name: 'OnAuction',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Bid',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'bidder',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Claim',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'buyer',
        type: 'string',
      },
    ],
    name: 'BuyNFTNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'nft_a',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'seller',
        type: 'string',
      },
      {
        indexed: false,
        name: 'price',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'dollarPrice',
        type: 'uint256',
      },
    ],
    name: 'SellNFTNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'string',
      },
      {
        indexed: false,
        name: 'tokenURI',
        type: 'string',
      },
      {
        indexed: false,
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'flag',
        type: 'bool',
      },
    ],
    name: 'MintWithTokenURINonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'string',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'TransferPackNonCrypto',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'uriT',
        type: 'string',
      },
    ],
    name: 'updateTokenEvent',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'updateDiscount',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'action',
        type: 'string',
      },
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'tokenURI',
        type: 'string',
      },
      {
        indexed: false,
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'flag',
        type: 'bool',
      },
      {
        indexed: false,
        name: 'token',
        type: 'uint256',
      },
    ],
    name: 'MintWithTokenURI',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'MinterAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'account',
        type: 'address',
      },
    ],
    name: 'MinterRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
];
export const lpAliaContractAddr = '0xD9E8a84Bb1CF583410bEd19af437DdD057053d17';
export const lpAliaContractAbi = [
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1In',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        indexed: false,
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
    ],
    name: 'Sync',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'burn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount0',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: '_reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: '_reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: '_blockTimestampLast',
        type: 'uint32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: '_token0',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_token1',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [
      {
        internalType: 'uint256',
        name: 'liquidity',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount0Out',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount1Out',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

//======================== Environment config ==================================
export const environment = {
  s3BucketConfig: {
    region: 'ap-southeast-1',
    accessKeyId: 'AKIA4J4DJVXPRVCAMSVA',
    secretAccessKey: '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',
  },
  stripeKey: {
    p_key: IsTestNet
      ? 'pk_test_51Jbha5Ee7q061aolrboDAHMlO4Y6eYpoHZtARZwQcFXUIu0fxFFzHjFKSTQNUnfrYO6owRxHzfECLULhV7RXZ7Zr00oa6Um1Zb'
      : 'pk_live_51Jbha5Ee7q061aolh0uX0uwQnJ30MydHuT4yJGN98fkM8v0dOTpkBONT7B2ZNTGiHFGOoagsU0TDJgJFO7hjhMFl00uPoEkbuR',
  },
  //======================== RPC Urls ========================
  ethRpc: IsTestNet ? test_ethRpc : ethRpc,
  bnbRpc: IsTestNet ? test_bnbRpc : bnbRpc,
  polRpc: IsTestNet ? test_polRpc : polRpc,
  xanaRpc: IsTestNet ? test_xanaRpc : test_xanaRpc,

  //======================== Websocket Links ========================
  wsEth: IsTestNet ? _webSocketLinkEth : webSocketLinkEth,
  wsBsc: IsTestNet ? _webSocketLinkBsc : webSocketLinkBsc,
  wsPolygon: IsTestNet ? _webSocketLinkPolygon : webSocketLinkPolygon,

  //======================== Scan Urls ========================
  bscScanURL: IsTestNet ? test_BscScanURL : BscScanURL,
  polygonScanURL: IsTestNet ? test_PolygonScanURL : PolygonScanURL,
  ethereumScanURL: IsTestNet ? test_EthereumScanURL : EthereumScanURL,

  // usdcCont: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  usdcCont: IsTestNet
    ? '0x23a91170fa76141ac09f126e8d56bd9896d1fd5c'
    : '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  // usdcAbi: IsTestNet
  //   ? [
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'name',
  //       outputs: [{ name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'spender', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'approve',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'totalSupply',
  //       outputs: [{ name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'from', type: 'address' },
  //         { name: 'to', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'transferFrom',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'decimals',
  //       outputs: [{ name: '', type: 'uint8' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'spender', type: 'address' },
  //         { name: 'addedValue', type: 'uint256' },
  //       ],
  //       name: 'increaseAllowance',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'unpause',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'to', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'mint',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [{ name: 'account', type: 'address' }],
  //       name: 'isPauser',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'account', type: 'address' },
  //         { name: '_account2', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'internalTransfer',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'paused',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'renouncePauser',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [{ name: 'owner', type: 'address' }],
  //       name: 'balanceOf',
  //       outputs: [{ name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'renounceOwnership',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ name: 'account', type: 'address' }],
  //       name: 'addPauser',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'pause',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'owner',
  //       outputs: [{ name: '', type: 'address' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [],
  //       name: 'symbol',
  //       outputs: [{ name: '', type: 'string' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ name: 'account', type: 'address' }],
  //       name: 'addMinter',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [],
  //       name: 'renounceMinter',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'account', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'burn',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'spender', type: 'address' },
  //         { name: 'subtractedValue', type: 'uint256' },
  //       ],
  //       name: 'decreaseAllowance',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'to', type: 'address' },
  //         { name: 'value', type: 'uint256' },
  //       ],
  //       name: 'transfer',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [{ name: 'account', type: 'address' }],
  //       name: 'isMinter',
  //       outputs: [{ name: '', type: 'bool' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [
  //         { name: 'recipients', type: 'address[]' },
  //         { name: 'values', type: 'uint256[]' },
  //       ],
  //       name: 'drop',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       constant: true,
  //       inputs: [
  //         { name: 'owner', type: 'address' },
  //         { name: 'spender', type: 'address' },
  //       ],
  //       name: 'allowance',
  //       outputs: [{ name: '', type: 'uint256' }],
  //       payable: false,
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       constant: false,
  //       inputs: [{ name: 'newOwner', type: 'address' }],
  //       name: 'transferOwnership',
  //       outputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [],
  //       payable: false,
  //       stateMutability: 'nonpayable',
  //       type: 'constructor',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: false, name: 'account', type: 'address' }],
  //       name: 'Paused',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: false, name: 'account', type: 'address' }],
  //       name: 'Unpaused',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: true, name: 'account', type: 'address' }],
  //       name: 'PauserAdded',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: true, name: 'account', type: 'address' }],
  //       name: 'PauserRemoved',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: true, name: 'account', type: 'address' }],
  //       name: 'MinterAdded',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [{ indexed: true, name: 'account', type: 'address' }],
  //       name: 'MinterRemoved',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         { indexed: true, name: 'previousOwner', type: 'address' },
  //         { indexed: true, name: 'newOwner', type: 'address' },
  //       ],
  //       name: 'OwnershipTransferred',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         { indexed: true, name: 'from', type: 'address' },
  //         { indexed: true, name: 'to', type: 'address' },
  //         { indexed: false, name: 'value', type: 'uint256' },
  //       ],
  //       name: 'Transfer',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         { indexed: true, name: 'owner', type: 'address' },
  //         { indexed: true, name: 'spender', type: 'address' },
  //         { indexed: false, name: 'value', type: 'uint256' },
  //       ],
  //       name: 'Approval',
  //       type: 'event',
  //     },
  //   ]
  //   : [
  //     {
  //       inputs: [
  //         { internalType: 'address', name: '_proxyTo', type: 'address' },
  //       ],
  //       stateMutability: 'nonpayable',
  //       type: 'constructor',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: 'address',
  //           name: '_new',
  //           type: 'address',
  //         },
  //         {
  //           indexed: false,
  //           internalType: 'address',
  //           name: '_old',
  //           type: 'address',
  //         },
  //       ],
  //       name: 'ProxyOwnerUpdate',
  //       type: 'event',
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: '_new',
  //           type: 'address',
  //         },
  //         {
  //           indexed: true,
  //           internalType: 'address',
  //           name: '_old',
  //           type: 'address',
  //         },
  //       ],
  //       name: 'ProxyUpdated',
  //       type: 'event',
  //     },
  //     { stateMutability: 'payable', type: 'fallback' },
  //     {
  //       inputs: [],
  //       name: 'IMPLEMENTATION_SLOT',
  //       outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [],
  //       name: 'OWNER_SLOT',
  //       outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [],
  //       name: 'implementation',
  //       outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [],
  //       name: 'proxyOwner',
  //       outputs: [{ internalType: 'address', name: '', type: 'address' }],
  //       stateMutability: 'view',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [],
  //       name: 'proxyType',
  //       outputs: [
  //         { internalType: 'uint256', name: 'proxyTypeId', type: 'uint256' },
  //       ],
  //       stateMutability: 'pure',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [
  //         { internalType: 'address', name: 'newOwner', type: 'address' },
  //       ],
  //       name: 'transferProxyOwnership',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [
  //         { internalType: 'address', name: '_newProxyTo', type: 'address' },
  //         { internalType: 'bytes', name: 'data', type: 'bytes' },
  //       ],
  //       name: 'updateAndCall',
  //       outputs: [],
  //       stateMutability: 'payable',
  //       type: 'function',
  //     },
  //     {
  //       inputs: [
  //         { internalType: 'address', name: '_newProxyTo', type: 'address' },
  //       ],
  //       name: 'updateImplementation',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //     { stateMutability: 'payable', type: 'receive' },
  //   ],

  usdcAbi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'isPauser',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'account', type: 'address' },
        { name: '_account2', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'internalTransfer',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renouncePauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'addPauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'addMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'account', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'burn',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'isMinter',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'recipients', type: 'address[]' },
        { name: 'values', type: 'uint256[]' },
      ],
      name: 'drop',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'account', type: 'address' }],
      name: 'Paused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'account', type: 'address' }],
      name: 'Unpaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'PauserAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'PauserRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'MinterAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'MinterRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'previousOwner', type: 'address' },
        { indexed: true, name: 'newOwner', type: 'address' },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
  ],

  aliaCont: '0x13861C017735d3b2F0678A546948D67AD51AC07B',
  aliaAbi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'from',
          type: 'address',
        },
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'addedValue',
          type: 'uint256',
        },
      ],
      name: 'increaseAllowance',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'mint',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'account',
          type: 'address',
        },
      ],
      name: 'isPauser',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renouncePauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'account',
          type: 'address',
        },
      ],
      name: 'addPauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'account',
          type: 'address',
        },
      ],
      name: 'addMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'account',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'burn',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'subtractedValue',
          type: 'uint256',
        },
      ],
      name: 'decreaseAllowance',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'to',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'account',
          type: 'address',
        },
      ],
      name: 'isMinter',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'spender',
          type: 'address',
        },
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'init',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Paused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'Unpaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'PauserAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'PauserRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'MinterAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'account',
          type: 'address',
        },
      ],
      name: 'MinterRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          name: 'spender',
          type: 'address',
        },
        {
          indexed: false,
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
  ],

  busdCont: IsTestNet
    ? '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
    : '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  busdAbi: IsTestNet
    ? [
      {
        constant: false,
        inputs: [],
        name: 'disregardProposeOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_spender', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'assetProtectionRole',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'r', type: 'bytes32[]' },
          { name: 's', type: 'bytes32[]' },
          { name: 'v', type: 'uint8[]' },
          { name: 'to', type: 'address[]' },
          { name: 'value', type: 'uint256[]' },
          { name: 'fee', type: 'uint256[]' },
          { name: 'seq', type: 'uint256[]' },
          { name: 'deadline', type: 'uint256[]' },
        ],
        name: 'betaDelegatedTransferBatch',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'sig', type: 'bytes' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'fee', type: 'uint256' },
          { name: 'seq', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
        name: 'betaDelegatedTransfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_from', type: 'address' },
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'initializeDomainSeparator',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'unpause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'unfreeze',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'claimOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_newSupplyController', type: 'address' }],
        name: 'setSupplyController',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'paused',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'initialize',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'pause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getOwner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: 'target', type: 'address' }],
        name: 'nextSeqOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_newAssetProtectionRole', type: 'address' }],
        name: 'setAssetProtectionRole',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'freeze',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_newWhitelister', type: 'address' }],
        name: 'setBetaDelegateWhitelister',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_value', type: 'uint256' }],
        name: 'decreaseSupply',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'isWhitelistedBetaDelegate',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'whitelistBetaDelegate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_proposedOwner', type: 'address' }],
        name: 'proposeOwner',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_value', type: 'uint256' }],
        name: 'increaseSupply',
        outputs: [{ name: 'success', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'betaDelegateWhitelister',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'proposedOwner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'unwhitelistBetaDelegate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { name: '_owner', type: 'address' },
          { name: '_spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'wipeFrozenAddress',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'EIP712_DOMAIN_HASH',
        outputs: [{ name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_addr', type: 'address' }],
        name: 'isFrozen',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'supplyController',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'reclaimBUSD',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'owner', type: 'address' },
          { indexed: true, name: 'spender', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'currentOwner', type: 'address' },
          { indexed: true, name: 'proposedOwner', type: 'address' },
        ],
        name: 'OwnershipTransferProposed',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'oldProposedOwner', type: 'address' }],
        name: 'OwnershipTransferDisregarded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'oldOwner', type: 'address' },
          { indexed: true, name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
      { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'addr', type: 'address' }],
        name: 'AddressFrozen',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'addr', type: 'address' }],
        name: 'AddressUnfrozen',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'addr', type: 'address' }],
        name: 'FrozenAddressWiped',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'oldAssetProtectionRole', type: 'address' },
          { indexed: true, name: 'newAssetProtectionRole', type: 'address' },
        ],
        name: 'AssetProtectionRoleSet',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'SupplyIncreased',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'SupplyDecreased',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'oldSupplyController', type: 'address' },
          { indexed: true, name: 'newSupplyController', type: 'address' },
        ],
        name: 'SupplyControllerSet',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
          { indexed: false, name: 'seq', type: 'uint256' },
          { indexed: false, name: 'fee', type: 'uint256' },
        ],
        name: 'BetaDelegatedTransfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'oldWhitelister', type: 'address' },
          { indexed: true, name: 'newWhitelister', type: 'address' },
        ],
        name: 'BetaDelegateWhitelisterSet',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'newDelegate', type: 'address' }],
        name: 'BetaDelegateWhitelisted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'oldDelegate', type: 'address' }],
        name: 'BetaDelegateUnwhitelisted',
        type: 'event',
      },
    ]
    : [
      {
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        constant: true,
        inputs: [],
        name: '_decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: '_name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: '_symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        name: 'burn',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
        ],
        name: 'decreaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getOwner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
        ],
        name: 'increaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        name: 'mint',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'newOwner', type: 'address' },
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],

  usdtCont: IsTestNet
    ? '0x7c83dc9221cfd48ac760710b7f1cd7b76ff6fcc2'
    : '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  usdtAbi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_upgradedAddress', type: 'address' }],
      name: 'deprecate',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_spender', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'deprecated',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_evilUser', type: 'address' }],
      name: 'addBlackList',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_from', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'upgradedAddress',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '', type: 'address' }],
      name: 'balances',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'maximumFee',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: '_totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '_maker', type: 'address' }],
      name: 'getBlackListStatus',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '', type: 'address' },
        { name: '', type: 'address' },
      ],
      name: 'allowed',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'who', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getOwner',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: '_to', type: 'address' },
        { name: '_value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'newBasisPoints', type: 'uint256' },
        { name: 'newMaxFee', type: 'uint256' },
      ],
      name: 'setParams',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'amount', type: 'uint256' }],
      name: 'issue',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'amount', type: 'uint256' }],
      name: 'redeem',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: '_owner', type: 'address' },
        { name: '_spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: 'remaining', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'basisPointsRate',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: '', type: 'address' }],
      name: 'isBlackListed',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_clearedUser', type: 'address' }],
      name: 'removeBlackList',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'MAX_UINT',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: '_blackListedUser', type: 'address' }],
      name: 'destroyBlackFunds',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { name: '_initialSupply', type: 'uint256' },
        { name: '_name', type: 'string' },
        { name: '_symbol', type: 'string' },
        { name: '_decimals', type: 'uint256' },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
      name: 'Issue',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'amount', type: 'uint256' }],
      name: 'Redeem',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'newAddress', type: 'address' }],
      name: 'Deprecate',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: 'feeBasisPoints', type: 'uint256' },
        { indexed: false, name: 'maxFee', type: 'uint256' },
      ],
      name: 'Params',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: '_blackListedUser', type: 'address' },
        { indexed: false, name: '_balance', type: 'uint256' },
      ],
      name: 'DestroyedBlackFunds',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: '_user', type: 'address' }],
      name: 'AddedBlackList',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: '_user', type: 'address' }],
      name: 'RemovedBlackList',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
    { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
    { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
  ],

  tnftCont: IsTestNet
    ? '0x8D8108A9cFA5a669300074A602f36AF3252B7533'
    : '0x13861C017735d3b2F0678A546948D67AD51AC07B',
  tnftAbi: [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'transferFrom',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [{ name: '', type: 'uint8' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'addedValue', type: 'uint256' },
      ],
      name: 'increaseAllowance',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'unpause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'isPauser',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'paused',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renouncePauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'addPauser',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'pause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [{ name: '', type: 'address' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [{ name: '', type: 'string' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'addMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'renounceMinter',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'account', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'burn',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'subtractedValue', type: 'uint256' },
      ],
      name: 'decreaseAllowance',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [{ name: 'account', type: 'address' }],
      name: 'isMinter',
      outputs: [{ name: '', type: 'bool' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: '', type: 'uint256' }],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'init',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [{ name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'account', type: 'address' }],
      name: 'Paused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: false, name: 'account', type: 'address' }],
      name: 'Unpaused',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'PauserAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'PauserRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'MinterAdded',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: 'account', type: 'address' }],
      name: 'MinterRemoved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'previousOwner', type: 'address' },
        { indexed: true, name: 'newOwner', type: 'address' },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'from', type: 'address' },
        { indexed: true, name: 'to', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    },
  ],

  talCont: IsTestNet
    ? '0x6275BD7102b14810C7Cfe69507C3916c7885911A'
    : '0xe1a4af407A124777A4dB6bB461b6F256c1f8E341',
  // talAbi: [{ "constant": false, "inputs": [{ "name": "_newImplementation", "type": "address" }], "name": "upgradeTo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "implementation", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }],

  wethCont: IsTestNet
    ? '0xd93e56eb481d63b12b364adb8343c4b28623eebf'
    : '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  wethAbi: IsTestNet
    ? [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'addedValue', type: 'uint256' },
        ],
        name: 'increaseAllowance',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'unpause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'mint',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'isPauser',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'account', type: 'address' },
          { name: '_account2', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'internalTransfer',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'paused',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'renouncePauser',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'addPauser',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'pause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'addMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'renounceMinter',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'account', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'burn',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'subtractedValue', type: 'uint256' },
        ],
        name: 'decreaseAllowance',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'isMinter',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: 'recipients', type: 'address[]' },
          { name: 'values', type: 'uint256[]' },
        ],
        name: 'drop',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'newOwner', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, name: 'account', type: 'address' }],
        name: 'Paused',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, name: 'account', type: 'address' }],
        name: 'Unpaused',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'account', type: 'address' }],
        name: 'PauserAdded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'account', type: 'address' }],
        name: 'PauserRemoved',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'account', type: 'address' }],
        name: 'MinterAdded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'account', type: 'address' }],
        name: 'MinterRemoved',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'previousOwner', type: 'address' },
          { indexed: true, name: 'newOwner', type: 'address' },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'from', type: 'address' },
          { indexed: true, name: 'to', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: 'owner', type: 'address' },
          { indexed: true, name: 'spender', type: 'address' },
          { indexed: false, name: 'value', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
    ]
    : [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'childChainManager',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'userAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address payable',
            name: 'relayerAddress',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bytes',
            name: 'functionSignature',
            type: 'bytes',
          },
        ],
        name: 'MetaTransactionExecuted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'previousAdminRole',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'newAdminRole',
            type: 'bytes32',
          },
        ],
        name: 'RoleAdminChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleGranted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'bytes32',
            name: 'role',
            type: 'bytes32',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'RoleRevoked',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [],
        name: 'CHILD_CHAIN_ID',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'CHILD_CHAIN_ID_BYTES',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'DEFAULT_ADMIN_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'DEPOSITOR_ROLE',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ERC712_VERSION',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ROOT_CHAIN_ID',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'ROOT_CHAIN_ID_BYTES',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
        ],
        name: 'decreaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'user', type: 'address' },
          { internalType: 'bytes', name: 'depositData', type: 'bytes' },
        ],
        name: 'deposit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'userAddress', type: 'address' },
          { internalType: 'bytes', name: 'functionSignature', type: 'bytes' },
          { internalType: 'bytes32', name: 'sigR', type: 'bytes32' },
          { internalType: 'bytes32', name: 'sigS', type: 'bytes32' },
          { internalType: 'uint8', name: 'sigV', type: 'uint8' },
        ],
        name: 'executeMetaTransaction',
        outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getChainId',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getDomainSeperator',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
        name: 'getNonce',
        outputs: [{ internalType: 'uint256', name: 'nonce', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleAdmin',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'uint256', name: 'index', type: 'uint256' },
        ],
        name: 'getRoleMember',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
        name: 'getRoleMemberCount',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'grantRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'hasRole',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
        ],
        name: 'increaseAllowance',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'renounceRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],

  polygonNftDex: IsTestNet ? polygonNftDex : polygonNftDex,
  binanceNftDex: IsTestNet ? binanceNftDex : binanceNftDex,
  polygonNftAbi: IsTestNet ? polygonNftAbi : polygonNftAbi,
  binanceNftAbi: IsTestNet ? binanceNftAbi : binanceNftAbi,
};
//======================== End Environment config =================================

//========================= Get Config Details from Environment =======================
export const getConfigDetailsFromEnviorment = (type, tokenType) => {
  const config = {
    rpcURL: '',
    ContractAddress: '',
    ContractAbis: '',
    error: '',
  };
  const chainType = type?.toLowerCase();
  // const tokenType = tokenType?.toLowerCase();
  if (chainType === 'polygon') {
    if (tokenType === 'ALIA') {
      config.rpcURL = environment.polRpc;
      config.ContractAddress = environment.talCont;
      config.ContractAbis = environment.tnftAbi;
    } else if (tokenType === 'Matic') {
      config.rpcURL = environment.polRpc;
      config.ContractAddress = '';
      config.ContractAbis = '';
    } else if (tokenType === 'USDC') {
      config.rpcURL = environment.polRpc;
      config.ContractAddress = environment.usdcCont;
      config.ContractAbis = environment.usdcAbi;
    } else if (tokenType === 'TAL') {
      config.rpcURL = environment.polRpc;
      config.ContractAddress = environment.talCont;
      config.ContractAbis = environment.tnftAbi;
    } else if (tokenType === 'WETH') {
      config.rpcURL = environment.polRpc;
      config.ContractAddress = environment.wethCont;
      config.ContractAbis = environment.wethAbi;
    } else {
      config.error = 'invalid tokenType';
    }
  } else if (chainType === 'bsc') {
    if (tokenType === 'BNB') {
      config.rpcURL = environment.bnbRpc;
      config.ContractAddress = '';
      config.ContractAbis = '';
    } else if (tokenType === 'BUSD') {
      config.rpcURL = environment.bnbRpc;
      config.ContractAddress = environment.busdCont;
      config.ContractAbis = environment.busdAbi;
    } else if (tokenType === 'ALIA') {
      config.rpcURL = environment.bnbRpc;
      config.ContractAddress = environment.tnftCont;
      config.ContractAbis = environment.tnftAbi;
    } else if (tokenType === 'TNFT') {
      config.rpcURL = environment.bnbRpc;
      config.ContractAddress = environment.tnftCont;
      config.ContractAbis = environment.tnftAbi;
    } else {
      config.error = 'invalid tokenType';
    }
  } else if (chainType === 'ethereum') {
    if (tokenType === 'ETH') {
      config.rpcURL = environment.ethRpc;
      config.ContractAddress = '';
      config.ContractAbis = '';
    } else if (tokenType === 'USDT') {
      config.rpcURL = environment.ethRpc;
      config.ContractAddress = environment.usdtCont;
      config.ContractAbis = environment.usdtAbi;
    } else {
      config.error = 'invalid tokenType';
    }
  } else if (chainType === 'xana chain') {
    if (tokenType === 'XETA') {
      config.rpcURL = environment.xanaRpc;
      config.ContractAddress = '';
      config.ContractAbis = '';
    } else {
      config.error = 'invalid tokenType';
    }
  } else {
    config.error = 'invalid chainType';
  }
  return config;
};

//=========================== Language Contant(Array) =============================
export const languageArray = [
  {
    language_id: 1,
    language_name: 'en',
    language_display: 'English (United States)',
    isSelected: true,
  },
  {
    language_id: 2,
    language_name: 'ko',
    language_display: '한국어',
    isSelected: true,
  },
  {
    language_id: 3,
    language_name: 'ja',
    language_display: '日本語',
    isSelected: true,
  },
  {
    language_id: 4,
    language_name: 'tw',
    language_display: '中文（繁体）',
    isSelected: true,
  },
  {
    language_id: 5,
    language_name: 'ch',
    language_display: '中文（简体）',
    isSelected: true,
  },
];

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

//=========================== SetI18nConfig (Language) Function =============================
export function setI18nConfig(tag) {
  const translationGetters = {
    en: () => store.getState().LanguageReducer.en,
    ja: () => store.getState().LanguageReducer.ja,
    ko: () => store.getState().LanguageReducer.ko,
    ch: () => store.getState().LanguageReducer.ch,
    tw: () => store.getState().LanguageReducer.tw,
  };
  const fallback = { languageTag: tag || 'en' };
  const { languageTag } = fallback;
  translate.cache.clear();
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  // console.log('translations',i18n.translations);
  i18n.locale = languageTag;
}

//=========================== Get Location Function =============================
export const getLocation = (x0, y0, radius) => {
  // Convert radius from meters to degrees
  let radiusInDegrees = radius / 111000;

  let u = Math.random();
  let v = Math.random();
  let w = radiusInDegrees * Math.sqrt(u);
  let t = 2 * Math.PI * v;
  let x = w * Math.cos(t);
  let y = w * Math.sin(t);

  // Adjust the x-coordinate for the shrinking of the east-west distances
  let new_x = x / Math.cos(y0);

  let foundLongitude = new_x + x0;
  let foundLatitude = y + y0;
  return {
    latitude: foundLatitude,
    longitude: foundLongitude,
  };
};

//=========================== Card Mask Constant =============================
export const CARD_MASK = [
  [/\d/],
  [/\d/],
  [/\d/],
  [/\d/],
  ' ',
  [/\d/],
  [/\d/],
  [/\d/],
  [/\d/],
  ' ',
  [/\d/],
  [/\d/],
  [/\d/],
  [/\d/],
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const networkChain = [
  {
    name: 'Ethereum',
    value: 'ethereum',
    icon: ImagesSrc.etherium,
    translatedName: 'イーサリアム',
  },
  {
    name: 'BSC',
    value: 'binance',
    icon: ImagesSrc.smartChain,
    translatedName: 'バイナンス',
  },
  {
    name: 'Polygon',
    value: 'polygon',
    icon: ImagesSrc.polygonNew,
    translatedName: 'ポリゴン',
  },
  {
    name: 'Xana',
    value: 'xana',
    icon: ImagesSrc.polygonNew,
    translatedName: 'ポリゴン',
  },
];

//=========================== Token Constant =============================
export const tokens = [
  {
    type: 'BNB',
    tokenName: 'BNB',
    icon: ImagesSrc.smartChain,
    amount: '$387.41',
    percent: '+10.49%',
    tokenValue: '0',
    network: 'BSC',
  },
  {
    type: 'ETH',
    tokenName: 'Ethereum',
    icon: ImagesSrc.etherium,
    amount: '$3,177.94',
    percent: '+2.21%',
    tokenValue: `0`,
    network: 'Ethereum',
  },
  {
    type: 'Matic',
    tokenName: 'Matic',
    icon: ImagesSrc.matic,
    amount: '$387.41',
    percent: '+10.49%',
    tokenValue: '0',
    network: 'Polygon',
  },
  // {
  //   type: IsTestNet ? 'TNFT' : 'ALIA',
  //   tokenName: IsTestNet ? 'TNFT' : 'ALIA',
  //   icon: ImagesSrc.aliaNew,
  //   amount: '$387.41',
  //   percent: '+10.49%',
  //   tokenValue: '0',
  //   network: 'BSC',
  // },
  // {
  //   type: IsTestNet ? 'TAL' : 'ALIA',
  //   tokenName: IsTestNet ? 'TAL' : 'ALIA',
  //   icon: ImagesSrc.aliaNew,
  //   amount: '$387.41',
  //   percent: '+10.49%',
  //   tokenValue: '0',
  //   network: 'Polygon',
  // },
  {
    type: 'USDC',
    tokenName: 'USDC',
    icon: ImagesSrc.usdcNew,
    amount: '$387.41',
    percent: '+10.49%',
    tokenValue: '0',
    network: 'Polygon',
  },
  networkType == 'mainnet'
    ? {
      type: 'WETH',
      tokenName: 'WETH',
      icon: ImagesSrc.ethnew,
      amount: '$387.41',
      percent: '+10.49%',
      tokenValue: '0',
      network: 'Polygon',
    }
    : {},
  {
    type: 'BUSD',
    tokenName: 'BUSD',
    icon: ImagesSrc.busd,
    amount: '$387.41',
    percent: '+10.49%',
    tokenValue: '0',
    network: 'BSC',
  },
  {
    type: 'USDT',
    tokenName: 'USDT',
    icon: ImagesSrc.usdtNew,
    amount: '$3,177.94',
    percent: '+2.21%',
    tokenValue: `0`,
    network: 'Ethereum',
  },
  {
    type: 'XETA',
    tokenName: 'XETA',
    icon: ImagesSrc.xetaNew,
    amount: '$3,177.94',
    percent: '+2.21%',
    tokenValue: `0`,
    network: 'XANA CHAIN',
  },
];

//=========================== Process Scan Result Function =============================
export const processScanResult = (event, scanFor) => {
  return new Promise((resolve, reject) => {
    if (event && (event.type == 'QR_CODE' || event.type == 'org.iso.QRCode')) {
      if (event.data) {
        if (scanFor == SCAN_WALLET) {
          let walletAddress;
          let amount = '';
          if (event.data.includes(':')) {
            walletAddress = event.data.split(':')[1];
          } else if (event.data.includes(' ')) {
            let result = event.data.split(' ');
            walletAddress = result[0];
            amount = result[1];
          } else {
            walletAddress = event.data;
          }

          resolve({
            walletAddress,
            amount,
          });
        } else if (scanFor == SCAN_APP) {
          resolve(event.data);
        }
      } else {
        reject();
      }
    } else {
      reject();
    }
  });
};

//=========================== Export Object =============================
export { numFormatter };