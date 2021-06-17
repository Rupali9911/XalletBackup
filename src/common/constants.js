import { networkType } from "./networkType.js";

let BASE_URL = "";
let PROVIDER_URL = "";

if(networkType === "mainnet") {
  BASE_URL = "https://api.xanalia.com/xanalia";
  PROVIDER_URL = "https://bsc-dataseed.binance.org/";
} else {
  BASE_URL = "https://testapi.xanalia.com/xanalia";
  PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
}

export {
  BASE_URL,
  PROVIDER_URL
};