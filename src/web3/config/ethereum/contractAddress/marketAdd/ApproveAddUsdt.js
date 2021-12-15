import { networkType } from "../../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xd92e713d051c37ebb2561803a3b5fbabc4962431"; // test net
} else if (networkType === "mainnet") {
  add = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // main net
}

export default add;