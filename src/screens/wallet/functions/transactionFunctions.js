import Common from 'ethereumjs-common';
import { getWallet } from '../../../helpers/AxiosApiRequest';
import { modalAlert } from '../../../common/function';

import { translate, IsTestNet } from '../../../walletUtils';
import { blockChainConfig } from '../../../web3/config/blockChainConfig';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx').Transaction;

//=========================== Get Gas Limit Function ===============================
export const getGasLimit = async (data, rpcURL) => {
  const provider = new Web3(new Web3.providers.HttpProvider(rpcURL));

  return provider.eth.estimateGas(data);
};

//=========================== Get Gas Price Function ===============================
export const getGasPrice = async rpcURL => {
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
        chainId: IsTestNet ? chainType === 'ethereum' ? 5 : networkObject?.chainId : networkObject?.chainId,
      },
      'petersburg',
    );
  }
  return common;
};

//=========================== Transaction Processing Function ===============================
const transactionProcessing = async (
  txObject,
  common,
  privateKey,
  web3,
  resolve,
  reject,
) => {
  try {
    const tx = new EthereumTx(txObject, { common });
    const privKey = Buffer.from(privateKey.substring(2, 66), 'hex');
    tx.sign(privKey);
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');
    await web3.eth
      .sendSignedTransaction(raw, async (err, txHash) => {
        if (txHash) {
          // resolve({ success: true, status: 200, data: txHash });
        } else if (err) {
          reject(err.message);
        }
      })
      .once('receipt', receipt => {
        resolve({ success: true, status: 200, data: receipt });
      })
      .catch(e => {
        reject(e);
      });
  } catch (error) { }
};

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
        chainId: IsTestNet ? chainType === 'ethereum' ? 5 : transaction?.chainId : transaction?.chainId,
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
            chainId: IsTestNet ? chainType === 'ethereum' ? 5 : transaction?.chainId : transaction?.chainId,
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
            // resolve({ success: true, status: 200, data: txHash });
          } else if (err) {
            reject(err.message);
          }
        })
        .once('receipt', receipt => {
          resolve({ success: true, status: 200, data: receipt });
        })
        .catch(e => {
          reject(e);
        });
    });
  } catch (error) { }
};

//============================== Get SignData =======================================
const getConvertedDecimalValue = (type, convertto6decimal, web3) => {
  try {
    if (type == 'usdc') {
      // resolve(web3.utils.fromWei(result.toString(), "ether"));
      return web3.utils.toWei(convertto6decimal.toString(), 'mwei');
    } else if (type == 'alia' || type == 'tnft' || type == 'tal') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether');
    } else if (type == 'usdt') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether') * 1e12;
    } else if (type == 'busd') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether');
    } else if (type == 'weth') {
      return web3.utils.toWei(convertto6decimal.toString(), 'ether');
    }
  } catch (error) {
    reject(error);
  }
};

export const getSignData = (transferParameters, config, web3, reject) => {
  try {
    const type = transferParameters?.tokenType?.toLowerCase();
    let convertto6decimal;
    let signData;
    let contract = new web3.eth.Contract(
      config.ContractAbis,
      config.ContractAddress,
      { from: transferParameters.publicAddress },
    );

    if (type == 'usdt') {
      convertto6decimal =
        parseFloat(transferParameters.amount).toFixed(6) * 1e6;
      signData = contract.methods
        .transfer(transferParameters.toAddress, convertto6decimal)
        .encodeABI();
    } else if (type == 'usdc') {
      convertto6decimal = parseFloat(transferParameters.amount).toFixed(6);

      convertto6decimal = getConvertedDecimalValue(
        type,
        convertto6decimal,
        web3,
        reject,
      );
      signData = contract.methods
        .transfer(
          transferParameters.toAddress,
          web3.utils.toHex(convertto6decimal),
        )
        .encodeABI();
    } else {
      convertto6decimal = parseFloat(transferParameters.amount).toFixed(8);

      convertto6decimal = getConvertedDecimalValue(
        type,
        convertto6decimal,
        web3,
        reject,
      );

      signData = contract.methods
        .transfer(
          transferParameters.toAddress,
          web3.utils.toHex(convertto6decimal),
        )
        .encodeABI();
    }

    return signData;
  } catch (error) {
    reject(error);
  }
};

//============================== Balance Transfer Function =====================================
export const balanceTransfer = async (transferParameters, config) => {
  try {
    return new Promise(async (resolve, reject) => {
      const chainType = transferParameters?.chainType?.toLowerCase();
      const tokenType = transferParameters?.tokenType;

      const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcURL));

      const txCount = await web3.eth.getTransactionCount(
        transferParameters.publicAddress,
        'pending',
      );
      if (txCount.error) reject(txCount.error);

      let txObject;

      if (
        tokenType === 'BNB' ||
        tokenType === 'Matic' ||
        tokenType === 'ETH' ||
        tokenType === 'XETA'
      ) {
        //NON ERC20(BNB,MATIC,ETH)
        const gasPrice = await getGasPrice(config.rpcURL);

        let convertto6decimal = parseFloat(transferParameters.amount).toFixed(
          8,
        );
        const amountToSend = web3.utils.toWei(
          convertto6decimal.toString(),
          'ether',
        );

        txObject = {
          from: transferParameters.publicAddress,
          to: transferParameters.toAddress,
          gasPrice: Number(gasPrice),
          gasLimit: 21000,
          value: web3.utils.toHex(amountToSend),
          nonce: web3.utils.toHex(txCount),
          chainId: IsTestNet ? chainType === 'ethereum' ? 5 : transferParameters.chainId : transferParameters.chainId,
        };

        let common = getCommon(chainType, transferParameters);

        await transactionProcessing(
          txObject,
          common,
          transferParameters.privKey,
          web3,
          resolve,
          reject,
        );
      } else {
        //ERC20(TAL,TNFT etc.)
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

        txObject = {
          from: transferParameters.publicAddress,
          to: config.ContractAddress,
          gasPrice: gasPrice,
          gasLimit: gasLimit,
          value: '0x0',
          data: signData,
          nonce: web3.utils.toHex(txCount),
          chainId: IsTestNet ? chainType === 'ethereum' ? 5 : transferParameters.chainId : transferParameters.chainId,
        };

        let common = getCommon(chainType, transferParameters);

        await transactionProcessing(
          txObject,
          common,
          transferParameters.privKey,
          web3,
          resolve,
          reject,
        );
      }
    });
  } catch (error) {
    reject(error);
  }
};
//========================================================================================================

//=========================== Handle Transaction Error Function ===============================
export const handleTransactionError = error => {
  if (
    typeof error === 'string' &&
    (error.includes('transaction underpriced') ||
      error.includes('insufficient funds for gas * price + value'))
  ) {
    modalAlert(
      translate('wallet.common.alert'),
      translate('common.blanceLow'),
    );
  } else {
    modalAlert(translate('common.error'), error?.message);
  }
};
