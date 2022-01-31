import ApproveAddUsdtEth from "../config/ethereum/contractAddress/marketAdd/ApproveAddUsdt";

import ApproveAddAliaBsc from "../config/binanceSmartChain/contractAddress/marketAdd/ApproveAddAlia";
import ApproveAddBusdBsc from "../config/binanceSmartChain/contractAddress/marketAdd/ApproveAddBusd";

import ApproveAddAliaPol from "../config/polygon/contractAddress/marketAdd/ApproveAddAlia";
import ApproveAddEthPol from "../config/polygon/contractAddress/marketAdd/ApproveAddEth";
import ApproveAddUsdcPol from "../config/polygon/contractAddress/marketAdd/ApproveAddUsdc";

export const basePriceTokens = [
  {
    key: "ETH",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/ETH.svg',
    name: "ETH",
    chain: "ethereum",
    order: 1,
    chainCurrency: true,
    approvalRequired: false,
    dollarCurrency: false,
  },

  {
    key: "USDT",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/USDT.svg',
    name: "USDT",
    chain: "ethereum",
    order: 0,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddUsdtEth,
    dollarCurrency: true,
  },
  {
    key: "ALIA",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/ALIA_currency.svg',
    name: "ALIA",
    chain: "binance",
    order: 0,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddAliaBsc,
    dollarCurrency: false,
  },
  {
    key: "BUSD",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/BUSD.svg',
    name: "BUSD",
    chain: "binance",
    order: 1,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddBusdBsc,
    dollarCurrency: true,
  },

  {
    key: "BNB",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/BNB.svg',
    name: "BNB",
    chain: "binance",
    order: 2,
    chainCurrency: true,
    approvalRequired: false,
    dollarCurrency: false,
  },

  {
    key: "ALIA",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/ALIA_currency.svg',
    name: "ALIA",
    chain: "polygon",
    order: 0,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddAliaPol,
    dollarCurrency: false,
  },
  {
    key: "USDC",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/USDC.svg',
    name: "USDC",
    chain: "polygon",
    order: 1,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddUsdcPol,
    dollarCurrency: true,
  },

  {
    key: "ETH",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/ETH%20Polygon.svg',
    name: "ETH",
    chain: "polygon",
    order: 2,
    chainCurrency: false,
    approvalRequired: true,
    approvalAdd: ApproveAddEthPol,
    dollarCurrency: false,
  },

  {
    key: "MATIC",
    image: 'https://ik.imagekit.io/xanalia/CollectionMainData/Matic.svg',
    name: "MATIC",
    chain: "polygon",
    order: 3,
    chainCurrency: true,
    approvalRequired: false,
  },
];
