import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0xc1e7c213101b7f983203fc4bd8a740014C4d9f1f"; // test net
} else if (networkType === "mainnet") {
  add = "0xc1e7c213101b7f983203fc4bd8a740014C4d9f1f"; // main net
}

export default add;
