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
  ActivityIndicator,
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
  getGasLimit,
  getSignData,
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
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: !props.editable ? Colors.WHITE2 : Colors.WHITE1,
          },
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
        <TouchableOpacity
          activeOpacity={1}
          disabled={props.alertMessage.isInsufficientFund || props.alertMessage.gasFeeAlert || !props.editable}
          style={[
            styles.maxContainer,
            {
              backgroundColor: (props.alertMessage.isInsufficientFund || props.alertMessage.gasFeeAlert || !props.editable) ? Colors.GREY6 : Colors.BLUE2,
              borderColor: (props.alertMessage.isInsufficientFund || props.alertMessage.gasFeeAlert || !props.editable) ? Colors.GREY6 : Colors.BLUE2,
            },
          ]}
          onPress={props.onPressMax}>
          <Text style={{ color: Colors.WHITE1, textTransform: 'uppercase' }}>
            {translate('common.max')}
          </Text>
        </TouchableOpacity>
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

  const config = getConfigDetailsFromEnviorment(networkType?.name, type);

  const web3 = new Web3(new Web3.providers.HttpProvider(config.rpcURL));

  //====================== States Initiliazation =========================
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(props.address);
  const [amount, setAmount] = useState(props.amount);
  const [networkConfig, setNetworkConfig] = useState(config);
  const [gasPrice, setGasPrice] = useState(0);
  const [gasFee, setGasFee] = useState(0);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    isAddressInvalid: false,
    isPaymentFielDisable: false,
    isInsufficientFund: false,
    isButtonDisable: true,
    gasFeeAlert: false,
    networkFeeShow: false,
  });

  //==================== Global Variables =======================
  let gasFeeAlert = null;

  //====================== Use Effect Start =========================
  useEffect(async () => {
    let walletAddress = await getWallet();
    const gasPrice = await getGasPrice(networkConfig.rpcURL);
    console.log('@@@ Gas price=======>', gasPrice);
    if (isSelftToken()) {
      const gasFee = web3.utils.fromWei((gasPrice * 21000).toString(), 'ether',);
      console.log('@@@ Gas Fee self =======>', gasFee);
      setGasFee(gasFee);
    }
    setWallet(walletAddress);
    setGasPrice(gasPrice);
  }, []);

  useEffect(() => {
    setAddress(props.address);
    setAmount(props.amount);
  }, [props.address, props.amount]);

  useEffect(() => {
    let timerOut = setTimeout(() => {
      if (address) {
        verifyAddress(address)
          .then(() => {
            setAlertMessage({ ...alertMessage, isPaymentFielDisable: true });
          })
          .catch(() => {
            console.log("@@@ address verify=====>", alertMessage)
            setAlertMessage({ ...alertMessage, isPaymentFielDisable: false, isAddressInvalid: true });
          });
      }
    }, 500);

    return () => clearTimeout(timerOut);
  }, [address]);

  useEffect(async () => {
    let signData;
    let txCount;
    let timerAmountOut = setTimeout(() => {
      try {
        return new Promise(async (resolve, reject) => {
          txCount = await web3.eth.getTransactionCount(
            wallet?.address,
            'pending',
          );
          if (
            !isSelftToken() &&
            amount && !alertMessage.isInsufficientFund && !alertMessage.gasFeeAlert &&
            Number(amount) > 0 &&
            Number(amount) <= Number(getTokenBalance())
          ) {
            const transferParameters = {
              publicAddress: wallet?.address,
              amount: amount,
              toAddress: address,
              tokenType: type,
            };
            signData = getSignData(
              transferParameters,
              networkConfig,
              web3,
              reject,
            );
            console.log('@@@ Getting sign data ========>', signData);
            if (!signData) return;
            const data = {
              from: transferParameters.publicAddress,
              to: networkConfig.ContractAddress,
              data: signData,
              nonce: web3.utils.toHex(txCount),
            };
            const gasLimit = await getGasLimit(data, networkConfig.rpcURL);
            console.log('@@@ Gas limit after signdata =======>', gasLimit);
            const gasFee = web3.utils.fromWei(
              (gasPrice * gasLimit).toString(),
              'ether',
            );
            console.log('@@@ Gas Fee  =======>', gasFee);
            setGasFee(gasFee);
          }
        });
      } catch (error) {
        console.log('@@@ Getting Sign data error 1111 ============>', error);
      }
    }, 1000);

    return () => clearTimeout(timerAmountOut);
  }, [amount]);

  useEffect(() => {
    if (isSelftToken()) {
      //For Self Token
      if (getTokenBalance() === 0 || Number(amount) >= Number(getTokenBalance())) {
        setAlertMessage({
          ...alertMessage,
          isInsufficientFund: true,
          isButtonDisable: true,
          networkFeeShow: false,
        });
      } else if (Number(gasFee) >= Number(getTokenBalance())) {
        console.log("@@@ Self token gas fee check ========>", gasFee, Number(gasFee), Number(getTokenBalance()))
        setAlertMessage({
          ...alertMessage,
          gasFeeAlert: true,
          isButtonDisable: true,
          isInsufficientFund: false,
        });
      } else if (address && Number(amount) > 0 && Number(amount) < Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({
          ...alertMessage,
          networkFeeShow: true,
          isInsufficientFund: false,
          isButtonDisable: false,
        });
      } else if (Number(amount) > 0 && Number(amount) < Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        setAlertMessage({
          ...alertMessage,
          networkFeeShow: true,
          isInsufficientFund: false,
          isButtonDisable: true,
        });
      } else if (!address || Number(amount) === 0) {
        setAlertMessage({
          ...alertMessage,
          isButtonDisable: true,
          isInsufficientFund: false,
          networkFeeShow: false,
        });
      }
    } else {
      //For ERC-20 Token
      if (getTokenBalance() === 0 || Number(amount) > Number(getTokenBalance())) {
        console.log("@@@ Alert message (ERC-20) 1111 ===========>")
        setAlertMessage({
          ...alertMessage,
          isInsufficientFund: true,
          isButtonDisable: true,
          networkFeeShow: false,
        });
      } else if (Number(getSelfTokenBalance(item?.network)) === 0 || Number(gasFee) > getSelfTokenBalance(item?.network)) {
        console.log("@@@ Alert message (ERC-20) 2222 ===========>")
        setAlertMessage({
          ...alertMessage,
          gasFeeAlert: true,
          isButtonDisable: true,
          isInsufficientFund: false,
        });
      } else if (address && Number(amount) > 0 && Number(amount) <= Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        console.log("@@@ Alert message (ERC-20) 3333 ===========>")
        setAlertMessage({
          ...alertMessage,
          networkFeeShow: true,
          isInsufficientFund: false,
          isButtonDisable: false,
        });
      } else if (Number(amount) > 0 && Number(amount) <= Number(getTokenBalance()) && !alertMessage.gasFeeAlert) {
        console.log("@@@ Alert message (ERC-20) 4444 ===========>")
        setAlertMessage({
          ...alertMessage,
          networkFeeShow: true,
          isInsufficientFund: false,
          isButtonDisable: true,
        });
      } else if (!address || Number(amount) === 0) {
        console.log("@@@ Alert message (ERC-20) 5555 ===========>")
        setAlertMessage({
          ...alertMessage,
          isInsufficientFund: false,
          isButtonDisable: true,
          networkFeeShow: false,
          gasFeeAlert: false,
        });
      }
    }
  }, [amount, address, gasFee]);

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

  const OnPressMax = () => {
    if (isSelftToken()) {
      const maxAmount = (getTokenBalance() - Number(gasFee)).toFixed(7);
      setAmount((maxAmount.toString()))
    } else {
      setAmount(getTokenBalance().toString())
    }
  }

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
              onChangeText={val => {
                setAddress(val);
                setAlertMessage({ ...alertMessage, isAddressInvalid: false });
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
              editable={alertMessage.isPaymentFielDisable}
              alertMessage={alertMessage}
              onChangeText={e => {
                let value = amountValidation(e, amount);
                if (value) {
                  setAmount(value);
                } else {
                  setAmount('');
                }
              }}
              onPressMax={() => OnPressMax()}
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
            {alertMessage.networkFeeShow && gasFee !== 0 && (
              <View style={styles.gasFeeTextContainer}>
                <Text style={styles.gasFeeText}>
                  + {translate('common.NETWORK_GAS_FEE')}
                </Text>
                <Text style={{ color: Colors.GREY4, fontSize: RF(1.6) }}>
                  {Number(gasFee).toFixed(8)} {tokenInfo.tokenName}
                </Text>
              </View>
            )}
          </View>
          <View style={{ marginTop: hp('2.5%') }}>
            <Text style={styles.inputLeft}>
              {translate('common.TOTAL_AMOUNT_GAS_FEE')}
            </Text>
            <View style={styles.totalAmountContainer}>
              {alertMessage.networkFeeShow && gasFee !== 0 ? (
                <Text style={[styles.priceCont, { marginRight: hp('1%') }]}>
                  {(Number(amount) + Number(gasFee)).toFixed(8)}{' '}
                  {tokenInfo.tokenName}
                </Text>
              ) : amount &&
                Number(amount) > 0 &&
                !alertMessage.isInsufficientFund && !alertMessage.gasFeeAlert ? (
                <ActivityIndicator
                  style={{ marginRight: hp('1%') }}
                  color={Colors.BLUE1}
                />
              ) : null}
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
    justifyContent: 'space-between',
    marginVertical: hp('1%'),
  },
  gasFeeText: {
    color: Colors.GREY4,
    fontSize: RF(1.6),
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
  maxContainer: {
    height: hp('5.5%'),
    width: wp('18%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomRightRadius: hp('1%'),
    borderTopRightRadius: hp('1%'),
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
