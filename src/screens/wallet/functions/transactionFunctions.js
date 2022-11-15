import Common from 'ethereumjs-common';
import { getWallet } from '../../../helpers/AxiosApiRequest';
import { alertWithSingleBtn } from '../../../utils';
import {
  translate
} from '../../../walletUtils';
import { blockChainConfig } from '../../../web3/config/blockChainConfig';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

//=========================== Get Gas Limit Function ===============================
const getGasLimit = async (data, rpcURL) => {
  const provider = new Web3(new Web3.providers.HttpProvider(rpcURL));

  return provider.eth.estimateGas(data);
};

//=========================== Get Gas Price Function ===============================
const getGasPrice = async rpcURL => {
  const provider = new Web3(new Web3.providers.HttpProvider(rpcURL));

  return provider.eth.getGasPrice();
};

//=========================== Estimate Gas Transaction Function ===============================
export const estimateGasTransactions = async (transaction, rpcURL) => {
  try {
    const data = {
      from: transaction.from,
      to: transaction.to,
      data: transaction.data,
      nonce: transaction.nonce,
    };
    if (transaction.value) {
      data.value = transaction.value;
    }

    const gasLimit = await getGasLimit(data, rpcURL);

    const gasPrice = await getGasPrice(rpcURL);

    return {
      gasLimit: Number(gasLimit),
      gasPrice: Number(gasPrice),
    };

  } catch (error) {
    console.log("@@@ error gas limit ===>", error)
  }
};

//=========================== Get Config Details Function ===============================
export const getConfigDetails = type => {
  const config = {
    rpcURL: '',
    MarketContractAddress: '',
    MarketPlaceAbi: '',
    ApproveAbi: '',
    error: '',
  };
  const chainType = type?.toLowerCase();
  if (chainType === 'polygon') {
    config.rpcURL = blockChainConfig[1].providerUrl;
    config.MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    config.MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    config.ApproveAbi = blockChainConfig[1].marketApproveConConfig.abi;
  } else if (chainType === 'bsc') {
    config.rpcURL = blockChainConfig[0].providerUrl;
    config.MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    config.MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    config.ApproveAbi = blockChainConfig[0].marketApproveConConfig.abi;
  } else if (chainType === 'ethereum') {
    config.rpcURL = blockChainConfig[2].providerUrl;
    config.MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    config.MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi; // as per walletPay
    config.ApproveAbi = blockChainConfig[2].marketApproveConConfig.abi;
  } else {
    config.error = 'invalid chainType';
  }
  return config;
};

//============================== Get Common =======================================
const getCommon = (chainType, networkObject) => {
  let common = null;
  if (chainType === 'bsc') {
    common = Common.forCustomChain(
      'mainnet',
      {
        name: 'bnb',
        networkId: networkObject?.networkId,
        chainId: networkObject?.chainId,
      },
      'petersburg',
    );
  } else if (chainType === 'polygon') {
    common = Common.forCustomChain(
      'mainnet',
      {
        name: 'matic',
        networkId: networkObject?.networkId,
        chainId: networkObject?.chainId,
      },
      'petersburg',
    );
  } else {
    common = Common.forCustomChain(
      'mainnet',
      {
        name: 'eth',
        networkId: networkObject?.networkId,
        chainId: chainType === "ethereum" ? 5 : networkObject?.chainId,
      },
      'petersburg',
    );
  }
  return common;
}

//=========================== Transaction Processing Function ===============================
const transactionProcessing = async (txObject, common, privateKey, web3, resolve, reject) => {
  try {
    const tx = new EthereumTx(txObject, { common });

    const privKey = Buffer.from(privateKey.substring(2, 66), 'hex');
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    await web3.eth
      .sendSignedTransaction(raw, async (err, txHash) => {
        if (txHash) {
          console.log("@@@ Transaction hash line-no.-134 ===========>", txHash)
          // resolve({ success: true, status: 200, data: txHash });
        } else if (err) {
          console.log(err);
          reject(err.message);
        }
      })
      .once('receipt', receipt => {

        resolve({ success: true, status: 200, data: receipt });
        console.log('470 - resolve');
      })
      .catch(e => {
        console.log('Catch 472', e);
        reject(e);
      });
  } catch (error) {
    console.log("@@@ transaction processing error =============>", error)
  }
}

//=========================== Send Custom Transaction Function ===============================
export const sendCustomTransaction = async (
  transaction,
  publicKey,
  nftId,
  nftchainType,
  price,
) => {
  try {
    return new Promise(async (resolve, reject) => {
      const chainType = nftchainType?.toLowerCase();
      const config = getConfigDetails(chainType);

      if (config.error === 'invalid chainType') {
        console.log('invalid chainType');
        reject('invalid chainType');
        return;
      }

      const data = {
        from: transaction.from,
        to: transaction.to,
        data: transaction.data,
        nonce: transaction.nonce,
      };
      if (transaction.value) {
        data.value = transaction.value;
      }

      const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcURL));

      const txCount = await web3.eth.getTransactionCount(publicKey, 'pending');
      if (txCount.error) reject(txCount.error);
      let txObject;
      const { gasLimit, gasPrice } = await estimateGasTransactions(
        transaction,
        config.rpcURL,
      );
      const { privateKey } = await getWallet();

      txObject = {
        from: publicKey,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        chainId: transaction?.chainId,
        // chainId: chainType === 'polygon' ? 80001 : undefined,
        // to: config.MarketContractAddress,
        to: transaction?.to,
        value: price ? data.value : '0x0',
        data: transaction?.data,
        // nonce: web3.utils.toHex(txCount),
        nonce: transaction?.nonce,
      };


      let common = null;
      if (chainType === 'bsc') {
        common = Common.forCustomChain(
          'mainnet',
          {
            name: 'bnb',
            networkId: transaction?.networkId,
            chainId: transaction?.chainId,
          },
          'petersburg',
        );
      } else if (chainType === 'polygon') {
        common = Common.forCustomChain(
          'mainnet',
          {
            name: 'matic',
            networkId: transaction?.networkId,
            chainId: transaction?.chainId,
          },
          'petersburg',
        );
      } else {
        common = Common.forCustomChain(
          'mainnet',
          {
            name: 'eth',
            networkId: transaction?.networkId,
            chainId: transaction?.chainId,
          },
          'petersburg',
        );
      }

      const tx = new EthereumTx(txObject, { common });

      const privKey = Buffer.from(privateKey.substring(2, 66), 'hex');
      tx.sign(privKey);
      const serializedTx = tx.serialize();
      const raw = '0x' + serializedTx.toString('hex');



      await web3.eth
        .sendSignedTransaction(raw, async (err, txHash) => {

          if (txHash) {
            console.log('461 resp crypto function', new Date().getTime());
            // resolve({ success: true, status: 200, data: txHash });
          } else if (err) {
            console.log(err);
            reject(err.message);
          }
        })
        .once('receipt', receipt => {
          resolve({ success: true, status: 200, data: receipt });
          console.log('470 - resolve');
        })
        .catch(e => {
          console.log('Catch 472', e);
          reject(e);
        });
    });
  } catch (error) {
    console.log('🚀 ~ file: transactionFunctions.js ~ line 228 ~ error', error);
  }
};

//============================== Get SignData =======================================
const getConvertedDecimalValue = (type, convertto6decimal, web3) => {
  try {
    if (type == 'usdc') {
      // resolve(web3.utils.fromWei(result.toString(), "ether"));
      return web3.utils.toWei(convertto6decimal.toString(), "mwei");
    } else if (type == 'alia' || type == 'tnft' || type == 'tal') {
      return web3.utils.toWei(convertto6decimal.toString(), "ether")
    } else if (type == 'usdt') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether') * 1e12;
    } else if (type == 'busd') {
      return web3.utils.toWei(convertto6decimal.toString(), "ether");
    } else if (type == 'weth') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether') * 1e10;
    }
  } catch (error) {
    console.log("@@@ Get ConvertedDecimalValue error =============>", error);
    reject(error)
  }
}


const getSignData = (transferParameters, config, web3, reject) => {
  try {
    const type = transferParameters?.tokenType?.toLowerCase();
    let convertto6decimal;
    let signData;
    let contract = new web3.eth.Contract(config.ContractAbis, config.ContractAddress, { from: transferParameters.publicAddress });

    if (type == 'usdt') {
      convertto6decimal = parseFloat(transferParameters.amount).toFixed(6) * 1e6;
      signData = contract.methods.transfer(transferParameters.toAddress, convertto6decimal).encodeABI();
    } else {
      convertto6decimal = parseFloat(transferParameters.amount).toFixed(6);

      convertto6decimal = getConvertedDecimalValue(type, convertto6decimal, web3, reject);
      // console.log("@@@ Get signData (convertTo6Decimal) =========>", convertto6decimal);

      signData = contract.methods.transfer(transferParameters.toAddress, web3.utils.toHex(convertto6decimal)).encodeABI();
    }

    return signData
  } catch (error) {
    console.log("@@@ Get signData error =============>", error);
    reject(error)
  }
}

//============================== Balance Transfer Function =====================================
export const balanceTransfer = async (transferParameters, config) => {
  try {
    return new Promise(async (resolve, reject) => {
      const chainType = transferParameters?.chainType?.toLowerCase();
      const tokenType = transferParameters?.tokenType;

      const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcURL));

      const txCount = await web3.eth.getTransactionCount(transferParameters.publicAddress, 'pending');
      if (txCount.error) reject(txCount.error);
      // console.log('@@@ balance transfer func (txnCount) =========>', txCount);

      let txObject;

      if (tokenType === 'BNB' || tokenType === 'Matic' || tokenType === 'ETH' || tokenType === 'XETA') {
        //NON ERC20(BNB,MATIC,ETH)
        // console.log("@@@ For NON ERRC20 Token if ============>", tokenType);
        const gasPrice = await getGasPrice(config.rpcURL);

        let convertto6decimal = parseFloat(transferParameters.amount).toFixed(6);
        const amountToSend = web3.utils.toWei(convertto6decimal.toString(), 'ether');
        // console.log("@@@ For NON ERRC20 Token (amountToSend) ========>", amountToSend)

        txObject = {
          from: transferParameters.publicAddress,
          to: transferParameters.toAddress,
          gasPrice: Number(gasPrice),
          gasLimit: 21000,
          value: web3.utils.toHex(amountToSend),
          nonce: web3.utils.toHex(txCount),
          chainId: chainType === "ethereum" ? 5 : transferParameters.chainId,
        };


        let common = getCommon(chainType, transferParameters);
        // console.log("@@@ balance transfer (common) =========>", common);

        await transactionProcessing(txObject, common, transferParameters.privKey, web3, resolve, reject)

      } else {
        //ERC20(TAL,TNFT etc.)
        // console.log("@@@ For ERRC20 Token else ============>", tokenType);
        let signData = getSignData(transferParameters, config, web3, reject);
        if (!signData) return;
        const transaction = {
          from: transferParameters.publicAddress,
          to: config.ContractAddress,
          data: signData,
          nonce: web3.utils.toHex(txCount),
        };
        // let txObject;
        const { gasLimit, gasPrice } = await estimateGasTransactions(
          transaction,
          config.rpcURL,
        );
        // console.log("@@@ balance transfer func gasLimit and gasPrice ===========>", { gasLimit: Number(gasLimit), gasPrice: Number(gasPrice) });

        txObject = {
          from: transferParameters.publicAddress,
          to: config.ContractAddress,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          value: "0x0",
          data: signData,
          nonce: web3.utils.toHex(txCount),
          chainId: chainType === "ethereum" ? 5 : transferParameters.chainId,
        };

        let common = getCommon(chainType, transferParameters);

        await transactionProcessing(txObject, common, transferParameters.privKey, web3, resolve, reject)
      }
    });
  } catch (error) {
    console.log("@@@ balance transfer function =============================>", error);
    reject(error);

  }
}
//========================================================================================================

//=========================== Handle Transaction Error Function ===============================
export const handleTransactionError = error => {
  console.log(
    '🚀 ~ file: transactionFunctions.js ~ line 192 ~ handleTransactionError ~ error',
    error,
  );

  if (
    typeof error === 'string' &&
    (error.includes('transaction underpriced') ||
      error.includes('insufficient funds for gas *  price + value'))
  ) {
    alertWithSingleBtn(
      translate('wallet.common.alert'),
      translate('common.blanceLow'),
    );
  } else {
    alertWithSingleBtn(translate('common.error'), error?.message);
  }
};