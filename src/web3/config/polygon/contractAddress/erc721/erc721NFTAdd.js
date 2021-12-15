import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xB62a0f93AbcB0355A14A58954a580787bD425b75'; // test net
} else if (networkType === 'mainnet') {
	add = '0x2c3479B526394d9a5e18E2E454B9f8b1282930AC'; // main net
}

export default add;
