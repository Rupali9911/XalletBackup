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
import ButtonGroup from '../buttonGroup';
import {translate, CARD_MASK, environment} from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import {useNavigation} from '@react-navigation/native';
import NotEnoughGold from './alertGoldModal';
import {useSelector, useDispatch} from 'react-redux';
import {formatWithMask} from 'react-native-mask-input';
import {
  getPaymentIntent,
  getTransactionHash,
  updateTransactionSuccess,
} from '../../store/reducer/paymentReducer';
import {useStripe} from '@stripe/stripe-react-native';
import {
  StripeApiRequest,
} from '../../helpers/ApiRequest';
import {alertWithSingleBtn} from '../../common/function';
import {
  approvebnb,
  buyNft,
  buyNftBnb,
  checkAllowance,
} from '../../screens/wallet/functions';
import {BlurView} from '@react-native-community/blur';
import {IconButton} from 'react-native-paper';
import {numberWithCommas} from '../../utils';

const PaymentNow = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {paymentObject} = useSelector(state => state.PaymentReducer);
  const {data, wallet} = useSelector(state => state.UserReducer);

  const {
    initPaymentSheet,
    presentPaymentSheet,
    handleCardAction,
    confirmPayment,
  } = useStripe();

  const {
    visible,
    onRequestClose,
    NftId,
    IdWithChain,
    price,
    priceInDollar,
    chain,
    ownerId,
    onPaymentDone,
    lastBidAmount,
    ownerAddress,
    baseCurrency,
    collectionAddress,
  } = props;
  const [opacity, setOpacity] = useState(0.88);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [notEnoughGoldVisible, setNotEnoughGoldVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectURL, setRedirectURL] = useState('');

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

  const _getPaymentIntent = () => {
    const params = {
      cardId: paymentObject.item.id,
      nftId: IdWithChain,
      chainType: chain || 'binance',
    };
    console.log('params', params);
    dispatch(getPaymentIntent(data.token, params))
      .then(async res => {
        console.log('res', res);
        if (res.success) {
          // const {error, paymentIntent} = await confirmPayment(res.data.client_secret, {
          //     type: 'Card',
          //     billingDetails: {
          //         email: "Robert@mailinator.com",
          //         name: "Robert",
          //         addressPostalCode: "123456",
          //         addressCity: "Mumbai",
          //         addressCountry: "India",
          //         addressLine1: "Mumbai",
          //         addressLine2: "",
          //         addressState: "Maharashtra"
          //     }
          // });

          // if(error){
          //     console.log('error',error);
          // }else{
          //     console.log('paymentIntent',paymentIntent);
          // }

          _confirmPayment(res.data.id, res.data.client_secret);
          // initializePaymentSheet({
          //     paymentIntent: res.data.client_secret,
          //     customer: res.data.customer
          // });
        } else {
          if (res.error) {
            // alertWithSingleBtn(translate(`common.${res.error.code}`));
            alertWithSingleBtn(res.message);
          } else {
            alertWithSingleBtn(res.data);
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
      webauthn_uvpa_available: false,
      spc_eligible: false,
      key: 'pk_test_51Jbha5Ee7q061aolrboDAHMlO4Y6eYpoHZtARZwQcFXUIu0fxFFzHjFKSTQNUnfrYO6owRxHzfECLULhV7RXZ7Zr00oa6Um1Zb',
      client_secret: clientSecret,
    };

    StripeApiRequest(`payment_intents/${paymentIntentId}/confirm`, params)
      .then(response => {
        console.log('response', JSON.stringify(response));
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
    const url = `payment_intents/${paymentIntentId}?key=${environment.stripeKey.p_key}&is_stripe_sdk=true&client_secret=${clientSecret}`;
    console.log('url', url);
    StripeApiRequest(url, null, 'GET')
      .then(_response => {
        console.log('_response', _response);
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
      console.log('paymentIntent', paymentIntent);
      checkPaymentStatus(paymentIntent.id);
    }
  };

  const checkPaymentStatus = paymentIntentId => {
    const params = {
      nftId: IdWithChain,
      paymentIntentId: paymentIntentId,
      chainType: chain || 'binance',
    };

    dispatch(getTransactionHash(data.token, params))
      .then(_hash_res => {
        console.log('_hash_res', _hash_res);
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
      chainType: chain || 'binance',
      previousOwnerId: ownerId,
    };

    dispatch(updateTransactionSuccess(data.token, params))
      .then(success_res => {
        console.log('success_res', success_res);
        if (success_res.success) {
          alertWithSingleBtn(translate('common.tansactionSuccessFull'));
          onPaymentDone();
          setLoading(false);
        } else {
          alertWithSingleBtn(success_res.data);
          onPaymentDone();
          setLoading(false);
        }
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  // const initializePaymentSheet = async (_data) => {
  //     const {
  //         paymentIntent,
  //         ephemeralKey,
  //         customer,
  //     } = _data;

  //     const { error } = await initPaymentSheet({
  //         customerId: customer,
  //         // customerEphemeralKeySecret: ephemeralKey,
  //         paymentIntentClientSecret: paymentIntent,
  //     });
  //     if (!error) {
  //         setLoading(true);
  //         openPaymentSheet(paymentIntent);
  //     }
  // };

  // const openPaymentSheet = async (clientSecret) => {
  //     console.log('clientSecret',clientSecret);
  //     const { error } = await presentPaymentSheet({ clientSecret });
  //     console.log('error',error);
  //     if (error) {
  //         // Alert.alert(`Error code: ${error.code}`, error.message);
  //         const { error, paymentIntent } = await handleCardAction(clientSecret);
  //         if (error) {
  //             Alert.alert(`Error code: ${error.code}`, error.message);
  //         } else if (paymentIntent) {
  //             console.log('paymentIntent', paymentIntent);
  //             checkPaymentStatus(paymentIntent.id);
  //         }
  //     } else {
  //         Alert.alert('Success', 'Your order is confirmed!');
  //     }
  // };

  const payByWallet = () => {
    console.log('paymentObject', paymentObject);
    if (paymentObject?.currency?.approvalRequired) {
      checkAllowance(
        wallet.address,
        chain || 'binance',
        paymentObject?.currency?.approvalAdd,
      )
        .then(async ({balance, contract}) => {
          console.log('balance', balance, lastBidAmount);

          let decimals = await contract.methods.decimals().call();
          if (parseInt(balance) / Math.pow(10, parseInt(decimals)) <= 0) {
            // if (parseFloat(`${balance}`) < parseFloat(`${lastBidAmount}`)) {
            approvebnb(
              wallet.address,
              wallet.privateKey,
              chain || 'binance',
              contract,
            )
              .then(res => {
                buyNft(
                  wallet.address,
                  wallet.privateKey,
                  NftId,
                  chain || 'binance',
                  10,
                  600000,
                  collectionAddress,
                  paymentObject?.currency?.order,
                )
                  .then(bnbBalance => {
                    console.log('approve bnbBalance', bnbBalance);
                    // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
                    onPaymentDone();
                    setLoading(false);
                  })
                  .catch(err => {
                    console.log('payByWallet_err', err);
                    setLoading(false);
                  });
              })
              .catch(err => {
                console.log('approve_err', err);
                showErrorAlert('');
                +setLoading(false);
              });
          } else {
            buyNft(
              wallet.address,
              wallet.privateKey,
              NftId,
              chain || 'binance',
              10,
              600000,
              collectionAddress,
              paymentObject?.currency?.order,
            )
              .then(bnbBalance => {
                console.log('bnbBalance', bnbBalance);
                // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
                onPaymentDone();
                setLoading(false);
              })
              .catch(err => {
                console.log('payByWallet_err', err);
                setLoading(false);
                showErrorAlert('');
                setLoading(false);
              });
          }
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
        });
    } else {
      _buyNFTBnb();
    }
  };

  const _buyNFTBnb = async () => {
    let addedFivePercent = paymentObject.priceInToken;
    if (!baseCurrency?.chainCurrency && paymentObject.currency.chainCurrency) {
      let percetile = (parseFloat(paymentObject.priceInToken) / 100) * 5;
      addedFivePercent = (
        parseFloat(paymentObject.priceInToken) + parseFloat(percetile)
      ).toFixed(18);
    }
    console.log('fixed', addedFivePercent, collectionAddress);
    buyNftBnb(
      wallet.address,
      wallet.privateKey,
      NftId,
      chain || 'binance',
      10,
      600000,
      collectionAddress,
      addedFivePercent,
    )
      .then(bnbBalance => {
        console.log('_bnbBalance', bnbBalance);
        // alertWithSingleBtn('',translate('common.tansactionSuccessFull'));
        onPaymentDone();
        setLoading(false);
      })
      .catch(err => {
        console.log('payByWallet_err', err);
        setLoading(false);
        showErrorAlert('');
      });
  };

  const showErrorAlert = msg => {
    alertWithSingleBtn(translate('common.error'), msg);
  };

  console.log('============paymentObject', paymentObject);

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
              <Text style={styles.symbol}>{'$'} </Text>
            )}
            <Text numberOfLines={1} style={styles.amount}>
              {numberWithCommas(Number(paymentObject && paymentObject.type == 'wallet'
                ? paymentObject.priceInToken
                : priceInDollar || 0).toFixed(4))}
            </Text>
            {paymentObject && paymentObject.type !== 'card' && (
              <Text style={styles.symbol}>
                {paymentObject && paymentObject.type == 'wallet'
                  ? `${paymentObject.item.type} `
                  : 'GOLD'}
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
              {paymentObject && paymentObject.type == 'card'
                ? translate('wallet.common.total')
                : translate('wallet.common.priceIn', {
                    type:
                      paymentObject && paymentObject.type == 'wallet'
                        ? paymentObject.item.type
                        : 'GOLD',
                  })}
            </Text>
            <Text style={styles.value}>
              {paymentObject && paymentObject.type == 'card'
                ? '$'
                : paymentObject && paymentObject.type == 'wallet'
                ? `${paymentObject.item.type}`
                : ''}{' '}
              {paymentObject && paymentObject.type == 'wallet'
                ? paymentObject.priceInToken
                : numberWithCommas(Number(priceInDollar).toFixed(4)) || 0}
            </Text>
          </View>

          {selectedMethod == 2 && (
            <Text style={styles.goldValue}>
              <Image source={ImagesSrc.goldcoin} /> {price}
            </Text>
          )}

          <AppButton
            label={translate('common.buyNext')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              if (NftId && paymentObject) {
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
      <NotEnoughGold
        visible={notEnoughGoldVisible}
        onNavigate={() => {
          onRequestClose();
          setNotEnoughGoldVisible(false);
        }}
        onRequestClose={() => {
          setNotEnoughGoldVisible(false);
        }}
      />
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
    // marginBottom: hp("1%"),
    marginVertical: hp('2.5%'),
  },
  separator: {
    width: wp('100%'),
    // marginVertical: hp("2%")
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
  goldValue: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
    alignSelf: 'flex-end',
    marginBottom: hp('1%'),
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
