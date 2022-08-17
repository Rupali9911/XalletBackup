import { networkType } from "./networkType.js";

let BASE_URL = "";
let PROVIDER_URL = "";
let NEW_BASE_URL = "";

if (networkType === "mainnet") {
  BASE_URL = "https://api.xanalia.com";
  NEW_BASE_URL = "https://prod-backend.xanalia.com";
  PROVIDER_URL = "https://bsc-dataseed.binance.org/";
} else {
  BASE_URL = "https://testapi.xanalia.com";
  NEW_BASE_URL = "https://backend.xanalia.com";
  PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
}

export {
  BASE_URL,
  NEW_BASE_URL,
  PROVIDER_URL
};