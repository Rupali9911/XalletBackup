import { networkType } from "../../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xd93e56Eb481D63b12b364adB8343c4b28623EebF"; // test net
} else if (networkType === "mainnet") {
  add = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"; // main net
}

export default add;