import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0x3d108C513489F18a7ef3994DE1D20bE17C5CbBCb';
} else if (networkType === 'mainnet') {
	add = '0x77FFb287573b46AbDdcEB7F2822588A847358933'; // main net
}

export default add;
