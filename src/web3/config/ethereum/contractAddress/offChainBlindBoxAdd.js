import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xbe421d44688c870bc7f92d816a55a52b41e0ffe9';
} else if (networkType === 'mainnet') {
	add = '0xbe421d44688c870bc7f92d816a55a52b41e0ffe9'; // main net
}

export default add;
