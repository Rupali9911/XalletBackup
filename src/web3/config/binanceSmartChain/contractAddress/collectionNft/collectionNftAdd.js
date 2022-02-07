import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xC992d6755fe9b68271C8814Ea043AAf8Feee2A24'; // test net
} else if (networkType === 'mainnet') {
	add = '0x4f23C2060fCaC2bA9BE1A4B8c96e7E1Cb646FF70'; // main net
}

export default add;
