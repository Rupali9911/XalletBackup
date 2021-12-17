import ApproveAddUsdtEth from "../config/ethereum/contractAddress/marketAdd/ApproveAddUsdt";

import ApproveAddAliaBsc from "../config/binanceSmartChain/contractAddress/marketAdd/ApproveAddAlia";
import ApproveAddBusdBsc from "../config/binanceSmartChain/contractAddress/marketAdd/ApproveAddBusd";

import ApproveAddAliaPol from "../config/polygon/contractAddress/marketAdd/ApproveAddAlia";
import ApproveAddEthPol from "../config/polygon/contractAddress/marketAdd/ApproveAddEth";
import ApproveAddUsdcPol from "../config/polygon/contractAddress/marketAdd/ApproveAddUsdc";

export const basePriceTokens = [
  {
    key: "ETH",
    image:
      "https://th.bing.com/th?q=Free+Eth&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&adlt=moderate&t=1&mw=247",
    name: "ETH",
    chain: "ethereum",
    order: 1,
    chainCurrency: true,
    approvalRequired: false,
    dollarCurrency: false,
  },

  {
    key: "USDT",
    image:
      "https://th.bing.com/th/id/OIP.-lhSxJQlpVjM_jkiylN-4wAAAA?w=141&h=180&c=7&r=0&o=5&pid=1.7",
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
    image: "https://ik.imagekit.io/xanalia/Images/penguin-bottom-logo.svg",
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
    image:
      "https://th.bing.com/th/id/OIP.-lhSxJQlpVjM_jkiylN-4wAAAA?w=141&h=180&c=7&r=0&o=5&pid=1.7",
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
    image:
      "https://www.bing.com/th?id=OIP.joIRFGbuK3AsFH8pTSUnZgHaHa&w=204&h=204&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    name: "BNB",
    chain: "binance",
    order: 2,
    chainCurrency: true,
    approvalRequired: false,
    dollarCurrency: false,
  },

  {
    key: "ALIA",
    image: "https://ik.imagekit.io/xanalia/Images/penguin-bottom-logo.svg",
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
    image:
      "https://th.bing.com/th/id/OIP.-lhSxJQlpVjM_jkiylN-4wAAAA?w=141&h=180&c=7&r=0&o=5&pid=1.7",
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
    image:
      " https://th.bing.com/th?q=Free+Eth&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&adlt=moderate&t=1&mw=247",
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
    image:
      "https://th.bing.com/th/id/OIP.VoXPE2YF1_sBn3LXHO9SuAHaHa?w=182&h=181&c=7&r=0&o=5&pid=1.7",
    name: "MATIC",
    chain: "polygon",
    order: 3,
    chainCurrency: true,
    approvalRequired: false,
  },
];
