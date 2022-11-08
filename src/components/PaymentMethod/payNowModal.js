import React, { useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';
import { RF, wp, hp } from '../../constants/responsiveFunct';
import { translate } from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import { useSelector } from 'react-redux';
import { alertWithSingleBtn } from '../../common/function';
import { BlurView } from '@react-native-community/blur';
import { IconButton } from 'react-native-paper';
import { numberWithCommas } from '../../utils';
import {
  handleTransactionError,
  sendCustomTransaction,
} from '../../screens/wallet/functions/transactionFunctions';

const PaymentNow = props => {
  const { paymentObject } = useSelector(state => state.PaymentReducer);
  const { userData } = useSelector(state => state.UserReducer);
  const { buyNFTRes } = useSelector(state => state.detailsNFTReducer);
  const walletAddress = userData?.userWallet?.address;

  const { visible, onRequestClose, nftId, priceInDollar } = props;
  const [opacity, setOpacity] = useState(0.88);
  const [loading, setLoading] = useState(false);

  const getTitle = () => {
    let title = '';
    if (paymentObject) {
      if (paymentObject.type == 'wallet') {
        title = translate('wallet.common.payByWallet');
      }
    }
    return title;
  };

  const payByWallet = async () => {
    try {
      // console.log('paymentObject', paymentObject, buyNFTRes);

      const approveAllData = buyNFTRes?.dataReturn?.approveAllData;
      const approveData = buyNFTRes?.dataReturn?.approveData;
      const signData = buyNFTRes?.dataReturn?.signData;
      if (approveAllData) {
        // console.log(
        //   '🚀 ~ file: detail.js ~ line 1856 ~ handleBuyNft ~ approveAllData',
        //   approveAllData,
        // );
      }

      // setOpenTransactionPending(true);
      let approved = true;
      let noncePlus = 0;

      if (approveData) {
        try {
          const transactionParameters = {
            nonce: approveData.nonce, // ignored by MetaMask
            to: approveData.to, // Required except during contract publications.
            from: approveData.from, // must match user's active address.
            data: approveData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: buyNFTRes?.currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          const txnResult = await sendCustomTransaction(
            transactionParameters,
            walletAddress,
            buyNFTRes?.nftTokenId,
            buyNFTRes?.nftNetwork?.networkName,
          );

          if (txnResult) {
            noncePlus = 1;
            // toast.success(t('APPROVE_TOKEN_SUCCESS'))
          }
        } catch (error) {
          approved = false;
          // setOpen(true);
          // setOpenTransactionPending(false);
          // setErrorMessage('APPROVE_TOKEN_FAIL');
        }
      }
      if (signData && approved) {
        try {
          const transactionParameters = {
            nonce: signData.nonce + noncePlus, // ignored by MetaMask
            to: signData.to, // Required except during contract publications.
            from: signData.from, // must match user's active address.
            value: signData?.value, // Only required to send ether to the recipient from the initiating external account.
            data: signData.data, // Optional, but used for defining smart contract creation and interaction.
            chainId: buyNFTRes?.currentNetwork?.chainId, // Used to prevent transaction reuse across b
          };

          sendCustomTransaction(
            transactionParameters,
            walletAddress,
            buyNFTRes?.nftTokenId,
            buyNFTRes?.nftNetwork?.networkName,
          )
            .then(res => {
              // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));

              // getNFTDetails(true);
              setLoading(false);
              onRequestClose();
            })
            .catch(err => {
              console.log('payByWallet_err payByWallet 339', err);
              handlePendingModal(false);
              handleTransactionError(err);
            });
        } catch (error) {
          // setOpenTransactionPending(false);
          setLoading(false);
          handleTransactionError(error);
        }
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: payNowModal.js ~ line 322 ~ payByWal ~ error',
        error,
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      transparent
      onShow={() => setOpacity(0.88)}
      onRequestClose={() => {
        // setOpacity(0);
        onRequestClose();
      }}>
      <View style={[styles.container]}>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={5}></BlurView>
        <TouchableOpacity
          style={styles.emptyArea}
          onPress={() => {
            // setOpacity(0);
            onRequestClose();
          }}
        />
        <View style={styles.contentContainer}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => {
              // setOpacity(0);
              onRequestClose();
            }}>
            {/* <Image style={styles.closeIcon} source={ImagesSrc.cancelIcon} /> */}
            <IconButton
              icon={'close'}
              color={Colors.headerIcon2}
              size={17}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>

          {paymentObject && paymentObject.type == 'wallet' ? (
            <View style={styles.profileCont}>
              <Image
                style={styles.profileImage}
                source={paymentObject.item.icon}
              />
            </View>
          ) : (
            <Text style={styles.balance}>
              {translate('wallet.common.balanceAmount')}
            </Text>
          )}

          <View style={styles.valueContainer}>
            <Text numberOfLines={1} style={styles.amount}>
              {paymentObject && paymentObject.type == 'wallet'
                ? numberWithCommas(
                  parseFloat(Number(paymentObject.priceInToken).toFixed(4)),
                ) + ' '
                : numberWithCommas(
                  parseFloat(Number(priceInDollar).toFixed(2)),
                ) || 0}
            </Text>
            {paymentObject && paymentObject.type !== 'card' && (
              <Text style={styles.symbol}>
                {paymentObject && paymentObject.type == 'wallet'
                  ? `${paymentObject.item.type} `
                  : ''}
              </Text>
            )}
          </View>

          <Separator style={styles.separator} />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              {paymentObject && translate('wallet.common.total')}
            </Text>
            <Text style={styles.value}>
              {paymentObject && paymentObject.type == 'wallet'
                ? numberWithCommas(
                  parseFloat(Number(paymentObject.priceInToken).toFixed(4)),
                )
                : numberWithCommas(
                  parseFloat(Number(priceInDollar).toFixed(2)),
                ) || 0}{' '}
              {paymentObject && paymentObject.type == 'wallet'
                ? `${paymentObject.item.type}`
                : ''}
            </Text>
          </View>

          <AppButton
            label={translate('common.buyNext')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              if (nftId && paymentObject) {
                setLoading(true);
                if (paymentObject.type == 'wallet') {
                  payByWallet();
                }
              }
            }}
            loading={loading}
            view={loading}
          />
        </View>
        <SafeAreaView style={{ backgroundColor: Colors.white }} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  emptyArea: {
    flex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(95, 148, 255, 0.7)',
  },
  contentContainer: {
    backgroundColor: Colors.white,
    padding: '4%',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.iconBg,
    margin: 0,
  },
  title: {
    fontFamily: Fonts.ARIAL,
    fontSize: RF(2),
    alignSelf: 'center',
    marginVertical: wp('3%'),
    marginBottom: hp('3%'),
  },
  optionContainer: {
    backgroundColor: Colors.WHITE3,
    borderRadius: wp('1%'),
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('2.5%'),
  },
  separator: {
    width: wp('100%'),
  },
  totalLabel: {
    fontSize: RF(1.9),
    fontFamily: Fonts.ARIAL,
  },
  value: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
  },
  balance: {
    fontSize: RF(1.8),
    fontFamily: Fonts.ARIAL,
    marginVertical: hp('1.5%'),
    alignSelf: 'center',
  },
  amount: {
    fontSize: RF(4.2),
    fontFamily: Fonts.ARIAL,
    color: Colors.themeColor,
    lineHeight: RF(4.2),
  },
  valueContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
    alignItems: 'baseline',
  },
  symbol: {
    fontSize: RF(3.2),
    fontFamily: Fonts.ARIAL,
    color: Colors.themeColor,
  },
  cardNumber: {
    color: Colors.themeColor,
    fontSize: RF(1.8),
    fontFamily: Fonts.ARIAL,
  },
  editContainer: {
    position: 'absolute',
    right: -5,
    top: -15,
  },
  profileCont: {
    ...CommonStyles.circle('13.5'),
    alignSelf: 'center',
  },
  profileImage: {
    ...CommonStyles.imageStyles(13.5),
  },
});

export default PaymentNow;
