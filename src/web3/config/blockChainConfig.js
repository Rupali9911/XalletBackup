import { networkType } from "./networkType";

//Binance Smart Chain
import MarketConAddBSC from "./binanceSmartChain/contractAddress/MarketContractAddress";
import MarketConAbiBSC from "./binanceSmartChain/abi/MarketPlaceAbi";
import MarketConApproveAbiBSC from "./binanceSmartChain/abi/marketAbi/ApproveAbi";
import MarketConApproveAddBSC from "./binanceSmartChain/contractAddress/marketAdd/ApproveAdd";

import LpConAddBSC from "./binanceSmartChain/contractAddress/LPTokenAdd";
import LpConAbiBSC from "./binanceSmartChain/abi/LpAbi";

import AliaConAddBSC from "./binanceSmartChain/contractAddress/AliaTokenAdd";
import AliaConAbiBSC from "./binanceSmartChain/abi/AliaAbi";

import AliaBnbConAddBSC from "./binanceSmartChain/contractAddress/aliaBNBReserveAdd";
import AliaBnbConAbiBSC from "./binanceSmartChain/abi/aliaBNBReserveAbi";

import StakingConAddBSC from "./binanceSmartChain/contractAddress/StakingContractAddTestNet";
import StakingConAbiBSC from "./binanceSmartChain/abi/StakingAbiTestNet";

import PancakeSwapConAddBSC from "./binanceSmartChain/contractAddress/pancakeSwapAdd";
import PancakeSwapConAbiBSC from "./binanceSmartChain/abi/panCakeSwapAbi";

import PackConAddBSC from "./binanceSmartChain/contractAddress/packContractAdd";
import PackConAbiBSC from "./binanceSmartChain/abi/packAbi";

import AwardConAddBSC from "./binanceSmartChain/contractAddress/AwardAdd";
import AwardConAbiBSC from "./binanceSmartChain/abi/AwardAbi";

//Polygon Chain
import MarketConAddPOL from "./polygon/contractAddress/MarketContractAddress";
import MarketConAbiPOL from "./polygon/abi/MarketPlaceAbi";
import MarketConApproveAbiPOL from "./polygon/abi/marketAbi/ApproveAbi";
import MarketConApproveAddPOL from "./polygon/contractAddress/marketAdd/ApproveAdd";

import LpConAddPOL from "./polygon/contractAddress/LPTokenAdd";
import LpConAbiPOL from "./polygon/abi/LpAbi";

import AliaConAddPOL from "./polygon/contractAddress/AliaTokenAdd";
import AliaConAbiPOL from "./polygon/abi/AliaAbi";

import AliaBnbConAddPOL from "./polygon/contractAddress/aliaBNBReserveAdd";
import AliaBnbConAbiPOL from "./polygon/abi/aliaBNBReserveAbi";

import StakingConAddPOL from "./polygon/contractAddress/StakingContractAddTestNet";
import StakingConAbiPOL from "./polygon/abi/StakingAbiTestNet";

import PancakeSwapConAddPOL from "./polygon/contractAddress/pancakeSwapAdd";
import PancakeSwapConAbiPOL from "./polygon/abi/panCakeSwapAbi";

import PackConAddPOL from "./polygon/contractAddress/packContractAdd";
import PackConAbiPOL from "./polygon/abi/packAbi";

import AwardConAddPOL from "./polygon/contractAddress/AwardAdd";
import AwardConAbiPOL from "./polygon/abi/AwardAbi";

const CDN_LINK =  'https://ik.imagekit.io/xanalia/Images';

export const blockChainConfig = [
  {
    name: "BinanceNtwk",
    key: "binance",
    image: `${CDN_LINK}/binance-chain.svg`,
    networkIdTestNet: networkType === "testnet" ? "97" : "56",
    networkIdMainNet: networkType === "testnet" ? "97" : "56",
    providerUrl:
      networkType === "testnet"
        ? "https://data-seed-prebsc-2-s1.binance.org:8545/"
        : "https://bsc-dataseed.binance.org/",
    providerUrlForAliaPrice: "https://bsc-dataseed.binance.org/",
    stakingConConfig: { add: StakingConAddBSC, abi: StakingConAbiBSC },
    marketConConfig: { add: MarketConAddBSC, abi: MarketConAbiBSC },
    marketApproveConConfig: {
      add: MarketConApproveAddBSC,
      abi: MarketConApproveAbiBSC,
    },
    lpConConfig: { add: LpConAddBSC, abi: LpConAbiBSC },
    aliaConConfig: { add: AliaConAddBSC, abi: AliaConAbiBSC },
    aliaBnbConConfig: { add: AliaBnbConAddBSC, abi: AliaBnbConAbiBSC },
    pancakeSwapConConfig: {
      add: PancakeSwapConAddBSC,
      abi: PancakeSwapConAbiBSC,
    },

    packConConfig: {
      add: PackConAddBSC,
      abi: PackConAbiBSC,
    },

    awardConConfig: {
      add: AwardConAddBSC,
      abi: AwardConAbiBSC,
    },
  },
  {
    name: "polygon",
    translationKey: "polygon",
    key: "polygon",
    image: `${CDN_LINK}/polygon-chain.png`,
    networkIdTestNet: networkType === "testnet" ? "80001" : "137",
    networkIdMainNet: networkType === "testnet" ? "80001" : "137",
    providerUrl:
      networkType === "testnet"
        ? "https://rpc-mumbai.maticvigil.com"
        : "https://polygon-mainnet.infura.io/v3/ce70617b31124974a29c2d7c79970142",
    providerUrlForAliaPrice:
      "https://polygon-mainnet.infura.io/v3/ce70617b31124974a29c2d7c79970142",
    stakingConConfig: { add: StakingConAddPOL, abi: StakingConAbiPOL },
    marketConConfig: { add: MarketConAddPOL, abi: MarketConAbiPOL },
    marketApproveConConfig: {
      add: MarketConApproveAddPOL,
      abi: MarketConApproveAbiPOL,
    },
    lpConConfig: { add: LpConAddPOL, abi: LpConAbiPOL },
    aliaConConfig: { add: AliaConAddPOL, abi: AliaConAbiPOL },
    aliaBnbConConfig: { add: AliaBnbConAddPOL, abi: AliaBnbConAbiPOL },
    pancakeSwapConConfig: {
      add: PancakeSwapConAddPOL,
      abi: PancakeSwapConAbiPOL,
    },

    packConConfig: {
      add: PackConAddPOL,
      abi: PackConAbiPOL,
    },

    awardConConfig: {
      add: AwardConAddPOL,
      abi: AwardConAbiPOL,
    },
  },
];
