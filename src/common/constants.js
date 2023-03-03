import {networkType} from './networkType.js';

let BASE_URL = '';
let PROVIDER_URL = '';
let NEW_BASE_URL = '';
let API_GATEWAY_URL = '';
let NEXT_PUBLIC_SOCKET_DOMAIN = '';
let NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY = '';
let XANALIA_WEB = '';
let CORPORATE_COLLAB_URL = '';
const GET_JPAUDIO_FROM_TEXT = 'https://test-ai.xanalia.com/japanese_text_to_speech/?id1=1&text='
const GET_ENAUDIO_FROM_TEXT = 'http://api.voicerss.org/?key=ac968af69f5d4ff9830083f708fcdfbe&hl=en-ca&v=Clara&src='

if (networkType === 'mainnet') {
  BASE_URL = 'https://api.xanalia.com';
  NEW_BASE_URL = 'https://prod-backend.xanalia.com';
  PROVIDER_URL = 'https://bsc-dataseed.binance.org/';
  API_GATEWAY_URL = 'https://hgvgnnifc3.execute-api.eu-west-1.amazonaws.com/v1';
  NEXT_PUBLIC_SOCKET_DOMAIN = 'https://prod-socket.xanalia.com';
  XANALIA_WEB = 'https://xanalia.com';
  //For Xanalia
  NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY = 'pk_live_DD8E7DF0413DBF3D';
  //Specific for Xallet
  // NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY = 'pk_live_EABDAA09882492C6';
  CORPORATE_COLLAB_URL = 'https://launchpad.xana.net/corporate_collaboration_t-shirts/minting/xanachain/'
} else {
  BASE_URL = 'https://testapi.xanalia.com';
  NEW_BASE_URL = 'https://backend.xanalia.com';
  PROVIDER_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';

  API_GATEWAY_URL = 'https://lamde1nmma.execute-api.eu-west-1.amazonaws.com/v1';
  NEXT_PUBLIC_SOCKET_DOMAIN = 'https://socket.xanalia.com';

  // API_GATEWAY_URL = 'https://jlvot2m1v8.execute-api.eu-west-1.amazonaws.com/v1';
  // NEXT_PUBLIC_SOCKET_DOMAIN = 'https://dev-socket.xanalia.com';

  XANALIA_WEB = 'https://frontend.xanalia.com';
  //For Xanalia
  NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY = 'pk_live_35B11F036089B82B';
  //Specific for Xallet
  // NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY = 'pk_live_1840F2D0EC9301CB';
  CORPORATE_COLLAB_URL = 'https://d3imy7ykcn2nsz.cloudfront.net/corporate_collaboration_t-shirts/minting/xanachain/0x326Cae76A11d85b5c76E9Eb81346eFa5e4ea7593'

}

// let API_GATEWAY_URL = 'https://lamde1nmma.execute-api.eu-west-1.amazonaws.com/v1'
// let API_GATEWAY_URL = 'https://hgvgnnifc3.execute-api.eu-west-1.amazonaws.com/v1'

const SIGN_MESSAGE =
  'Welcome. By signing this message you are verifying your digital identity. This is completely secure and does not cost anything!';

const CORPORATE_NAME = 'Corporate Collaboration® T-Shirts'

export {
  BASE_URL,
  NEW_BASE_URL,
  PROVIDER_URL,
  API_GATEWAY_URL,
  NEXT_PUBLIC_SOCKET_DOMAIN,
  SIGN_MESSAGE,
  NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY,
  XANALIA_WEB,
  CORPORATE_COLLAB_URL,
  CORPORATE_NAME,
  GET_ENAUDIO_FROM_TEXT,
  GET_JPAUDIO_FROM_TEXT
};
