import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xB62a0f93AbcB0355A14A58954a580787bD425b75'; // test net
} else if (networkType === 'mainnet') {
	add = '0x9b6b0B93161c0f2ec6aEdf20178c624ee1A88461'; // main net
}

export default add;
