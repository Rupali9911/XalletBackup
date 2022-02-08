// // export default "0xeb1637Eb343EfAd52592A335F0D6af05D260754C"; // main net
// export default "0x2E1FDc2aC4D889A9b498F1815477f75287376b42" // test net

import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x2E1FDc2aC4D889A9b498F1815477f75287376b42"; // test net
} else if (networkType === "mainnet") {
  add = "0xeb1637Eb343EfAd52592A335F0D6af05D260754C"; // main net
}

export default add;
