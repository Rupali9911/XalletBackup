import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xbe421d44688c870bc7f92d816a55a52b41e0ffe9';
} else if (networkType === 'mainnet') {
	add = '0x913d90bf7e4A2B1Ae54Bd5179cDE2e7cE712214A'; // main net
}

export default add;
