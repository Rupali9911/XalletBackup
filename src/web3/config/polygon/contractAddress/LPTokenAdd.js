// export default "0xD0F28392e4312EE4728a7624cdAe29305864ec8B" // test net
// export default "0xd9e8a84bb1cf583410bed19af437ddd057053d17"; //main net

import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xD0F28392e4312EE4728a7624cdAe29305864ec8B"; // test net
} else if (networkType === "mainnet") {
  add = "0x3581735ce4D03f65E57614f521383E50e1678D98"; // main net
}

export default add;
