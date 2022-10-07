import { networkType } from '../../networkType.js';

let add = '';
if (networkType === 'testnet') {
	// add = '0x9D6014a625eda5EFed370fde7BC4885B8370c4bd';
	add = '0x135aF68D7B40b1501A1395d393ebeFC2aE7d4a7B'; // V2 Add test net
} else if (networkType === 'mainnet') {
	add = '0x9d5dc3cc15E5618434A2737DBF76158C59CA1e65'; // main net
}

export default add;
