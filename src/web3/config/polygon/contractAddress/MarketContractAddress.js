import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xC84E3F06Ae0f2cf2CA782A1cd0F653663c99280d";
} else if (networkType === "mainnet") {
  add = "0xfE1a571eb3458d3aCf7d71bF0A78aC62DA537124"; // main net
}

export default add;
