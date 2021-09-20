import { networkType } from "../../networkType.js";

let add = "";
if (networkType === "testnet") {
  add = "0x0160b796792D38B98cd19f718F8dF6c143E5c529";
} else if (networkType === "mainnet") {
  add = "0x7d502C7D0DB1722453B841A118fb4204dCF0B036"; // main net
}

export default add;
