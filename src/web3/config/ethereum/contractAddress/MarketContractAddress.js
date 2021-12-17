import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	add = '0x9D6014a625eda5EFed370fde7BC4885B8370c4bd';
	// add = '0xbbb92a5228967fb29206df8c5410586783aa4e76';
} else if (networkType === 'mainnet') {
	add = '0x9d5dc3cc15E5618434A2737DBF76158C59CA1e65'; // main net
}

export default add;
