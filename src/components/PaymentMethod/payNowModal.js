import React, {useState} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';
import {RF, wp, hp} from '../../constants/responsiveFunct';
import {translate, CARD_MASK, environment} from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {formatWithMask} from 'react-native-mask-input';
import {
  getPaymentIntent,
  getTransactionHash,
  updateTransactionSuccess,
} from '../../store/reducer/paymentReducer';
import {useStripe} from '@stripe/stripe-react-native';
import {StripeApiRequest} from '../../helpers/ApiRequest';
import {alertWithSingleBtn} from '../../common/function';
import {BlurView} from '@react-native-community/blur';
import {IconButton} from 'react-native-paper';
import {numberWithCommas} from '../../utils';
import {
  handleTransactionError,
  sendCustomTransaction,
} from '../../screens/wallet/functions/transactionFunctions';

const PaymentNow = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {paymentObject} = useSelector(state => state.PaymentReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const {buyNFTRes} = useSelector(state => state.detailsNFTReducer);
  const walletAddress = userData?.userWallet?.address;

  const {
    initPaymentSheet,
    presentPaymentSheet,
    handleCardAction,
    confirmPayment,
  } = useStripe();

  const {
    visible,
    onRequestClose,
    nftId,
    price,
    priceInDollar,
    chain,
    ownerId,
    onPaymentDone,
    baseCurrency,
    collectionAddress,
  } = props;
  const [opacity, setOpacity] = useState(0.88);
  const [loading, setLoading] = useState(false);
  // const [selectedMethod, setSelectedMethod] = useState(null);
  // const [redirectURL, setRedirectURL] = useState('');

  const getTitle = () => {
    let title = '';
    if (paymentObject) {
      if (paymentObject.type == 'card') {
        title = translate('wallet.common.payByCreditCard');
      } else if (paymentObject.type == 'wallet') {
        title = translate('wallet.common.payByWallet');
      }
    }
    return title;
  };

  const nftErrorMessage = message => {
    let msg = '';
    if (message === 'NFT not on sell') {
      msg = translate('common.nftNotOnSell');
    } else {
      msg = message;
    }
    return msg;
  };

  const _getPaymentIntent = () => {
    const params = {
      cardId: paymentObject.item.id,
      nftId: nftId,
      chainType: chain || 'bsc',
    };
    console.log('params', params);
    dispatch(getPaymentIntent(userData.access_token, params))
      .then(async res => {
        console.log('108 _getPaymentIntent :res', res);
        if (res.success) {
          _confirmPayment(res.data.id, res.data.client_secret);
          console.log(
            '131_getPaymentIntent: response',
            res.data.id,
            res.data.client_secret,
          );
        } else {
          if (res.error) {
            alertWithSingleBtn(translate('common.amountMoreThan'));
          } else {
            alertWithSingleBtn(nftErrorMessage(res.data));
          }
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const _confirmPayment = (paymentIntentId, clientSecret) => {
    const params = {
      // return_url: "https://testnet.xanalia.com/",
      expected_payment_method_type: 'card',
      use_stripe_sdk: true,
      // webauthn_uvpa_available: false,
      // spc_eligible: false,
      key: environment.stripeKey.p_key,
      client_secret: clientSecret,
    };
    console.log(params, '162_confirmPayment');
    StripeApiRequest(`payment_intents/${paymentIntentId}/confirm`, params)
      .then(response => {
        console.log('165_confirmPayment response', response);
        if (response) {
          if (response.status === 'requires_action') {
            manageOnRequireAction(response.client_secret);
            // setRedirectURL(response.next_action.use_stripe_sdk.stripe_js);
          } else {
            chargePayment(response.id, response.client_secret);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const chargePayment = (paymentIntentId, clientSecret) => {
    const url = `payment_intents/${paymentIntentId}?key=${environment.stripeKey.p_key}&is_stripe_sdk=false&client_secret=${clientSecret}`;
    console.log('url', url);
    StripeApiRequest(url, null, 'GET')
      .then(_response => {
        console.log('188 chargePayment: _response', _response);
        if (_response.status === 'requires_action') {
          manageOnRequireAction(clientSecret);
        } else {
          checkPaymentStatus(paymentIntentId);
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const manageOnRequireAction = async payment_intent_client_secret => {
    const {error, paymentIntent} = await handleCardAction(
      payment_intent_client_secret,
    );
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      setLoading(false);
    } else if (paymentIntent) {
      console.log('209 manageOnRequireAction', paymentIntent);
      checkPaymentStatus(paymentIntent.id);
    }
  };

  const checkPaymentStatus = paymentIntentId => {
    const params = {
      nftId: nftId,
      paymentIntentId: paymentIntentId,
      chainType: chain || 'bsc',
    };

    dispatch(getTransactionHash(userData.access_token, params))
      .then(_hash_res => {
        console.log('223 CheckPaymentStatus: _hash_res', _hash_res);
        if (_hash_res.success) {
          transactionSuccess(_hash_res.data.transactionHash);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const transactionSuccess = trans_hash => {
    const params = {
      transactionHash: trans_hash,
      locale: 'en',
      chainType: chain || 'bsc',
      previousOwnerId: '', // ownerId
    };

    dispatch(updateTransactionSuccess(userData.access_token, params))
      .then(success_res => {
        console.log('246 transactionSuccess: success_res', success_res);
        if (success_res.success) {
          alertWithSingleBtn(translate('common.tansactionSuccessFull'));
        } else {
          alertWithSingleBtn(success_res.data);
        }
        onPaymentDone();
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const payByWallet = async () => {
    try {
      console.log('paymentObject', paymentObject, buyNFTRes);

      const approveAllData = buyNFTRes?.dataReturn?.approveAllData;
      const approveData = buyNFTRes?.dataReturn?.approveData;
      const signData = buyNFTRes?.dataReturn?.signData;
      if (approveAllData) {
        console.log(
          '🚀 ~ file: detail.js ~ line 1856 ~ handleBuyNft ~ approveAllData',
          approveAllData,
        );
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
              console.log('approve payByWallet 331', res);
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
            style={{alignSelf: 'flex-end'}}
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

          <View
            style={[
              styles.valueContainer,
              {
                alignItems:
                  paymentObject && paymentObject.type == 'card'
                    ? 'flex-start'
                    : 'baseline',
              },
            ]}>
            {paymentObject && paymentObject.type == 'card' && (
              <Text style={styles.symbol}>{'$ '} </Text>
            )}
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

          {paymentObject && paymentObject.type == 'card' && (
            <Separator style={styles.separator} />
          )}

          {paymentObject && paymentObject.type == 'card' && (
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, {textTransform: 'uppercase'}]}>
                {translate('wallet.common.topup.creditCard')}
              </Text>
              {paymentObject && (
                <Text style={styles.cardNumber}>
                  {
                    formatWithMask({
                      text: `424242424242${paymentObject.item.last4}`,
                      mask: CARD_MASK,
                    }).obfuscated
                  }
                </Text>
              )}
              <TouchableOpacity
                style={styles.editContainer}
                onPress={() => {
                  navigation.navigate('Cards', {price});
                  onRequestClose();
                }}>
                <Image
                  source={ImagesSrc.edit}
                  style={CommonStyles.imageStyles(3)}
                />
              </TouchableOpacity>
            </View>
          )}

          <Separator style={styles.separator} />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              {paymentObject && translate('wallet.common.total')}
            </Text>
            <Text style={styles.value}>
              {paymentObject && paymentObject.type == 'card' ? '$' : ''}{' '}
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
                if (paymentObject.type == 'card') {
                  _getPaymentIntent();
                } else if (paymentObject.type == 'wallet') {
                  payByWallet();
                }
              }
            }}
            loading={loading}
            view={loading}
          />
        </View>
        <SafeAreaView style={{backgroundColor: Colors.white}} />
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
