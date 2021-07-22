import axios from 'axios';
import { PROVIDER_URL } from '../../common/constants';
import {
    convertHexToString,
    convertStringToNumber
} from '../../utils';
const rpcUrl = PROVIDER_URL;

export function payloadId() {
    const datePart = new Date().getTime() * Math.pow(10, 3);
    const extraPart = Math.floor(Math.random() * Math.pow(10, 3));
    const id = datePart + extraPart;
    return id;
}

export const rpcGetAccountBalance = async (address) => {
    const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: payloadId(),
        method: "eth_getBalance",
        params: [address, "latest"],
    });
    console.log(address);

    const balance = convertStringToNumber(convertHexToString(response.data.result));
    return balance;
};

export const rpcGetAccountNonce = async (address) => {
    const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: payloadId(),
        method: "eth_getTransactionCount",
        params: [address, "pending"],
    });

    const nonce = convertStringToNumber(convertHexToString(response.data.result));
    return nonce;
}

export const rpcCallTransaction = async (tx) => {
    const response = await axios.post(rpcUrl, {
        jsonrpc: "2.0",
        id: payloadId(),
        method: "eth_sendTransaction",
        params: [tx, "latest"],
    });

    const nonce = convertStringToNumber(convertHexToString(response.data.result));
    return nonce;
}