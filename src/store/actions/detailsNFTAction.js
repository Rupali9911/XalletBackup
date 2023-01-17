import { NEW_BASE_URL } from '../../common/constants';
import sendRequest from '../../helpers/AxiosApiRequest';
import {
  getConfigDetails,
  sendCustomTransaction,
  estimateGasTransactions,
  handleTransactionError,
} from '../../screens/wallet/functions/transactionFunctions';
import { BUY_NFT_START, BUY_NFT_SUCCESS, BUY_NFT_FAIL } from '../types';

export const buyNFTStart = () => ({
  type: BUY_NFT_START,
});

export const buyNFTSuccess = data => ({
  type: BUY_NFT_SUCCESS,
  payload: data,
});

export const buyNFTFail = error => ({
  type: BUY_NFT_FAIL,
  payload: error,
});

export const buyNFTApi = (
  saleNftId,
  currentNetwork,
  nftNetwork,
  nftTokenId,
) => {
  return (dispatch, getState) => {
    const { userData } = getState().UserReducer;
    const walletAddress = userData?.userWallet?.address;

    dispatch(buyNFTStart());
    const url = `${NEW_BASE_URL}/sale-nft/buy-nft`;
    const data = {
      quantity: 1,
      saleNftId: saleNftId,
    };
    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(async buyNFTRes => {
        const approveData = buyNFTRes?.dataReturn?.approveData;
        const signData = buyNFTRes?.dataReturn?.signData;
        let transactionParameters = {};
        let noncePlus = 0;

        if (approveData) {
          try {
            transactionParameters = {
              nonce: approveData.nonce, // ignored by MetaMask
              to: approveData.to, // Required except during contract publications.
              from: approveData.from, // must match user's active address.
              data: approveData.data, // Optional, but used for defining smart contract creation and interaction.
              chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
            };
            const txnResult = sendCustomTransaction(
              transactionParameters,
              walletAddress,
              nftTokenId,
              nftNetwork?.networkName,
            );
            if (txnResult) {
              noncePlus = 1;
              // toast.success(t('APPROVE_TOKEN_SUCCESS'))
            }
          } catch (error) {
            approved = false;
            // setOpenTransactionPending(false);
            // setErrorMessage('APPROVE_TOKEN_FAIL');
          }
        }

        if (signData) {
          transactionParameters = {
            nonce: signData.nonce + noncePlus, // ignored by MetaMask
            to: signData.to, // Required except during contract publications.
            from: signData.from, // must match user's active address.
            value: signData?.value, // Only required to send ether to the recipient from the initiating external account.
            data: signData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };
        }

        const config = getConfigDetails(currentNetwork?.name);


        const { gasLimit, gasPrice } = await estimateGasTransactions(
          transactionParameters,
          config.rpcURL,
        );

        dispatch(
          buyNFTSuccess({
            ...buyNFTRes,
            gasLimit,
            gasPrice,
            currentNetwork,
            nftNetwork,
            nftTokenId,
          }),
        );
      })
      .catch(error => {
        dispatch(buyNFTFail(error));
        handleTransactionError(error);
      });
  };
};
