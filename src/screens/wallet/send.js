import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { RF, hp, wp } from '../../constants/responsiveFunct';
import {
  translate,
  amountValidation,
  environment,
  processScanResult,
  SCAN_WALLET,
  getConfigDetailsFromEnviorment,
} from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { transfer } from './functions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';
import { openSettings } from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { height } = Dimensions.get('window');
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';
import { getWallet } from '../../helpers/AxiosApiRequest';
import {
  balanceTransfer,
  handleTransactionError,
  getGasPrice,
} from '../wallet/functions/transactionFunctions';
import AppModal from '../../components/appModal';
import SuccessModalContent from '../../components/successModal';


const verifyAddress = address => {
  return new Promise((resolve, reject) => {
    const isVerified = Web3.utils.isAddress(address);
    if (isVerified) {
      resolve();
    } else {
      reject();
    }
  });
};

const showErrorAlert = msg => {
  alertWithSingleBtn(translate('common.error'), msg);
};

export const AddressField = props => {
  return (
    <View>
      <Text style={styles.inputLeft}>
        {translate('wallet.common.walletAddress')}
      </Text>
      <View style={styles.inputMainCont}>
        <TextInput
          style={[styles.inputCont, styles.paymentField, { fontSize: RF(1.8) }]}
          placeholder={translate('common.TRANSACTION_ENTER_WALLET_ADDRESS')}
          placeholderTextColor={Colors.GREY4}
          returnKeyType="done"
          value={props.value}
          onChangeText={val => props.onChangeText(val)}
          onSubmitEditing={props.onSubmitEditing}
          editable={props.editable}
        />
      </View>
    </View>
  );
};

export const PaymentField = props => {
  return (
    <View>
      <Text style={styles.inputLeft}>{translate('common.SEND_QUANTITY')}</Text>
      <View
        style={[
          styles.inputMainCont,
          { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: !props.editable ? Colors.WHITE2 : Colors.WHITE1 },
        ]}>
        <TextInput
          style={[styles.inputCont, styles.paymentField, { fontSize: RF(1.8) }]}
          keyboardType="decimal-pad"
          placeholder={translate('common.TRANSACTION_ENTER_AMOUNT')}
          placeholderTextColor={Colors.GREY4}
          returnKeyType="done"
          value={props.value}
          onChangeText={props.onChangeText}
          onSubmitEditing={props.onSubmitEditing}
          editable={props.editable}
        />
        <Text style={styles.inputRight}>{props.type}</Text>
      </View>
    </View>
  );
};

//*************************************************************************/
//=========================Scan Screen Start ==============================
/*************************************************************************/
const ScanScreen = React.memo(props => {
  let refScanner = null;
  const { camera } = useSelector(state => state.PermissionReducer);
  const dispatch = useDispatch();
  const { jumpTo, setResult, position } = props;

  const [isActive, setIsActive] = useState(false);

  useEffect(async () => {
    if (position == 1) {
      await checkCameraPermission();
      setIsActive(true);
    }
  }, [position, camera]);

  const checkCameraPermission = async () => {
    const granted = await Permission.checkPermission(PERMISSION_TYPE.camera);
    if (!granted) {
      const requestPer = await Permission.requestPermission(
        PERMISSION_TYPE.camera,
      );
      if (requestPer == false) {
        confirmationAlert(
          translate('wallet.common.cameraPermissionHeader'),
          translate('wallet.common.cameraPermissionMessage'),
          translate('common.Cancel'),
          translate('wallet.common.settings'),
          () => openSettings(),
          () => null,
        );
      }
      return;
    }
  };

  const onSuccess = e => {
    processScanResult(e, SCAN_WALLET)
      .then(result => {
        setIsActive(false);
        if (result.walletAddress) {
          verifyAddress(result.walletAddress)
            .then(() => {
              setResult(result.walletAddress, result.amount);
              jumpTo('Send');
            })
            .catch(() => {
              alertWithSingleBtn(
                translate('wallet.common.error.invalidCode'),
                translate('wallet.common.error.scanCodeAlert'),
                () => {
                  refScanner && refScanner.reactivate();
                },
              );
            });
        }
      })
      .catch(() => {
        alertWithSingleBtn(
          translate('wallet.common.error.invalidCode'),
          translate('wallet.common.error.scanCodeAlert'),
          () => {
            refScanner && refScanner.reactivate();
          },
        );
      });
  };

  const cameraNotAuthView = () => {
    return (
      <View style={CommonStyles.center}>
        <Text style={styles.cameraNotAuth}>
          {translate('wallet.common.cameraNotAuth')}
        </Text>
      </View>
    );
  };
  console;
  return (
    <View style={[styles.scene]}>
      {isActive ? (
        <QRCodeScanner
          reactivate={isActive}
          containerStyle={styles.cameraContainer}
          ref={scanner => (refScanner = scanner)}
          onRead={onSuccess}
          showMarker={true}
          cameraProps={{
            notAuthorizedView: cameraNotAuthView(),
          }}
          notAuthorizedView={cameraNotAuthView()}
          checkAndroid6Permissions={true}
          customMarker={
            <TouchableOpacity disabled style={{ zIndex: 1000 }}>
              <Image
                style={styles.scanStyle}
                source={ImagesSrc.scanRectangle}
              />
            </TouchableOpacity>
          }
          cameraStyle={styles.qrCameraStyle}
          topViewStyle={{ flex: 0 }}
          bottomViewStyle={{ flex: 0 }}
          vibrate={isActive}
        />
      ) : null}
    </View>
  );
});

/*************************************************************************/
//=========================SendScreen Start ==============================
/*************************************************************************/
const SendScreen = React.memo(props => {
  const navigation = useNavigation();
  //====================== Props Destructuring =========================
  const { item, type, tokenInfo, setLoading, loading } = props;

  //====================== Getting data from reducers =========================
  const { userData } = useSelector(state => state.UserReducer);
  const {
    ethBalance,
    bnbBalance,
    maticBalance,
    tnftBalance,
    talBalance,
    busdBalance,
    usdtBalance,
    usdcBalance,
    wethBalance,
    xetaBalance,
    networkType,
  } = useSelector(state => state.WalletReducer);

  //====================== States Initiliazation =========================
  const [address, setAddress] = useState(props.address);
  const [amount, setAmount] = useState(props.amount);
  const [networkConfig, setNetworkConfig] = useState(null);
  const [gasFee, setGasFee] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    isAddressInvalid: false,
    isInsufficientFund: false,
    isButtonDisable: true,
    gasFeeAlert: false,
    networkFeeShow: false
  });

  //==================== Global Variables =======================
  let wallet = null;
  let gasFeeAlert = null;

  //====================== Use Effect Start =========================
  useEffect(async () => {
    wallet = await getWallet();
    const config = getConfigDetailsFromEnviorment(networkType?.name, type);

    const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcURL));

    const gasPrice = await getGasPrice(config.rpcURL);

    const gasLimit = await web3.eth.estimateGas({
      to: '0x0a7ed0fb11c8d86abfa022a74c3d425312bc3483',
      from: '0x3cc51779881e3723d5aa23a2adf0b215124a177d',
      value: web3.utils.toWei('0.001', 'ether'),
    });

    const gasFee = web3.utils.fromWei(gasPrice, 'ether') * gasLimit;
    // console.log("@@@ Token Name ======>", type)
    // console.log("@@@ gas price ======>", gasPrice)
    // console.log("@@@ gas price conver ======>", web3.utils.fromWei(gasPrice, 'ether'))
    // console.log("@@@ gas limit ======>", gasLimit)
    // console.log("@@@ gas Fee 1111======>", web3.utils.fromWei((gasPrice * gasLimit).toString(), 'ether'))
    // console.log("@@@ gas Fee convert 2222======>", web3.utils.fromWei(gasPrice, 'ether') * gasLimit)

    setGasFee(gasFee);
    setNetworkConfig(config);
  }, []);

  useEffect(() => {
    setAddress(props.address);
    setAmount(props.amount);
  }, [props.address, props.amount]);

  useEffect(() => {
    let timerOut = setTimeout(() => {
      if (address) {
        verifyAddress(address)
          .then(() => { })
          .catch(() => {
            setAlertMessage({ ...alertMessage, isAddressInvalid: true })
          });
      } else {
        setAlertMessage({ ...alertMessage, isAddressInvalid: false })
      }
    }, 800);

    return () => clearTimeout(timerOut)
  }, [address])


  useEffect(() => {
    if (isSelftToken()) {
      //For Self Token 
      if (getTokenBalance() === 0 || Number(amount) >= Number(getTokenBalance())) {
        setAlertMessage({ ...alertMessage, isInsufficientFund: true, isButtonDisable: true, networkFeeShow: false, })
      } else if (gasFee >= getTokenBalance()) {
        setAlertMessage({ ...alertMessage, gasFeeAlert: true, isInsufficientFund: false })
      } else if (address && Number(amount) > 0 && Number(amount) < Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({ ...alertMessage, networkFeeShow: true, isInsufficientFund: false, isButtonDisable: false, })
      } else if (Number(amount) > 0 && Number(amount) < Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({ ...alertMessage, networkFeeShow: true, isInsufficientFund: false, isButtonDisable: true, })
      } else if (!address || Number(amount) === 0) {
        setAlertMessage({ ...alertMessage, isButtonDisable: true, isInsufficientFund: false, networkFeeShow: false, })
      }
    } else {
      //For ERC-20 Token 
      if (getTokenBalance() === 0 || Number(amount) > Number(getTokenBalance())) {
        setAlertMessage({ ...alertMessage, isInsufficientFund: true, isButtonDisable: true, networkFeeShow: false, });
      } else if (Number(getSelfTokenBalance(item?.network)) === 0 || gasFee >= getSelfTokenBalance(item?.network)) {
        setAlertMessage({ ...alertMessage, gasFeeAlert: true, isInsufficientFund: false })
      } else if (address && Number(amount) > 0 && Number(amount) <= Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({ ...alertMessage, networkFeeShow: true, isInsufficientFund: false, isButtonDisable: false, })
      } else if (Number(amount) > 0 && Number(amount) <= Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({ ...alertMessage, networkFeeShow: true, isInsufficientFund: false, isButtonDisable: true, })
      } else if (!address || Number(amount) === 0) {
        setAlertMessage({ ...alertMessage, isInsufficientFund: false, isButtonDisable: true, networkFeeShow: false, gasFeeAlert: false })
      }
    }
  }, [amount, address])

  const getSelfTokenBalance = type => {
    let tokenValue = 0;
    if (type == 'Ethereum') {
      let value = parseFloat(ethBalance);
      tokenValue = value;
    } else if (type == 'BSC') {
      let value = parseFloat(bnbBalance);
      tokenValue = value;
    } else if (type == 'Polygon') {
      let value = parseFloat(maticBalance);
      tokenValue = value;
    } else if (type == 'XANA CHAIN') {
      let value = parseFloat(xetaBalance);
      tokenValue = value;
    }
    return tokenValue;
  };

  const isSelftToken = () => {
    if (type !== 'ETH' && type !== 'BNB' && type !== 'Matic') {
      return false;
    } else {
      return true;
    }
  };

  const getTokenBalance = () => {
    let totalValue = 0;
    if (item.type == 'ETH' && item.network !== 'Polygon') {
      let value = parseFloat(ethBalance);
      // console.log('Ethereum value', value);
      totalValue = value;
    } else if (item.type == 'BNB') {
      let value = parseFloat(bnbBalance);
      // console.log('BSC value', value);
      totalValue = value;
    } else if (item.type == 'BUSD') {
      let value = parseFloat(busdBalance);
      // console.log('BUSD value', value);
      totalValue = value;
    } else if (item.type == 'USDT') {
      let value = parseFloat(usdtBalance);
      // console.log('USDT value', value);
      totalValue = value;
    } else if (item.type == 'Matic') {
      let value = parseFloat(maticBalance);
      // console.log('Polygon value', value);
      totalValue = value;
    } else if (item.type == 'TNFT') {
      let value = parseFloat(tnftBalance);
      // console.log('Polygon value', value);
      totalValue = value;
    } else if (item.type == 'TAL') {
      let value = parseFloat(talBalance);
      // console.log('Polygon value', value);
      totalValue = value;
    } else if (item.type == 'USDC') {
      let value = parseFloat(usdcBalance);
      // console.log('Polygon value', value);
      totalValue = value;
    } else if (item.type == 'WETH' && item.network === 'Polygon') {
      let value = parseFloat(wethBalance);
      // console.log('Polygon value', value);
      totalValue = value;
    } else if (item.network === 'BSC' && item.type == 'ALIA') {
      // console.log("Item network", item.network)
      let value = parseFloat(tnftBalance);
      totalValue = value;
    } else if (item.network === 'Polygon' && item.type == 'ALIA') {
      // console.log("Item network", item.network)
      let value = parseFloat(talBalance);
      totalValue = value;
      // console.log("Total value is ", totalValue)
    } else if (item.network === 'XANA CHAIN' && item.type == 'XETA') {
      // console.log("Item network", item.network)
      let value = parseFloat(xetaBalance);
      totalValue = value;
      // console.log("Total value is ", totalValue)
    }
    return totalValue;
  };

  const transferAmount = async () => {
    let wallet = await getWallet();
    const { item, type, setLoading } = props;

    const transferParameters = {
      publicAddress: wallet?.address,
      privKey: wallet?.privateKey,
      amount: amount,
      toAddress: address,
      tokenType: type,
      chainType: networkType?.name,
      chainId: networkType?.chainId,
      networkId: networkType?.id,
    };
    setLoading(true);
    // const config = getConfigDetailsFromEnviorment(networkType?.name, type);

    balanceTransfer(transferParameters, networkConfig)
      .then(transferResponse => {
        setLoading(false);
        if (transferResponse?.success) {
          setSuccessModalVisible(true);
        }
      })
      .catch(err => {
        console.log('@@@ balance transfrer error =====>', err);
        setLoading(false);
        handleTransactionError(err);
      });
  };

  // const showSuccessAlert = () => {
  //   Alert.alert(
  //     translate('wallet.common.transferInProgress', {
  //       token: `${amount} ${type}`,
  //     }),
  //     translate('wallet.common.reflectInHistory', { token: `${amount} ${type}` }),
  //     [
  //       {
  //         text: 'OK',
  //         onPress: () => {
  //           navigation.popToTop();
  //         },
  //       },
  //     ],
  //   );
  // };

  const closeSuccess = () => {
    setSuccessModalVisible(false);
    navigation.popToTop();
  };

  const decimalDigitAlert =
    (amount && amount.includes('.') && amount?.split('.')[1]?.length) >= 8
      ? true
      : false;

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.balanceContainer}>
            <View style={styles.profileCont}>
              <Image style={styles.profileImage} source={item.icon} />
            </View>
            <View>
              <Text style={styles.balanceText}>
                {translate('common.AliaBalance')}
              </Text>
              <NumberFormat
                value={getTokenBalance()}
                displayType={'text'}
                decimalScale={8}
                thousandSeparator={true}
                renderText={formattedValue => (
                  <TextView style={styles.priceCont}>
                    {formattedValue} {type}
                  </TextView>
                )}
              />
              <NumberFormat
                value={tokenInfo.tokenDollarValue}
                displayType={'text'}
                decimalScale={4}
                thousandSeparator={true}
                renderText={formattedValue => (
                  <TextView style={styles.balanceText}>
                    {`($${formattedValue})`}
                  </TextView>
                )}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <AddressField
              onChangeText={(val) => {
                setAddress(val)
                setAlertMessage({ ...alertMessage, isAddressInvalid: false })
              }}
              onSubmitEditing={txt => {
                // verifyAddress(txt);
              }}
              value={address}
            />
            {alertMessage.isAddressInvalid && (
              <View>
                <Text style={styles.alertText}>
                  {translate('wallet.common.invalidAddress')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <PaymentField
              type={type}
              value={amount}
              editable={!address ? false : true}
              onChangeText={e => {
                let value = amountValidation(e, amount);
                if (value) {
                  setAmount(value);
                } else {
                  setAmount('');
                }
              }}
            />
            {alertMessage.isInsufficientFund && (
              <View>
                <Text style={styles.alertText}>
                  {translate('wallet.common.insufficientFunds')}
                </Text>
              </View>
            )}
            {decimalDigitAlert && (
              <View>
                <Text style={styles.alertText}>
                  {translate('common.DECIMAL_POINTS_LIMIT')}
                </Text>
              </View>
            )}
            {!alertMessage.isInsufficientFund && alertMessage.gasFeeAlert && (
              <View>
                <Text style={styles.alertText}>
                  {translate('common.INSUFFICIENT_FUND_FOR_GAS') +
                    ' ' +
                    tokenInfo.tokenName +
                    ' ' +
                    translate('common.IS_REQUIRED')}
                </Text>
              </View>
            )}
            {alertMessage.networkFeeShow && (
              <View style={styles.gasFeeTextContainer}>
                <Text style={styles.gasFeeText}>
                  + {translate('common.NETWORK_GAS_FEE')}
                </Text>
                <Text style={{ color: Colors.GREY4, fontSize: RF(1.6) }}>
                  {gasFee} {tokenInfo.tokenName}
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginTop: hp('2.5%') }}>
            <Text style={styles.inputLeft}>
              {translate('common.TOTAL_AMOUNT_GAS_FEE')}
            </Text>
            <View style={styles.totalAmountContainer}>
              {alertMessage.networkFeeShow && (
                <Text style={[styles.priceCont, { marginRight: hp('1%') }]}>
                  {Number(amount) + gasFee} {tokenInfo.tokenName}
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ justifyContent: 'flex-end' }}>
        <AppButton
          label={translate('wallet.common.send')}
          // view={loading}
          view={alertMessage.isButtonDisable}
          containerStyle={CommonStyles.button}
          labelStyle={CommonStyles.buttonLabel}
          onPress={() => {
            if (address && address !== '' && amount > 0) {
              if (parseFloat(amount) <= parseFloat(`${item.tokenValue}`)) {
                // setLoading(true);
                verifyAddress(address)
                  .then(() => {
                    transferAmount();
                  })
                  .catch(() => {
                    showErrorAlert(translate('wallet.common.invalidAddress'));
                    setLoading(false);
                  });
              } else {
                showErrorAlert(translate('wallet.common.insufficientFunds'));
              }
            } else {
              showErrorAlert(translate('wallet.common.requireSendField'));
            }
          }}
        />
      </View>
      <AppModal visible={successModalVisible} onRequestClose={closeSuccess}>
        <SuccessModalContent
          onClose={closeSuccess}
          onDonePress={closeSuccess}
          sucessMsg={translate('common.TRANSACTION_SENT_NETWORK')}
          transactionDone={true}
        />
      </AppModal>
    </View>
  );
});

//*************************************************************************/
//=========================Send Screen Start ==============================
/*************************************************************************/
const Send = ({ route, navigation }) => {
  //================= Props Destructuring =============================
  const { item, type, tokenInfo } = route.params;
  //================= States Initialiazation =============================
  const [loading, setLoading] = useState(false);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [amountToSend, setAmountToSend] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'Send', title: translate('wallet.common.send') },
    { key: 'Scan', title: translate('wallet.common.scan') },
  ]);

  const setResult = (address, amount) => {
    setAmountToSend(amount);
    setSendToAddress(address);
  };

  const _renderScene = ({ route, jumpTo, position }) => {
    switch (route.key) {
      case 'Send':
        return (
          <SendScreen
            setLoading={setLoading}
            item={item}
            type={type}
            tokenInfo={tokenInfo}
            loading={loading}
            address={sendToAddress}
            amount={amountToSend}
          />
        );
      case 'Scan':
        return (
          <ScanScreen
            setLoading={setLoading}
            position={index}
            loading={loading}
            setResult={setResult}
            jumpTo={jumpTo}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = props => {
    return (
      <TabBar
        {...props}
        renderLabel={({ route, focused, color }) => (
          <Text style={{ color, ...styles.tabLabel }}>{route.title}</Text>
        )}
        contentContainerStyle={{ height: 45 }}
        indicatorStyle={{ backgroundColor: Colors.scanActive }}
        style={styles.tabItem}
        inactiveColor={Colors.sectionLabel}
        activeColor={Colors.scanActive}
        lazy={true}
      />
    );
  };

  return (
    <AppBackground isBusy={loading} hideBottomSafeArea={index == 1}>
      <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}>
        <AppHeader showBackButton title={translate('wallet.common.send')} />
        <TabView
          lazy={true}
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={_renderScene}
          onIndexChange={index => {
            setIndex(index);
          }}
          style={styles.tabItem}
        />
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    padding: wp('5%'),
  },
  scene: {
    flex: 1,
  },
  tabItem: {
    backgroundColor: Colors.white,
    shadowColor: Colors.white,
  },
  tabLabel: {
    fontFamily: Fonts.ARIAL,
    fontSize: RF(1.8),
    fontWeight: 'normal',
  },
  contentContainer: {
    flex: 1,
  },
  inputContainer: {
    marginVertical: hp('1.5%'),
  },
  input: {
    padding: wp('2%'),
    backgroundColor: Colors.inputBackground,
    color: Colors.black,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: RF(2),
  },
  inputLabel: {
    fontSize: RF(2.2),
    fontWeight: 'bold',
    paddingVertical: wp('2%'),
  },
  balanceText: {
    alignSelf: 'flex-end',
    fontSize: RF(2.2),
    fontWeight: 'bold',
    color: Colors.GREY10,
  },
  alertText: {
    color: 'red',
    marginTop: hp('0.5%'),
  },
  gasFeeTextContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: hp('1%'),
  },
  gasFeeText: {
    color: Colors.GREY4,
    fontSize: RF(1.6),
    marginRight: wp('15%'),
  },
  priceCont: {
    fontSize: RF(3.4),
    color: Colors.black,
    fontWeight: 'bold',
  },
  balanceContainer: {
    paddingVertical: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileCont: {
    ...CommonStyles.circle('13'),
  },
  profileImage: {
    ...CommonStyles.imageStyles(12),
  },
  inputCont: {
    // backgroundColor: 'red',
    paddingHorizontal: wp('4%'),
    height: hp('5.5%'),
  },
  inputLeft: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(1.8)),
  },
  paymentField: {
    paddingHorizontal: wp('4%'),
    ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(1.8)),
    flex: 1,
  },
  inputRight: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.GREY4, RF(1.8)),
    marginBottom: hp('0.2%'),
    marginRight: hp('1%'),
    alignSelf: 'center',
  },
  inputBottom: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.inputBottomPayment, RF(1.6)),
    textAlign: 'right',
    marginRight: wp('1%'),
  },
  inputMainCont: {
    width: '100%',
    borderWidth: 0.5,
    borderRadius: hp('1%'),
    marginTop: hp('1%'),
    borderColor: Colors.GREY4,
  },
  totalAmountContainer: {
    borderWidth: 1,
    borderRadius: hp('1%'),
    marginTop: hp('1%'),
    height: hp('7%'),
    borderColor: Colors.GREY4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  qrCameraStyle: {
    height: '100%',
    flex: 1,
  },
  scanStyle: {
    width: wp('30%'),
    height: wp('70%'),
    resizeMode: 'contain',
  },
  rescan: {
    position: 'absolute',
    borderRadius: hp('2.5%'),
    borderWidth: 2,
    alignSelf: 'center',
    bottom: 20,
    borderColor: Colors.themeColor,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    backgroundColor: Colors.themeColor,
  },
  cameraNotAuth: {
    textAlign: 'center',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Send;
