import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xe230E414f3AC65854772cF24C061776A58893aC2"; // test net
} else if (networkType === "mainnet") {
  add = "0x1B96B92314C44b159149f7E0303511fB2Fc4774f"; // main net
}

export default add;

