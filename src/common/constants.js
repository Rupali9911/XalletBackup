import { networkType } from "./networkType.js";

let BASE_URL = "";
let PROVIDER_URL = "";
let NEW_BASE_URL = "";
let API_GATEWAY_URL = "";
let NEXT_PUBLIC_SOCKET_DOMAIN = ""

if (networkType === "mainnet") {
  BASE_URL = "https://api.xanalia.com";
  NEW_BASE_URL = "https://prod-backend.xanalia.com";
  PROVIDER_URL = "https://bsc-dataseed.binance.org/";
  API_GATEWAY_URL = "https://lamde1nmma.execute-api.eu-west-1.amazonaws.com/v1";
  NEXT_PUBLIC_SOCKET_DOMAIN = "https://socket.xanalia.com"
} else {
  BASE_URL = "https://testapi.xanalia.com";
  NEW_BASE_URL = "https://backend.xanalia.com";
  PROVIDER_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
  API_GATEWAY_URL = "https://lamde1nmma.execute-api.eu-west-1.amazonaws.com/v1";
  NEXT_PUBLIC_SOCKET_DOMAIN = "https://socket.xanalia.com"
}

// let API_GATEWAY_URL = 'https://lamde1nmma.execute-api.eu-west-1.amazonaws.com/v1'
// let API_GATEWAY_URL = 'https://hgvgnnifc3.execute-api.eu-west-1.amazonaws.com/v1'

const SIGN_MESSAGE =
  'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!';

export {
  BASE_URL,
  NEW_BASE_URL,
  PROVIDER_URL,
  API_GATEWAY_URL,
  NEXT_PUBLIC_SOCKET_DOMAIN,
  SIGN_MESSAGE
};