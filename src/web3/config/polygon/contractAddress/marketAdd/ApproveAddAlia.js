import { networkType } from "../../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x6275BD7102b14810C7Cfe69507C3916c7885911A"; // test net
} else if (networkType === "mainnet") {
  add = "0xe1a4af407A124777A4dB6bB461b6F256c1f8E341"; // main net
}

export default add;