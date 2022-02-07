import { networkType } from "../../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x23a91170fA76141Ac09f126e8D56BD9896D1FD5c"; // test net
} else if (networkType === "mainnet") {
  add = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // main net
}

export default add;