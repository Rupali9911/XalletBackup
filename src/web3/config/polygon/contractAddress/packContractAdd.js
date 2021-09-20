import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x773E9CF672c7c4B50C39856A057f5E6581418e3D";
} else if (networkType === "mainnet") {
  add = "0x7d502C7D0DB1722453B841A118fb4204dCF0B036"; // main net
}

export default add;
