import { blockChainConfig } from "../config/blockChainConfig";
import { toast } from "react-toastify";

const selectedNetworkChain =
  blockChainConfig[
  typeof window !== "undefined" && sessionStorage.getItem("selectedBlockChain")
    ? sessionStorage.getItem("selectedBlockChain")
    : 0
  ];

export const setupNetwork = async (
  chain,
  name,
  currency,
  symbol,
  providerUrl,
  explorerURL
) => {
  const provider = typeof window !== "undefined" && window.ethereum;
  if (provider) {
    const chainId = parseInt(chain, 10);
    try {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: name,
            nativeCurrency: {
              name: currency,
              symbol: symbol,
              decimals: 18,
            },
            rpcUrls: [providerUrl],
            blockExplorerUrls: [explorerURL],
          },
        ],
      });
      if (typeof window !== "undefined" && window.ethereum.networkVersion === chain) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

// export const checkAvailabilityOnChain = async (
//   nftChain,
//   formatMessage,
//   changeChain = false
// ) => {
//   let condition = false;
//   let ethereum = window.ethereum;
//   let chainIndex = 0;
//   if (
//     ethereum &&
//     ethereum.networkVersion &&
//     localStorage.getItem("connectedWith") === "metamask"
//   ) {
//     let chainIdNFT = "";
//     for (let i = 0; i < blockChainConfig.length; i++) {
//       if (blockChainConfig[i].key === nftChain) {
//         chainIdNFT = blockChainConfig[i].networkIdMainNet;
//         chainIndex = i;
//         break;
//       }
//     }
//     if (ethereum.networkVersion.toString() !== chainIdNFT) {
//       condition = true;
//     }
//   } else {
//     if (nftChain !== selectedNetworkChain.key) {
//       condition = true;
//     }
//   }
//   if (condition && !localStorage.getItem("userAuth")) {
//     if (
//       ethereum &&
//       ethereum.networkVersion &&
//       localStorage.getItem("connectedWith") === "metamask" &&
//       changeChain
//     ) {
//       await setupNetwork(
//         blockChainConfig[chainIndex].networkIdMainNet,
//         blockChainConfig[chainIndex].walletName,
//         blockChainConfig[chainIndex].currency,
//         blockChainConfig[chainIndex].symbol,
//         blockChainConfig[chainIndex].providerUrl,
//         blockChainConfig[chainIndex].explorerURL
//       );

//       ethereum.on("chainChanged", (_chainId) => {
//         let chainIdNFT = "";
//         let chainIndex = 0;
//         for (let i = 0; i < blockChainConfig.length; i++) {
//           if (blockChainConfig[i].key === nftChain) {
//             chainIdNFT = blockChainConfig[i].networkIdMainNet;
//             break;
//           }
//         }
//         if (chainIdNFT === parseInt(_chainId, 16).toString()) {
//           localStorage.setItem("selectedBlockChain", chainIndex);
//           window.location.reload();
//           return true;
//         } else {
//           return false;
//         }
//       });
//       return false;
//     } else {
//       toast.info(formatMessage({ id: "NFTBlockchain." }), {
//         position: "bottom-right",
//         autoClose: 3000,
//         progress: undefined,
//       });
//       return false;
//     }
//   }
//   return true;
// };

export const checkAvailabilityOnChain = async (
  nftChain,
  formatMessage,
  changeChain = false
) => {
  let condition = false;
  let ethereum = typeof window !== "undefined" && window.ethereum;
  let chainIndex = 0;
  if (
    ethereum &&
    ethereum.networkVersion &&
    localStorage.getItem("connectedWith") === "metamask"
  ) {
    let chainIdNFT = "";
    for (let i = 0; i < blockChainConfig.length; i++) {
      if (blockChainConfig[i].key === nftChain) {
        chainIdNFT = blockChainConfig[i].networkIdMainNet;
        chainIndex = i;
        break;
      }
    }
    if (ethereum.networkVersion.toString() !== chainIdNFT) {
      condition = true;
    }
  } else {
    if (nftChain !== selectedNetworkChain.key) {
      condition = true;
    }
  }
  if (condition && !localStorage.getItem("userAuth")) {
    // if (
    //   ethereum &&
    //   ethereum.networkVersion &&
    //   localStorage.getItem("connectedWith") === "metamask"
    // ) {
    toast.info(formatMessage({ id: "NFTBlockchain." }), {
      position: "bottom-right",
      autoClose: 3000,
      progress: undefined,
    });
    return false;
    // }
  }
  return true;
};
