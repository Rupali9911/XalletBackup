import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x52826ee949d3e1C3908F288B74b98742b262f3f1"; // test net
} else if (networkType === "mainnet") {
  add = "0xD9E8a84Bb1CF583410bEd19af437DdD057053d17"; // main net
}

export default add;
