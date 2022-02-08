import { networkType } from '../../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0xb5cA6731e91323e7223F82407ac8b1b84aC5B660'; // test net
} else if (networkType === 'mainnet') {
	add = '0xb567D9Abd7c7854463a0beFD2078Fe4c219aaF82'; // main net
	//  add = '0x2c3479B526394d9a5e18E2E454B9f8b1282930AC'; // main net old 
}

export default add;
