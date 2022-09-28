import { networkType } from "../../../common/networkType";

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;
import Common from 'ethereumjs-common';

import {
    binanceNftAbi_new,
    binanceNftDex_new,
    environment,
    ethNftDex_new,
    maticNftDex_new,
    translate,
    lpAliaContractAbi,
    lpAliaContractAddr, networkChain
} from '../../../walletUtils';
import { blockChainConfig } from '../../../web3/config/blockChainConfig';
import { getChainId, getNetworkId } from '../../../web3/config/chainIds';
import { getWallet } from "../../../helpers/AxiosApiRequest";
import { alertWithSingleBtn } from "../../../utils";


const getGasPrice = async (rpcURL) => {
    const provider = new Web3(
        new Web3.providers.HttpProvider(
            rpcURL
        )
    );

    return provider.eth.getGasPrice()
}

const getGasLimit = async (data, rpcURL) => {
    console.log("🚀 ~ file: transactionFunctions.js ~ line 33 ~  ~ data, rpcURL", data, rpcURL)
    const provider = new Web3(
        new Web3.providers.HttpProvider(
            rpcURL
        )
    );

    return provider.eth.estimateGas(data)
}


const estimateGasTransactions = async (transaction, rpcURL) => {
    const data = {
        from: transaction.from,
        to: transaction.to,
        data: transaction.data,
        nonce: transaction.nonce,
    }
    if (transaction.value) {
        data.value = transaction.value
    }

    console.log("🚀 ~ file: transactionFunctions.js ~ line 50 ~  ~ transaction", transaction, data, rpcURL)

    const gasLimit = await getGasLimit(data, rpcURL)
    console.log("🚀 ~ file: transactionFunctions.js ~ line 56 ~  ~ gasLimit", gasLimit)

    const gasPrice = await getGasPrice(rpcURL)
    console.log("🚀 ~ file: transactionFunctions.js ~ line 56 ~ ~ gasPrice", gasPrice, gasPrice)

    return {
        gasLimit: Number(gasLimit),
        gasPrice: Number(gasPrice),
    }
}


export const sendCustomTransaction = async (transaction, publicKey, nftId, type) => {
    console.log('buyNft params 369', transaction, publicKey, nftId, type);
    return new Promise(async (resolve, reject) => {
        let rpcURL;
        let contractAddress;
        // let abiArray;
        const chainType = type?.toLowerCase()

        if (chainType === 'polygon') {
            rpcURL = blockChainConfig[1].providerUrl;
            // abiArray = blockChainConfig[1].marketConConfig.abi;
            contractAddress = blockChainConfig[1].marketConConfig.add;
        } else if (chainType === 'bsc') {
            rpcURL = blockChainConfig[0].providerUrl;
            // abiArray = blockChainConfig[0].marketConConfig.abi;
            contractAddress = blockChainConfig[0].marketConConfig.add;
        } else if (chainType === 'ethereum') {
            rpcURL = blockChainConfig[2].providerUrl;
            // abiArray = blockChainConfig[2].marketConConfig.abi;
            contractAddress = blockChainConfig[2].marketConConfig.add;
        } else {
            console.log('invalid chainType');
            reject('invalid chainType');
            return;
        }

        const data = {
            from: transaction.from,
            to: transaction.to,
            data: transaction.data,
            nonce: transaction.nonce,
        }
        if (transaction.value) {
            data.value = transaction.value
        }

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                rpcURL
            )
        );

        console.log("398 - buy nft web,3", web3)
        const txCount = await web3.eth.getTransactionCount(publicKey, "pending");
        console.log("🚀 ~ file: index.js ~ line 400 buyNFT ~ txCount", txCount)
        if (txCount.error) reject(txCount.error);
        let txObject;
        const { gasLimit, gasPrice } = await estimateGasTransactions(transaction, rpcURL)
        const { privateKey } = await getWallet();

        txObject = {
            from: publicKey,
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            chainId: chainType === "polygon" ? 80001 : undefined,
            to: contractAddress,
            value: "0x0",
            data: transaction?.data,
            nonce: web3.utils.toHex(txCount)
        };
        console.log("🚀 ~ file: transactionFunctions.js ~ line 113 ~ ~ txObject", txObject)

        let common = null;
        console.log("line 427 ~ buyNFT ~ common")
        if (chainType === 'bsc') {
            common = Common.forCustomChain('mainnet', {
                name: 'bnb',
                networkId: getNetworkId(chainType),
                chainId: getChainId(chainType)
            }, 'petersburg');
        } else if (chainType === 'polygon') {
            common = Common.forCustomChain('mainnet', {
                name: 'matic',
                networkId: getNetworkId(chainType),
                chainId: getChainId(chainType)
            }, 'petersburg');
        } else {
            common = Common.forCustomChain('mainnet', {
                name: 'eth',
                networkId: getNetworkId(chainType),
                chainId: getChainId(chainType)
            }, 'petersburg');
        }
        console.log("447 - common if-else", common)
        console.log('txObject', txObject);

        const tx = new EthereumTx(txObject, { common });

        console.log("🚀 ~ file: transactionFunctions.js ~ line 169 ~  ~ tx", tx)
        const privKey = Buffer.from(privateKey.substring(2, 66), 'hex');
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        console.log("🚀 ~ file: transactionFunctions.js ~ line 175 ~  ~ raw", raw)

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            console.log("🚀 ~ file: transactionFunctions.js ~ line 183 ~ ~ txHash", txHash)
            if (txHash) {
                console.log("460 - txHash", txHash)
                console.log("461 resp crypto function", new Date().getTime());
                // resolve({ success: true, status: 200, data: txHash });
            } else if (err) {
                console.log(err);
                reject(err.message);
            }
        }).once('receipt', (receipt) => {
            console.log("468 - receipt", receipt)
            resolve({ success: true, status: 200, data: receipt });
            console.log("470 - resolve")
        }).catch(e => {
            console.log("Catch 472", e)
            reject(e);
        })

        // console.log(result);
        // return result
    })
}

export const handleTransactionError = (error, translate) => {
    console.log("🚀 ~ file: transactionFunctions.js ~ line 192 ~ handleTransactionError ~ error", error)

    if (typeof error === 'string' && error.includes('transaction underpriced')) {
        alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.blanceLow'),
        );
    } else {
        alertWithSingleBtn(translate('common.error'), '');
    }
}
