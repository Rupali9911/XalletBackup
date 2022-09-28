import { blockChainConfig } from "./blockChainConfig.js";
import { networkType } from "./networkType.js";

// let networkIdMainNet = "";


// export const providerUrlForAliaPrice = "https://bsc-dataseed.binance.org/"; // main net

export const getChainId = (type) => {
    const chainType = type?.toLowerCase()
    if (chainType == 'bsc') {
        return networkType == 'testnet' ? 97 : 56;
    } else if (chainType == 'polygon') {
        return networkType == 'testnet' ? 80001 : 137;
    } else {
        return networkType == 'testnet' ? 4 : 1;
    }
}

export const getNetworkId = (type) => {
    const chainType = type?.toLowerCase()
    if (chainType == 'bsc') {
        return networkType == 'testnet' ? blockChainConfig[0].networkIdTestNet : blockChainConfig[0].networkIdMainNet;
    } else if (chainType == 'polygon') {
        return networkType == 'testnet' ? blockChainConfig[1].networkIdTestNet : blockChainConfig[1].networkIdMainNet;
    } else {
        return networkType == 'testnet' ? blockChainConfig[2].networkIdTestNet : blockChainConfig[2].networkIdMainNet;
    }
}