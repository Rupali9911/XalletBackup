import {networkType} from "../../../common/networkType";

const Web3 = require('web3');


var Accounts = require('web3-eth-accounts');
const EthereumTx = require('ethereumjs-tx').Transaction;
// import Common, {Chain} from '@ethereumjs/common'
import Common from 'ethereumjs-common';

import {Transaction} from '@ethereumjs/tx'
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
import {blockChainConfig} from '../../../web3/config/blockChainConfig';
import {getChainId, getNetworkId} from '../../../web3/config/chainIds';
import {useState} from "react";

export const getSig = (message, privateKey) => {
    var accounts = new Accounts("");
    let wlt = accounts.privateKeyToAccount(privateKey);
    let sigMsg = wlt.sign(message, privateKey);
    return sigMsg.signature;
}

export const filterTransaction = (pubKey, trx) => {
    if (trx == null) return null;

    if (trx.from == pubKey) {
        return trx;
    } else if (trx.to == pubKey) {
        return trx;
    }
    return null;
}

export const watchBnBBalance = () => {
    var add = "wss://data-seed-prebsc-2-s1.binance.org:8545/";
    var web3 = new Web3(new Web3.providers.WebsocketProvider(add));
    getBlockheaders(web3);
}

async function getBlockheaders(web3) {
    await web3.eth.subscribe('newBlockHeaders', async function (error, event) {
        console.log(error)
    })
        .on('data', async (log) => {
            console.log("Data", log)
        })
        .on('changed', async (log) => {
            console.log(`Changed: ${log}`)
        })
        .on('error', (log) => {
            console.log(`error:  ${log}`)
        })
}

export const watchBalanceUpdate = (updateBalance, type) => {

    let webSocketLink;
    let rpcUrl;

    if (type == 'eth') {
        webSocketLink = environment.wsEth;
        rpcUrl = environment.ethRpc;
    } else if (type == 'bsc') {
        webSocketLink = environment.wsBsc;
        rpcUrl = environment.bnbRpc;
    } else if (type == 'polygon') {
        webSocketLink = environment.wsPolygon;
        rpcUrl = environment.polRpc;
    }

    console.log('webSocketLink', webSocketLink);
    var web3 = new Web3(new Web3.providers.WebsocketProvider(webSocketLink));
    const subscribe = web3.eth.subscribe('newBlockHeaders', (error, result) => {
        if (error) console.log('watchBalanceUpdate', error)
    }).on("connected", function (subscriptionId) {
        console.log("connected", subscriptionId);
    })
        .on("data", function (log) {
            // console.log("data",log);
            updateBalance && updateBalance();
        })
        .on("changed", function (log) {
            console.log("changed", log);
            updateBalance && updateBalance();
        });

    return subscribe;
}

export const watchAllTransactions = (pubKey) => {
    var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a'));
    const subscribe = web3.eth.subscribe('logs', {fromBlock: 0, address: pubKey}, (error, result) => {
        if (error) console.log('watchAllTransactions', error)
    }).on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
        .on("data", function (log) {
            console.log(log);
        })
        .on("changed", function (log) {
            console.log(log);
        });

    return subscribe;
}

export const watchEtherTransfers = (pubKey, type, addToList) => {

    let webSocketLink;
    let rpcUrl;

    if (type == 'eth') {
        webSocketLink = "wss://kovan.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a";
        rpcUrl = environment.ethRpc;
    } else if (type == 'bnb') {
        webSocketLink = "wss://data-seed-prebsc-2-s1.binance.org:8545/";
        rpcUrl = environment.bnbRpc;
    } else if (type == 'matic') {
        webSocketLink = "wss://ws-matic-mumbai.chainstacklabs.com/";
        rpcUrl = environment.polRpc;
    }

    // Instantiate web3 with WebSocket provider
    const web3 = new Web3(new Web3.providers.WebsocketProvider(webSocketLink))

    // Instantiate subscription object
    const subscription = web3.eth.subscribe('pendingTransactions')

    // Subscribe to pending transactions
    subscription.subscribe((error, result) => {
        if (error) console.log('subscription', error)
    })
        .on('data', async (txHash) => {
            try {
                // Instantiate web3 with HttpProvider
                const web3Http = new Web3(rpcUrl)

                // Get transaction details
                const trx = await web3Http.eth.getTransaction(txHash)

                // const valid = validateTransaction(trx)
                // // If transaction is not valid, simply return
                // if (!valid) return
                let transaction = filterTransaction(pubKey, trx);

                if (transaction !== null) {
                    console.log('trx', trx);
                    addToList && addToList(transaction);
                }

                // console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
                // console.log('Transaction value is: ' + process.env.AMOUNT)
                // console.log('Transaction hash is: ' + txHash + '\n')

                // Initiate transaction confirmation
                // confirmEtherTransaction(txHash)

                // Unsubscribe from pending transactions.
                // subscription.unsubscribe()
            } catch (error) {
                console.log(error)
            }
        });
    return subscription;
}

export const currencyInDollar = async (pubkey, type) => {
    let rpcUrl = ''
    let nftDex = ''
    let nftAbi = ''
    let key = pubkey

    switch (type) {
        case "BSC":
            rpcUrl = 'https://bsc-dataseed.binance.org/'
            nftDex = binanceNftDex_new
            break;

        case "ALIA":
            rpcUrl = 'https://bsc-dataseed.binance.org/'
            nftDex = lpAliaContractAddr
            nftAbi = lpAliaContractAbi
            break;

        case "ETH":
            rpcUrl = 'https://mainnet.infura.io/v3/e2fddb9deb984ba0b9e9daa116d1702a'
            nftDex = ethNftDex_new
            break;

        case "Polygon":
            rpcUrl = 'https://rpc-mainnet.matic.quiknode.pro/'
            nftDex = maticNftDex_new
            break;
    }

    nftAbi = nftAbi ? nftAbi : binanceNftAbi_new;

    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
        const contract = new web3.eth.Contract(nftAbi, nftDex, {from: key})
        if (contract) {
            if (type === 'BSC') {
                await contract?.methods?.getReserves()?.call().then(function (info) {
                    if (info == null) {
                        return resolve(1);
                    }
                    var bnbLpReserve = info[0].toString();
                    var busdLpReserve = info[1].toString();
                    var bnbPriceInner = busdLpReserve / bnbLpReserve;
                    console.log('bnbPriceInner', bnbPriceInner)
                    resolve(bnbPriceInner);
                })
            } else if (type === 'ALIA') {
                await contract?.methods?.getReserves()?.call().then(function (info) {
                    var aliaReserve = info[0].toString();
                    var BNBReserve = info[1].toString();
                    var newbnbPerAlia = aliaReserve / BNBReserve;
                    console.log('newbnbPerAlia', newbnbPerAlia)
                    resolve(newbnbPerAlia);
                })
            } else {
                await contract.methods.getReserves().call().then(function (info) {
                    maticQuickReserve = web3.utils.fromWei(info._reserve0.toString(), "ether");
                    aliaQuickReserve = web3.utils.fromWei(info._reserve1.toString(), "mwei");
                    console.log('maticQuickReserve and aliaQuickReserve', maticQuickReserve, aliaQuickReserve)
                    resolve(parseFloat(aliaQuickReserve) / parseFloat(maticQuickReserve));
                })
            }
        } else {
            reject({success: false, data: 'Smart contract not deployed to detected network.'});
        }
    })
}

// export const balance = async (pubKey, contractAddr, contractAbi, rpc, type) => {
//   // console.log('pubKey, contractAddr, contractAbi, rpc, type', pubKey, contractAddr, contractAbi, rpc, type)
//   //  console.log('pubKey', pubKey)
//   return new Promise(async (resolve, reject) => {
//       const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
//       if (contractAddr) {
//           const contract = new web3.eth.Contract(contractAbi, contractAddr);
//           let reserves = {};
//           await contract.methods.balanceOf(pubKey).call().then(function (result) {
//               console.log('Results from balance of', result)
//               if (type == 'usdc') {
//                   // resolve(web3.utils.fromWei(result.toString(), "ether"));
//                   resolve(web3.utils.fromWei(result.toString(), "mwei"));
//               } else if (type == 'alia') {
//                   resolve(web3.utils.fromWei(result.toString(), "ether"));
//               } else if (type == 'usdt') {
//                   resolve(web3.utils.fromWei(result.toString(), 'ether') * 1e12);
//               } else if (type == 'busd') {
//                   resolve(web3.utils.fromWei(result.toString(), "ether"));
//               } else if (type == 'weth') {
//                   resolve(web3.utils.fromWei(result.toString(), 'ether'));
//               }
//           }).catch(function (error) {
//               console.log(error + ' is the error');
//               reject(error);
//           })
//       } else {
//           await web3.eth.getBalance(pubKey, function (error, ethbalance) {
//               console.log('ETH BALANCE', ethbalance)
//               if (error) {
//                   reject(error);
// //>>>>>>> ce88bf819e0785f28bfcaf86baf49f7f4ff833c4
//               } else {
//                   reject({success: false, data: 'Smart contract not deployed to detected network.'});
//               }
//           })
//       }
//   })
// }

export const balance = async (pubKey, contractAddr, contractAbi, rpc, type) => {
     console.log('pubKey, contractAddr, contractAbi, rpc, type', pubKey, contractAddr, contractAbi, rpc, type)
    //  console.log('pubKey', pubKey)

    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
        if (contractAddr) {
            const contract = new web3.eth.Contract(contractAbi, contractAddr);
            let reserves = {};
            await contract.methods.balanceOf(pubKey).call().then(function (result) {
                console.log('Results from balance of', result)
                if (type == 'usdc') {
                    // resolve(web3.utils.fromWei(result.toString(), "ether"));
                    resolve(web3.utils.fromWei(result.toString(), "mwei"));
                } else if (type == 'alia') {
                    resolve(web3.utils.fromWei(result.toString(), "ether"));
                } else if (type == 'usdt') {
                    resolve(web3.utils.fromWei(result.toString(), 'ether') * 1e12);
                } else if (type == 'busd') {
                    resolve(web3.utils.fromWei(result.toString(), "ether"));
                } else if (type == 'weth') {
                    resolve(web3.utils.fromWei(result.toString(), 'ether') * 1e10);
                }
            }).catch(function (error) {
                console.log(error + ' is the error');
                reject(error);
            })
        } else {
            await web3.eth.getBalance(pubKey, function (error, ethbalance) {
                console.log('ETH BALANCE', ethbalance)
                if (error) {
                    reject(error);
                } else {
                    resolve(web3.utils.fromWei(ethbalance.toString(10), 'ether'));
                }
            })
        }
    })
}

export const transfer = (pubkey, privkey, amount, toAddress, type,chainType, contractAddr, contractAbi, rpc, gasPr, gasLmt) => {
    console.log('params_________', pubkey, privkey, amount, toAddress,type,chainType, contractAddr, contractAbi, rpc, gasPr, gasLmt)
    return new Promise(async (resolve, reject) => {

        const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
        try {
            const privKey = Buffer.from(privkey.substring(2, 66), 'hex');
            const txCount = await web3.eth.getTransactionCount(pubkey, 'pending');
            if (txCount.error)
                reject({success: false, msg: txCount.error});
            var customGasPrice = gasPr * 1000000000;
            var contract;
            if (contractAddr) {
                contract = new web3.eth.Contract(contractAbi, contractAddr, {from: pubkey});
            }
            var amountToSend = web3.utils.toWei(amount.toString(), 'ether');
            // HERE
            console.log("Custom gas price===>", customGasPrice)
            console.log("Custom gas price===>", web3.utils.toHex(customGasPrice))
            console.log(" gas lmt price===>", web3.utils.toHex(gasLmt))

            const txObject = {
                //nonce: web3.utils.toHex(txCount),
                from: pubkey,
                gasPrice: web3.utils.toHex(customGasPrice),
                gasLimit: web3.utils.toHex(gasLmt),

                to: toAddress,
                value: "0x0",
                // data: chainType == "binance" ? contract.methods
                //     .createCategory(name, title, desc, image, price, usdprice, countNft, detailHash, revenueAddress)
                //     .encodeABI() : contract.methods
                //     .createCategory(name, title, desc, image, price, usdprice, countNft, detailHash)
                //     .encodeABI(),
                nonce: web3.utils.toHex(txCount)
            }

            let common;

            if (type == 'usdt' || type == 'usdc') {

                txObject.value = "0x0";
                txObject.to = contractAddr;

                var convertto6decimal = parseFloat(amount).toFixed(6) * 1e6;
                txObject.data = contract.methods.transfer(toAddress, convertto6decimal).encodeABI();
                if (type == 'usdc') {
                    txObject.chainId = getChainId(chainType);
                    txObject.networkId = getNetworkId(chainType);
                    common = Common.forCustomChain('mainnet', {
                        name: 'matic',
                        networkId: getNetworkId(chainType),
                        chainId: getChainId(chainType)
                    }, 'petersburg');
                }
                if (type == 'usdt') {
                    txObject.chainId = getChainId(chainType);
                    txObject.networkId = getNetworkId(chainType);
                    common = Common.forCustomChain('mainnet', {
                        name: 'ethereum',
                        networkId: getNetworkId(chainType),
                        chainId: getChainId(chainType)
                    }, 'petersburg');
                }

            } else if (type == 'matic') {
                txObject.to = toAddress
                txObject.networkId = getNetworkId(chainType);
                txObject.chainId = getChainId(chainType);
                txObject.value = web3.utils.toHex(amountToSend)
                common = Common.forCustomChain('mainnet', {
                    name: 'matic',
                    networkId: getNetworkId(chainType),
                    chainId: getChainId(chainType)
                }, 'petersburg');

            } else if (type === 'busd') {
                var amountToSendAlia = web3.utils.toWei(amount.toString(), 'ether');
                amountToSendAlia = web3.utils.toHex(amountToSendAlia);
                txObject.value = "0x0";
                txObject.data = contract.methods.transfer(toAddress, amountToSendAlia).encodeABI();
                txObject.to = contractAddr;
                common = Common.forCustomChain('mainnet', {
                    name: 'bnb',
                    networkId: getNetworkId(chainType),
                    chainId: getChainId(chainType)
                }, 'petersburg');

            } else if (type === 'tnft'|| type==='alia'&& chainType==="binance") {
                var amountToSendAlia = web3.utils.toWei(amount.toString(), 'ether');
                amountToSendAlia = web3.utils.toHex(amountToSendAlia);
                txObject.value = "0x0";

                txObject.data = contract.methods.transfer(toAddress, amountToSendAlia).encodeABI();
                txObject.to = contractAddr;
                txObject.gasPrice = web3.utils.toHex(35000000000)
                common = Common.forCustomChain('mainnet', {
                    name: 'bnb',
                    networkId: getNetworkId(chainType),
                    chainId: getChainId(chainType)
                }, 'petersburg');
            } else if (type === 'tal'|| type==='alia'&& chainType==="polygon") {
                var amountToSendAlia = web3.utils.toWei(amount.toString(), 'ether');
                amountToSendAlia = web3.utils.toHex(amountToSendAlia);
                txObject.value = "0x0";
                txObject.data = contract.methods.transfer(toAddress, amountToSendAlia).encodeABI();
                txObject.to = contractAddr;
                txObject.gasPrice = web3.utils.toHex(35000000000)
                common = Common.forCustomChain('mainnet', {
                    name: 'matic',
                    networkId: getNetworkId(chainType),
                    chainId: getChainId(chainType)
                }, 'petersburg');
            } else if (type == 'bnb') {
                txObject.to = toAddress
                txObject.value = web3.utils.toHex(amountToSend)
                txObject.networkId = getNetworkId(chainType);
                txObject.chainId = getChainId(chainType);
                common = Common.forCustomChain('mainnet', {
                    name: 'bnb',
                    networkId: getNetworkId(chainType),
                    chainId: getChainId(chainType)
                }, 'petersburg');
            } else if (type == 'eth' ||type == 'weth') {
                txObject.to = toAddress
                txObject.networkId = getNetworkId(chainType);
                txObject.chainId = getChainId(chainType);
                txObject.value = web3.utils.toHex(amountToSend)

                if (chainType === "ethereum") {
                    common = Common.forCustomChain('mainnet', {
                        name: 'ethereum',
                        networkId: getNetworkId(chainType),
                        chainId: getChainId(chainType)
                    }, 'petersburg');
                    console.log("ETHEREUM ETH CAllED")
                }
                if(chainType==="polygon"){
                    common = Common.forCustomChain('mainnet', {
                        name: 'matic',
                        networkId: getNetworkId(chainType),
                        chainId: getChainId(chainType)
                    }, 'petersburg');
                    console.log("POLYGON WETH CAllED",chainType)
                }
            }

            const tx = new EthereumTx(txObject, {common})
            // const tx =new EthereumTx(txObject, type == 'eth' ? {chain: 'kovan'}:{common} );
            // const common = new Common({ chain: Chain.Ropsten });
            // const tx = Transaction.fromTxData(txObject, {common});

            tx.sign(privKey);
            console.log('tx', tx);
            const serializedTx = tx.serialize()

            console.log('serializedTx', serializedTx);
            const raw = '0x' + serializedTx.toString('hex')
            await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
                if (txHash) {
                    console.log(txHash)

                    resolve({success: true, data: txHash});

                    return;
                } else if (err && err.message) {
                    console.log(err);
                    reject({success: false, msg: translate("wallet.common.failed")});
                } else {
                    reject({success: false, msg: translate("wallet.common.errorCode754"), error_code: 754});
                }
            })
        } catch (err) {
            console.log(err);
            reject({success: false, msg: err.message});
        }
    })
}

export const buyNft = async (publicKey, privKey, nftId, chainType, gasPr, gasLmt, collectionAddress, order) => {
    console.log('buyNft params 369', publicKey, privKey, nftId, chainType, gasPr, gasLmt);
    return new Promise(async (resolve, reject) => {
        console.log('chainType', chainType);
        let rpcURL;
        let contractAddress;
        let abiArray;
        if (chainType === 'polygon') {
            rpcURL = blockChainConfig[1].providerUrl;
            abiArray = blockChainConfig[1].marketConConfig.abi;
            contractAddress = blockChainConfig[1].marketConConfig.add;
        } else if (chainType === 'binance') {
            rpcURL = blockChainConfig[0].providerUrl;
            abiArray = blockChainConfig[0].marketConConfig.abi;
            contractAddress = blockChainConfig[0].marketConConfig.add;
        } else if (chainType === 'ethereum') {
            rpcURL = blockChainConfig[2].providerUrl;
            abiArray = blockChainConfig[2].marketConConfig.abi;
            contractAddress = blockChainConfig[2].marketConConfig.add;
        } else {
            console.log('invalid chainType');
            reject('invalid chainType');
            return;
        }
        console.log("392 - buy nft if-else", rpcURL, abiArray, contractAddress)
        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                rpcURL
            )
        );
        console.log("398 - buy nft web,3", web3)
        const txCount = await web3.eth.getTransactionCount(publicKey, "pending");
        console.log("🚀 ~ file: index.js ~ line 400 buyNFT ~ txCount", txCount)
        if (txCount.error) reject(txCount.error);
        var customGasLimit = gasLmt;
        customGasPrice = gasPr * 1000000000;
        // const contractAddress = chainType === "polygon" ? blockChainConfig[1].marketConConfig.add : binanceNftDex;
        // const abiArray = chainType === "polygon" ? environment.polygonNftAbi : binanceNftAbi;
        console.log('406 - contractAddress', contractAddress);
        var contract = new web3.eth.Contract(abiArray, contractAddress, {
            from: publicKey
        });
        // console.log('contract',contract);
        let txObject;
        // HERE
        txObject = {
            from: publicKey,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            chainId: chainType === "polygon" ? 80001 : undefined,
            to: contractAddress,
            value: "0x0",
            data: contract.methods
                .buyNFT(collectionAddress, nftId, "", order)
                .encodeABI(),
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        console.log("line 427 ~ buyNFT ~ common")
        if (chainType === 'binance') {
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
        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        // const result = await web3.eth.sendSignedTransaction(
        //     raw
        // );

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
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
            resolve({success: true, status: 200, data: receipt});
            console.log("470 - resolve")
        }).catch(e => {
            console.log("Catch 472", e)
            reject(e);
        })

        // console.log(result);
        // return result
    })
}

export const buyNftBnb = async (publicKey, privKey, nftId, chainType, gasPr, gasLmt, collectionAddress, addedFivePercent) => {
    console.log('params', publicKey, privKey, nftId, chainType, gasPr, gasLmt, collectionAddress, addedFivePercent);
    return new Promise(async (resolve, reject) => {
        console.log('chainType', chainType);
        let rpcURL;
        let abiArray;
        let contractAddress;
        if (chainType === 'polygon') {
            rpcURL = blockChainConfig[1].providerUrl;
            abiArray = blockChainConfig[1].marketConConfig.abi;
            contractAddress = blockChainConfig[1].marketConConfig.add;
        } else if (chainType === 'binance') {
            rpcURL = blockChainConfig[0].providerUrl;
            abiArray = blockChainConfig[0].marketConConfig.abi;
            contractAddress = blockChainConfig[0].marketConConfig.add;
        } else if (chainType === 'ethereum') {
            rpcURL = blockChainConfig[2].providerUrl;
            abiArray = blockChainConfig[2].marketConConfig.abi;
            contractAddress = blockChainConfig[2].marketConConfig.add;
        } else {
            console.log('invalid chainType');
            reject('invalid chainType');
            return;
        }

        console.log('rpcURL', rpcURL);

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                rpcURL
            )
        );

        const txCount = await web3.eth.getTransactionCount(publicKey, "pending");
        if (txCount.error) reject(txCount.error);
        var customGasLimit = gasLmt;
        customGasPrice = gasPr * 1000000000;
        // const contractAddress = chainType === "polygon" ? blockChainConfig[1].marketConConfig.add : binanceNftDex;
        // const abiArray = chainType === "polygon" ? blockChainConfig[1].marketConConfig.abi : binanceNftAbi;
        console.log('contractAddress', contractAddress);
        var contract = new web3.eth.Contract(abiArray, contractAddress, {
            from: publicKey
        });
        // console.log('contract',contract);
        let txObject;
        // HERE
        txObject = {
            from: publicKey,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            // chainId: chainType === "polygon" ? 80001 : undefined,
            to: contractAddress,
            value: addedFivePercent ? web3.utils.toHex(
                web3.utils.toWei(addedFivePercent.toString(), "ether")
            ) : "0x0",
            data: contract.methods
                .buyNFTBnb(collectionAddress, parseInt(`${nftId}`), "")
                .encodeABI(),
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        if (chainType === 'binance') {
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

        console.log('txObject', txObject);
        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        // const result = await web3.eth.sendSignedTransaction(
        //     raw
        // );

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            if (txHash) {
                console.log('575 txHash', txHash)
                console.log("resp noncrypto function 576", new Date().getTime());
                // resolve({ success: true, status: 200, data: txHash });
            } else if (err) {
                console.log('res else noncrypto function 580', err);
                reject(err.message);
            }
        }).once('receipt', (receipt) => {
            resolve({success: true, status: 200, data: receipt});
        }).catch(e => {
            reject(e);
        })

        // console.log(result);
        // return result
    })
}

export const checkAllowance = async (publicAddr, chainType, approvalAdd) => {
    // try {
    let NFTDex;
    let contractAddress;
    let abiArray = environment.tnftAbi;
    let ApproveAbi = "";
    let rpcUrl;
    if (chainType == "binance") {
        NFTDex = blockChainConfig[0].marketConConfig.add;
        contractAddress = environment.tnftCont;
        ApproveAbi = blockChainConfig[0].marketApproveConConfig.abi
        rpcUrl = environment.bnbRpc;
    } else if (chainType == "polygon") {
        NFTDex = blockChainConfig[1].marketConConfig.add;
        contractAddress = environment.talCont;
        ApproveAbi = blockChainConfig[1].marketApproveConConfig.abi
        rpcUrl = environment.polRpc;
    } else if (chainType == "ethereum") {
        NFTDex = blockChainConfig[2].marketConConfig.add;
        contractAddress = environment.talCont;
        ApproveAbi = blockChainConfig[2].marketApproveConConfig.abi
        rpcUrl = environment.polRpc;
    }

    return new Promise(async (resolve, reject) => {
        if (NFTDex && contractAddress && rpcUrl) {
            let balance;
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
            // const contract = new web3.eth.Contract(abiArray, contractAddress, publicAddr)
            const contract = new web3.eth.Contract(ApproveAbi, approvalAdd)
            if (contract) {
                await contract.methods.allowance(publicAddr, NFTDex).call().then(async function (info) {
                    var balance = await web3.utils.fromWei(info.toString(), "ether")
                    console.log(balance)
                    resolve({balance, contract});
                })
            } else {
                reject({success: false, data: 'Smart contract not deployed to detected network.'});
            }
        } else {
            reject({success: false, data: 'Smart contract not deployed to detected network.'});
        }

    })
    // } catch (err) {
    //     console.log(err)
    // }
}

export const approvebnb = async (publicKey, privateKey, chainType, contract) => {
    let appprovalValue = "115792089237316195423570985008687907853269984665640564039457";
    var _contract = contract;
    let NFTDex;
    let contractAddress;
    let abiArray = environment.tnftAbi;
    let rpcUrl;
    if (chainType == "binance") {
        NFTDex = blockChainConfig[0].marketConConfig.add;
        contractAddress = environment.tnftCont;
        rpcUrl = environment.bnbRpc;
    } else if (chainType == "polygon") {
        NFTDex = blockChainConfig[1].marketConConfig.add;
        contractAddress = environment.talCont;
        rpcUrl = environment.polRpc;
    } else if (chainType == "ethereum") {
        NFTDex = blockChainConfig[2].marketConConfig.add;
        contractAddress = environment.talCont;
        rpcUrl = environment.polRpc;
    }

    return new Promise(async (resolve, reject) => {
        if (NFTDex && contractAddress && rpcUrl) {
            const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

            // var andVal = await web3.utils.toWei("10000000000000000000000000000000000000000000000000000000", 'ether');
            var andVal = await web3.utils.toWei(appprovalValue, 'ether');
            console.log("andVal", andVal)
            amount = web3.utils.toHex(andVal);
            console.log("amount")

            try {
                const privKey = Buffer.from(privateKey.substring(2, 66), 'hex');
                const txCount = await web3.eth.getTransactionCount(publicKey, 'pending');
                if (txCount.error)
                    reject({success: false, msg: txCount.error});
                var customGasLimit = 6000000;
                customGasPrice = 10 * 1000000000;

                if (contract == undefined) {
                    _contract = new web3.eth.Contract(abiArray, contractAddress, {from: publicKey});
                }
                //console.log("ethtoAddress", ethtoAddress.length)
                //console.log("amount", amount.length)
                // HERE
                const txObject = {
                    from: publicKey,
                    gasPrice: web3.utils.toHex(customGasPrice),
                    gasLimit: web3.utils.toHex(customGasLimit),
                    to: contractAddress,
                    value: "0x0",
                    chainId: chainType === "polygon" ? networkType == "testnet" ? 80001 : 137 : undefined,
                    data: _contract.methods.approve(NFTDex, andVal).encodeABI(),
                    nonce: web3.utils.toHex(txCount)
                }

                let common = null;
                if (chainType === 'binance') {
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

                const tx = new EthereumTx(txObject, {common});
                tx.sign(privKey);
                const serializedTx = tx.serialize()
                const raw = '0x' + serializedTx.toString('hex')
                await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
                    if (txHash) {
                        console.log(txHash)
                        resolve({success: true, data: txHash});
                        return;
                    } else if (err && err.message) {
                        console.log(err);
                        reject({success: false, msg: "failed"});
                    } else {
                        reject({
                            success: false,
                            msg: 'Error Code : 754. Please contact customer support center',
                            error_code: 754
                        });
                    }
                })
            } catch (err) {
                console.log(err);
                reject({success: false, msg: err.message});
            }
        } else {
            reject({success: false, msg: ''});
        }
    })
}

export const getBalanceInDollar = () => {
    let routerContract = web3.eth.contract(environment.tnftCont, environment.binanceNftAbi)
    let oneToken = web3.toWei(1, 'Ether')
    let price = routerContract.functions._dollarPrice(oneToken, [tokenAddress, BUSD]).call()
    let normalizedPrice = web3.fromWei(price[1], 'Ether')
    return normalizedPrice
}

export const createCollection = async (publicKey, privKey, chainType, providerUrl, abiArray, contractAddress, gasPr, gasLmt, collectionN, collectionS) => {
    console.log("🚀 ~ file: index.js ~ line 759 ~ createCollection", publicKey, providerUrl)
    return new Promise(async (resolve, reject) => {
        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                providerUrl
            )
        );
        console.log("🚀 ~ file: index.js ~ line 766 ~ returnnewPromise ~ web3", web3)

        let txCount = "";
        try {
            console.log('txCount 770', txCount)
            txCount = await web3.eth.getTransactionCount(publicKey, "pending")
            console.log('txCount 772', txCount)
        } catch (e) {
            console.log(e, "reject tx count create collection 773")
            return reject(e)
        }

        var customGasLimit = gasLmt;
        console.log("🚀 ~ file: index.js ~ line 769 ~ customGasLimit")
        var customGasPrice = gasPr * 1000000000;
        var contract = new web3.eth.Contract(abiArray, contractAddress, {
            from: publicKey
        });
        let txObject;
        txObject = {
            from: publicKey,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            chainId: getChainId(chainType),
            to: contractAddress,
            value: "0x0",
            data: contract.methods
                .createCollection(collectionN, collectionS)
                .encodeABI(),
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        if (chainType === 'binance') {
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

        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            console.log(txHash, "tx hash count create collection 823", err)

            if (txHash) {
                console.log("🚀 ~ file: index.js ~ line 819 ~ awaitweb3.eth.sendSignedTransaction ~ txHash", txHash)
                const interval = setInterval(() => checkingProgressTransaction(), 10000)
                const checkingProgressTransaction = async () => {
                    try {
                        const transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
                        if (transactionReceipt) {
                            clearInterval(interval);
                            if (transactionReceipt.logs && (transactionReceipt.logs.length > 0)) {
                                for (var i = 0; i < transactionReceipt.logs.length; i++) {
                                    if (transactionReceipt.logs[i].address == contractAddress) {
                                        let transactionData = {
                                            transactionHash: txHash,
                                            collectionAddress: '0x' + transactionReceipt.logs[i].data.substring(26, 66)
                                        }
                                        resolve({success: true, status: 200, data: transactionData});
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.log(error, " create nft sendSignedTransaction error 846");
                        reject(error)
                    }
                }

            } else if (err) {
                console.log(err, "transactionReceipt sendSignedTransaction error 852");
                reject(err);
            }
        })
    })
}

export const setApprovalForAll = async (publicKey, privKey, rpcURL, chainType, approvalCheckContract, MarketContractAddress, collectionAddress, gasPr, gasLmt) => {
    return new Promise(async (resolve, reject) => {

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                rpcURL
            )
        );

        let txCount = "";

        try {
            txCount = await web3.eth.getTransactionCount(publicKey, "pending")
        } catch (e) {
            return reject(e)
        }

        var customGasLimit = gasLmt;
        customGasPrice = gasPr * 1000000000;
        // console.log('contract',contract);
        let txObject;
        // HERE
        txObject = {
            from: publicKey,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            chainId: getChainId(chainType),

            to: collectionAddress,
            value: "0x0",
            data: approvalCheckContract.methods
                .setApprovalForAll(MarketContractAddress, true)
                .encodeABI(),
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        if (chainType === 'binance') {
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

        console.log('txObject', txObject);
        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        // const result = await web3.eth.sendSignedTransaction(
        //     raw
        // );

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            if (txHash) {
                console.log(txHash)
                console.log("resp noncrypto function", new Date().getTime());
                // resolve({ success: true, status: 200, data: txHash });
            } else if (err) {
                console.log(err);
                reject(err.message);
            }
        }).once('receipt', (receipt, err) => {
            console.log(err, "///////")
            resolve({success: true, status: 200, data: receipt});
        });

        // console.log(result);
        // return result
    })
}

export const nftMakingMethods = async (data) => {
    return new Promise(async (resolve, reject) => {

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                data.providerUrl
            )
        );

        let txCount = "";

        try {
            txCount = await web3.eth.getTransactionCount(data.publicAddress, "pending")
        } catch (e) {
            return reject(e)
        }

        var customGasLimit = data.gasLimit;
        customGasPrice = data.gasFee * 1000000000;
        // console.log('contract',contract);
        let txObject;
        // HERE
        txObject = {
            from: data.publicAddress,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            chainId: getChainId(data.chainType),

            to: data.MarketContractAddress,
            value: "0x0",
            data: data.data,
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        if (data.chainType === 'binance') {
            common = Common.forCustomChain('mainnet', {
                name: 'bnb',
                networkId: getNetworkId(data.chainType),
                chainId: getChainId(data.chainType)
            }, 'petersburg');
        } else if (data.chainType === 'polygon') {
            common = Common.forCustomChain('mainnet', {
                name: 'matic',
                networkId: getNetworkId(data.chainType),
                chainId: getChainId(data.chainType)
            }, 'petersburg');
        } else {
            common = Common.forCustomChain('mainnet', {
                name: 'eth',
                networkId: getNetworkId(data.chainType),
                chainId: getChainId(data.chainType)
            }, 'petersburg');
        }

        console.log('txObject', txObject);
        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(data.privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        // const result = await web3.eth.sendSignedTransaction(
        //     raw
        // );
        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            if (txHash) {
                console.log(txHash)
                console.log("resp noncrypto function", new Date().getTime());
                // resolve({ success: true, status: 200, data: txHash });
            } else if (err) {
                console.log(err, "testing txHash error");
                reject(err.message);
            }
        }).once('receipt', (receipt) => {
            resolve({success: true, status: 200, data: receipt});
        }).catch(e => {
            reject(e.message);
        })

    })
}

export const sellNFT = async (publicKey, privKey, rpcURL, chainType, MarketPlaceContract, MarketContractAddress, nftId, collectionAddress, price, baseCurrency, allowedCurrencies, gasPr, gasLmt) => {
    return new Promise(async (resolve, reject) => {

        const web3 = new Web3(
            new Web3.providers.HttpProvider(
                rpcURL
            )
        );

        const txCount = await web3.eth.getTransactionCount(publicKey, "pending");
        if (txCount.error) reject(txCount.error);
        var customGasLimit = gasLmt;
        customGasPrice = gasPr * 1000000000;
        // console.log('contract',contract);
        let txObject;
        // HERE
        txObject = {
            from: publicKey,
            gasPrice: web3.utils.toHex(customGasPrice),
            gasLimit: web3.utils.toHex(customGasLimit),
            chainId: chainType === "polygon" ? 80001 : undefined,
            to: MarketContractAddress,
            value: "0x0",
            data: MarketPlaceContract.methods
                .sellNFT(collectionAddress, nftId, publicKey, web3.utils.toWei(`${price}`, "ether"), baseCurrency, allowedCurrencies)
                .encodeABI(),
            nonce: web3.utils.toHex(txCount)
        };

        let common = null;
        if (chainType === 'binance') {
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

        console.log('txObject', txObject);
        const tx = new EthereumTx(txObject, {common});
        privateKey = Buffer.from(privKey.substring(2, 66), 'hex');
        tx.sign(privateKey);
        const serializedTx = tx.serialize();
        const raw = "0x" + serializedTx.toString("hex");
        // const result = await web3.eth.sendSignedTransaction(
        //     raw
        // );

        await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
            if (txHash) {
                console.log(txHash)
                console.log("resp noncrypto function", new Date().getTime());
                // resolve({ success: true, status: 200, data: txHash });
            } else if (err) {
                console.log(err);
                reject(err.message);
            }
        }).once('receipt', (receipt) => {
            resolve({success: true, status: 200, data: receipt});
        });

        // console.log(result);
        // return result
    })
}