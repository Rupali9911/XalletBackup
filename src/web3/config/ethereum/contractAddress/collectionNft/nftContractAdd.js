import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xA8eaD3A41253ed856975877301Cae248fE9f5CB6'; // test net
} else if (networkType === 'mainnet') {
	add = '0x14bA2d8f8cf4EC67dee7b15743c281f42E4F94ce'; // main net
}

export default add;
