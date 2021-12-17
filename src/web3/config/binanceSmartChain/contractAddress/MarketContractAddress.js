import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	// add = "0xe84B1bd201b9886edCDc8A79e9A70c1d8D5Ea1A8"; // test net
	// add = "0xc2F19E2be5c5a1AA7A998f44B759eb3360587ad1"; // test net
	add = '0xC992d6755fe9b68271C8814Ea043AAf8Feee2A24';
} else if (networkType === 'mainnet') {
	add = '0x4f23C2060fCaC2bA9BE1A4B8c96e7E1Cb646FF70'; // main net
}

export default add;
