import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xC992d6755fe9b68271C8814Ea043AAf8Feee2A24'; // test net
} else if (networkType === 'mainnet') {
	add = '0xe3943e8EBA158A5616280c3Ba8295ebf8363d10F'; // main net
}

export default add;
