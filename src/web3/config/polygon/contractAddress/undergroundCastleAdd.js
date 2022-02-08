import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x3aaE59624e796624477541A9657d874F3D620Be9"; // test net
} else if (networkType === "mainnet") {
  add = "0x9C051DB337f894f88793f4927655368d0dB5eE27"; // main net
}

export default add;
