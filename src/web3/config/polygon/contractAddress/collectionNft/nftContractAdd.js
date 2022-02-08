import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0x23c7903A8a61BA72fF239e7856A7D7e3447718B5'; // test net
} else if (networkType === 'mainnet') {
	add = '0x78125f157c9fEb198174eDF6ACFA7421b600a45F'; // main net
}

export default add;
