import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x69A130D99cCc9F7267469E15922Ca9020001B120"; // test net
} else if (networkType === "mainnet") {
  add = "0x632e50418f15D01A81b259E691A1882353ecCcD8"; // main net
}

export default add;
