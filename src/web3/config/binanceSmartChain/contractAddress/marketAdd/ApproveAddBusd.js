import { networkType } from "../../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee"; // test net
} else if (networkType === "mainnet") {
  add = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"; // main net
}

export default add;