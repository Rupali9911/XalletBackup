import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xB62a0f93AbcB0355A14A58954a580787bD425b75'; // test net
} else if (networkType === 'mainnet') {
	add = '0x54994ba4b4A42297B3B88E27185CDe1F51DcA288'; // main net
}

export default add;
