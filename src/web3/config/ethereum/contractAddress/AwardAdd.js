import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x1F8343eb57adb31384A466658a542aA1BeBC941f"; // test net
} else if (networkType === "mainnet") {
  add = "0xf7BB4699d8D2A4776aDa515fA819220Be762C755"; // main net
}

export default add;
