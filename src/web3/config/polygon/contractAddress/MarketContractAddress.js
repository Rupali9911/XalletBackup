import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  // add = "0x23c7903A8a61BA72fF239e7856A7D7e3447718B5";
  add = '0x7dA522b18d3014a0484440576524487b7Ff84204'; // V2 Add test net
} else if (networkType === "mainnet") {
  add = "0x93D7B0C1d4aFaB3d71A7c68AaA3C405a9A9245fc"; // main net
}

export default add;
