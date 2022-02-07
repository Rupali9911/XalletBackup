import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xe39B0435017C62972d4D6733e805454D3c76259B"; // test net
} else if (networkType === "mainnet") {
  add = "0x13861c017735d3b2f0678a546948d67ad51ac07b"; // main net
}

export default add;
