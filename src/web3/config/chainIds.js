import { blockChainConfig } from "./blockChainConfig.js";
import { networkType } from "./networkType.js";

// let networkIdMainNet = "";
// let networkIdTestNet = "";
// let url = "";

// if (networkType === "testnet") {
//   networkIdMainNet = "97";
//   networkIdTestNet = "97";
//   url = "https://data-seed-prebsc-1-s1.binance.org:8545"; //test net
// } else if (networkType === "mainnet") {
//   networkIdMainNet = "56";
//   networkIdTestNet = "56";
//   url = "https://bsc-dataseed.binance.org/"; // main net
// }

// export const binanceTestNet = networkIdTestNet;
// export const binanceMainNet = networkIdMainNet;
// export const providerUrl = url;

// export const providerUrlForAliaPrice = "https://bsc-dataseed.binance.org/"; // main net

export const getChainId = (chainType) => {
    if(chainType == 'binance'){
        return networkType == 'testnet' ? 97 : 56;
    }else if(chainType == 'polygon'){
        return networkType == 'testnet' ? 80001 : 137;
    }else {
        return networkType == 'testnet' ? 4 : 1;
    }
}

export const getNetworkId = (chainType) => {
    if(chainType == 'binance'){
        return networkType == 'testnet' ? blockChainConfig[0].networkIdTestNet : blockChainConfig[0].networkIdMainNet;
    }else if(chainType == 'polygon'){
        return networkType == 'testnet' ? blockChainConfig[1].networkIdTestNet : blockChainConfig[1].networkIdMainNet;
    }else {
        return networkType == 'testnet' ? blockChainConfig[2].networkIdTestNet : blockChainConfig[2].networkIdMainNet;
    }
}