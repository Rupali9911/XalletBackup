import { networkType } from "./networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x8D8108A9cFA5a669300074A602f36AF3252B7533"; // test net
} else if (networkType === "mainnet") {
  add = "0x13861c017735d3b2f0678a546948d67ad51ac07b"; // main net
}

export default add;