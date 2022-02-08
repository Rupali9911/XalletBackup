import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x313Df3fE7c83d927D633b9a75e8A9580F59ae79B";
} else if (networkType === "mainnet") {
  add = "0x66cB411f1544848119096D64c19A910b08a3694C"; // main net
}

export default add;
