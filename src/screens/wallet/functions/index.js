const Web3 = require('web3');
var Accounts = require('web3-eth-accounts');
const EthereumTx = require('ethereumjs-tx').Transaction;
// import Common, {Chain} from '@ethereumjs/common'
import Common from 'ethereumjs-common';
import { Transaction } from '@ethereumjs/tx'
import { environment } from '../../../walletUtils';

export const getSig = (message, privateKey) => {
  var accounts = new Accounts("");
  let wlt = accounts.privateKeyToAccount(privateKey);
  let sigMsg = wlt.sign(message, privateKey);
  return sigMsg.signature;
}

export const filterTransaction = (pubKey, trx) => {
  if(trx == null) return null;

  if(trx.from == pubKey){
    return trx;
  } else if(trx.to == pubKey){
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
  await web3.eth.subscribe('newBlockHeaders', async function (error, event) { console.log(error) })
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

  if(type == 'eth'){
    webSocketLink = environment.wsEth;
    rpcUrl = environment.ethRpc;
  }else if(type == 'bsc'){
    webSocketLink = environment.wsBsc;
    rpcUrl = environment.bnbRpc;
  }else if(type == 'polygon'){
    webSocketLink = environment.wsPolygon;
    rpcUrl = environment.polRpc;
  }

  console.log('webSocketLink',webSocketLink);
  var web3 = new Web3(new Web3.providers.WebsocketProvider(webSocketLink));
  const subscribe = web3.eth.subscribe('newBlockHeaders', (error, result) => {
    if (error) console.log('watchBalanceUpdate', error)
  }).on("connected", function (subscriptionId) {
    console.log("connected",subscriptionId);
  })
    .on("data", function (log) {
      // console.log("data",log);
      updateBalance && updateBalance();
    })
    .on("changed", function (log) {
      console.log("changed",log);
      updateBalance && updateBalance();
    });

  return subscribe;
}

export const watchAllTransactions = (pubKey) => {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://kovan.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a'));
  const subscribe = web3.eth.subscribe('logs', { fromBlock: 0, address: pubKey }, (error, result) => {
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

  if(type == 'eth'){
    webSocketLink = "wss://kovan.infura.io/ws/v3/e2fddb9deb984ba0b9e9daa116d1702a";
    rpcUrl = environment.ethRpc;
  }else if(type == 'bnb'){
    webSocketLink = "wss://data-seed-prebsc-2-s1.binance.org:8545/";
    rpcUrl = environment.bnbRpc;
  }else if(type == 'matic'){
    webSocketLink = "wss://ws-matic-mumbai.chainstacklabs.com/";
    rpcUrl = environment.polRpc;
  }

  // Instantiate web3 with WebSocket provider
  const web3 = new Web3(new Web3.providers.WebsocketProvider(webSocketLink))

  // Instantiate subscription object
  const subscription = web3.eth.subscribe('pendingTransactions')

  // Subscribe to pending transactions
  subscription.subscribe((error, result) => {
    if (error) console.log('subscription',error)
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

      if(transaction !== null){
        console.log('trx',trx);
        addToList && addToList(transaction);
      }

      // console.log('Found incoming Ether transaction from ' + process.env.WALLET_FROM + ' to ' + process.env.WALLET_TO);
      // console.log('Transaction value is: ' + process.env.AMOUNT)
      // console.log('Transaction hash is: ' + txHash + '\n')

      // Initiate transaction confirmation
      // confirmEtherTransaction(txHash)

      // Unsubscribe from pending transactions.
      // subscription.unsubscribe()
    }
    catch (error) {
      console.log(error)
    }
  });
  return subscription;
}

export const balance = async(pubKey, contractAddr, contractAbi, rpc, type) => {
    return new Promise(async (resolve, reject) => {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
      if (contractAddr) {
        const contract = new web3.eth.Contract(contractAbi, contractAddr);
        let reserves = {};
        await contract.methods.balanceOf(pubKey).call().then(function (result) {
          if (type == 'usdc') {
            resolve(web3.utils.fromWei(result.toString(), "mwei"));
          } else if (type == 'alia') {
            resolve(web3.utils.fromWei(result.toString(), "ether"));
          } else if (type == 'usdt') {
            resolve(web3.utils.fromWei(result.toString(), 'ether') * 1e12);
          } else if (type == 'busd') {
            resolve(web3.utils.fromWei(result.toString(), 'ether') * 1e12);
          }
        }).catch(function (error) {
          console.log(error + ' is the error');
        })
      } else {
        await web3.eth.getBalance(pubKey, function (error, ethbalance) {
          if (error) {
            reject(error);
          } else {
            resolve(web3.utils.fromWei(ethbalance.toString(10), 'ether'));
          }
        })
      }
    })
  }

export const transfer = (pubkey, privkey, amount, toAddress, type, contractAddr, contractAbi, rpc, gasPr, gasLmt) => {
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    try {
      const privKey = Buffer.from(privkey.substring(2, 66), 'hex');
      const txCount = await web3.eth.getTransactionCount(pubkey, 'pending');
      if (txCount.error)
        reject({ success: false, msg: txCount.error });
      customGasPrice = gasPr * 1000000000;
      var contract;
      if (contractAddr) {
        contract = new web3.eth.Contract(contractAddr, contractAddr, { from: pubkey });
      }
      var amountToSend = web3.utils.toWei(amount.toString(), 'ether');
      // HERE
      const txObject = {
        from: pubkey,
        gasPrice: web3.utils.toHex(customGasPrice),
        gasLimit: web3.utils.toHex(gasLmt),
        to: toAddress,
        value: web3.utils.toHex(amountToSend),
        nonce: web3.utils.toHex(txCount)
      }

      let common;

      if (type == 'usdt' || type == 'busd' || type == 'usdc') {
        var convertto6decimal = parseFloat(amount).toFixed(6) * 1e6;
        if (type == 'usdc') {
          txObject.chainId = 137;
          convertto6decimal = parseFloat(amount);
        }
        txObject.value = "0x0";
        txObject.data = contract.methods.transfer(toAddress, web3.utils.toHex(parseInt(convertto6decimal))).encodeABI();
        txObject.to = contractAddr;
      } else if (type == 'matic') {
        // txObject.chainId = 137;
        common = Common.forCustomChain('mainnet', {
          name: 'matic',
          networkId: 80001,
          chainId: 80001
        }, 'petersburg');
      } else if (type == 'alia') {
        var amountToSendAlia = web3.utils.toWei(amount.toString(), 'ether');
        amountToSendAlia = web3.utils.toHex(amountToSendAlia);
        txObject.value = "0x0";
        txObject.data = contract.methods.transfer(toAddress, amountToSendAlia).encodeABI();
        txObject.to = contractAddr;
      } else if (type == 'bnb') {
        common = Common.forCustomChain('mainnet', {
          name: 'bnb',
          networkId: 97,
          chainId: 97
        }, 'petersburg');
      }

      const tx = new EthereumTx(txObject, type == 'eth'?{chain: 'kovan'}:{common});
      // const common = new Common({ chain: Chain.Ropsten });
      // const tx = Transaction.fromTxData(txObject, {common});
      tx.sign(privKey);
      console.log('tx',tx);
      const serializedTx = tx.serialize()
      console.log('serializedTx',serializedTx);
      const raw = '0x' + serializedTx.toString('hex')
      await web3.eth.sendSignedTransaction(raw, async (err, txHash) => {
        if (txHash) {
          console.log(txHash)
          resolve({ success: true, data: txHash });
          return;
        } else if (err && err.message) {
          console.log(err);
          reject({ success: false, msg: "failed" });
        } else {
          reject({ success: false, msg: 'Error Code : 754. Please contact customer support center', error_code: 754 });
        }
      })

    }
    catch (err) {
      console.log(err);
      reject({ success: false, msg: err.message });
    }
  })
}