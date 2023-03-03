import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import {SvgWithCssUri} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {SIZE} from 'src/constants';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import GradientBackground from '../../components/gradientBackground';
import NotificationActionModal from '../../components/notificationActionModal';
import PriceText from '../../components/priceText';
import SuccessModal from '../../components/successModal';
import ToggleButtons from '../../components/toggleButton';
import {COLORS} from '../../constants';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import {hp, RF, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {getWallet} from '../../helpers/AxiosApiRequest';
import SingleSocket from '../../helpers/SingleSocket';
import {updateCreateState} from '../../store/reducer/userReducer';
import {
  updateBalances,
  updateBSCBalances,
  updateEthereumBalances,
  updateNetworkType,
  updatePolygonBalances,
  updateXanaBalances,
} from '../../store/reducer/walletReducer';
import {environment, translate} from '../../walletUtils';
import {HeaderBtns} from './components/HeaderButtons';
import NetworkPicker from './components/networkPicker';
import SelectToken from './components/SelectToken';
import Tokens from './components/Tokens';
import {balance, currencyInDollar} from './functions';
import NetInfo from '@react-native-community/netinfo';
import {modalAlert} from '../../common/function';
import MultiActionModal from '../certificateScreen/MultiActionModal';

const Wallet = ({navigation}) => {
  const [backupPhrasePopup, setBackupPhrasePopup] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {isCreate, isBackup} = useSelector(state => state.UserReducer);
  const {
    bnbBalance,
    busdBalance,
    usdtBalance,
    ethBalance,
    maticBalance,
    usdcBalance,
    wethBalance,
    xetaBalance,
    networkType,
  } = useSelector(state => state.WalletReducer);

  const [isBackedUp, setIsBackedUp] = useState(isBackup);
  const [modalVisible, setModalVisible] = useState(isCreate);
  const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectTokenVisible, setSelectTokenVisible] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [currencyPriceDollar, setCurrencyPriceDollar] = useState(false);

  //======================== Use Effect Second 2222 =======================
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsBackedUp(isBackup);
    });
    return () => {
      unsubscribeBlur();
    };
  }, []);

  //======================== Use Effect Third 3333 =======================
  useEffect(async () => {
    wallet = await getWallet();
    if (wallet && !isCreate && isFocused) {
      setLoading(true);
      setFetching(true);
      getBalances(wallet?.address);
    }
  }, [isFocused, networkType]);

  //======================== Use Effect Four 4444=======================
  useEffect(() => {
    setIsBackedUp(isBackup);
  }, [isFocused]);

  //======================== Render Header of Screen =====================
  const renderHeaderTokenSVGImage = () => {
    return (
      <View style={styles.header}>
        <ToggleButtons
          labelLeft={translate('wallet.common.tokens')}
          labelRight={translate('wallet.common.nfts')}
        />
        <TouchableOpacity
          style={styles.networkIcon}
          hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
          onPress={() => setPickerVisible(true)}>
          {networkType?.name !== 'XANACHAIN' &&
          networkType?.name !== 'Ethereum' ? (
            <SvgWithCssUri
              width={SIZE(28)}
              height={SIZE(28)}
              uri={networkType?.image}
            />
          ) : (
            <Image
              style={{height: SIZE(28), width: SIZE(28)}}
              source={
                networkType?.name !== 'Ethereum'
                  ? ImagesSrc.xetaNew
                  : ImagesSrc.etherium
              }
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  //======================== Render Price and Main wallet Text =====================
  const renderPriceMainWalletText = () => {
    return (
      <View style={styles.balanceContainer}>
        <PriceText
          price={setBalanceField()}
          isWhite
          isDollar
          containerStyle={styles.priceCont}
        />
        <TextView style={styles.balanceLabel}>
          {translate('wallet.common.mainWallet')}
        </TextView>
      </View>
    );
  };

  const getTokenDollarAmount = type => {
    let tokenInfo = {};
    if (type == 'ETH') {
      let eth = parseFloat(ethBalance) * currencyPriceDollar?.ETH;
      tokenInfo.tokenDollarValue = eth;
      tokenInfo.tokenName = 'ETH';
    } else if (type == 'USDT') {
      let usdtValue = parseFloat(usdtBalance) * 1;
      tokenInfo.tokenDollarValue = usdtValue;
      tokenInfo.tokenName = 'ETH';
    } else if (type == 'BNB') {
      let bnbValue = parseFloat(bnbBalance) * currencyPriceDollar?.BNB;
      tokenInfo.tokenDollarValue = bnbValue;
      tokenInfo.tokenName = 'BNB';
    } else if (type == 'BUSD') {
      let busdValue = parseFloat(busdBalance) * 1;
      tokenInfo.tokenDollarValue = busdValue;
      tokenInfo.tokenName = 'BNB';
    } else if (type == 'Matic') {
      let maticValue = parseFloat(maticBalance) * currencyPriceDollar?.MATIC;
      tokenInfo.tokenDollarValue = maticValue;
      tokenInfo.tokenName = 'Matic';
    } else if (type == 'USDC') {
      let usdcValue = parseFloat(usdcBalance) * 1;
      tokenInfo.tokenDollarValue = usdcValue;
      tokenInfo.tokenName = 'Matic';
    } else if (type == 'WETH') {
      let wethValue = parseFloat(wethBalance) * currencyPriceDollar?.ETH;
      tokenInfo.tokenDollarValue = wethValue;
      tokenInfo.tokenName = 'Matic';
    } else if (type == 'XETA') {
      let xetaValue = parseFloat(xetaBalance) * currencyPriceDollar?.XETA;
      tokenInfo.tokenDollarValue = xetaValue;
      tokenInfo.tokenName = 'XETA';
    }
    return tokenInfo;
  };

  const setBalanceField = () => {
    let totalValue = 0;
    if (networkType?.name == 'Ethereum') {
      let eth = parseFloat(ethBalance) * currencyPriceDollar?.ETH; //+ parseFloat(balances.USDT)
      let usdtValue = parseFloat(usdtBalance) * 1;
      let value = eth + usdtValue;
      totalValue = value;
    } else if (networkType?.name == 'BSC') {
      let bnbValue = parseFloat(bnbBalance) * currencyPriceDollar?.BNB;
      let busdValue = parseFloat(busdBalance) * 1;
      let value = bnbValue + busdValue;
      totalValue = value;
    } else if (networkType?.name == 'XANACHAIN') {
      let xetaValue = parseFloat(xetaBalance) * currencyPriceDollar?.XETA;
      let value = xetaValue;
      totalValue = value;
    } else if (networkType?.name == 'Polygon') {
      let maticValue = parseFloat(maticBalance) * currencyPriceDollar?.MATIC;
      let usdctValue = parseFloat(usdcBalance) * 1;
      let value = '';
      if (networkType == 'testnet') {
        value = maticValue + usdctValue;
      } else {
        let wethValue = parseFloat(wethBalance) * currencyPriceDollar?.ETH;
        value = maticValue + usdctValue + wethValue;
      }
      totalValue = value;
    }
    return totalValue;
  };

  //======================== Render Header Button (Send & Receive) =====================
  const renderHeaderButtonSendReceive = () => {
    return (
      <View style={[styles.headerBtns, styles.headerBottomCont]}>
        <HeaderBtns
          image={ImagesSrc.send}
          label={translate('wallet.common.send')}
          onPress={() => {
            setIsSend(true);
            isBackup ? setSelectTokenVisible(true) : setBackupPhrasePopup(true);
          }}
        />

        <MultiActionModal
          isVisible={backupPhrasePopup}
          closeModal={() => setBackupPhrasePopup(false)}
          navigation={navigation}
        />
        <HeaderBtns
          image={ImagesSrc.receive}
          label={translate('wallet.common.receive')}
          onPress={() => {
            setIsSend(false);
            isBackup ? setSelectTokenVisible(true) : setBackupPhrasePopup(true);
          }}
        />
        {/* <HeaderBtns
              onPress={() => {}}
              image={ImagesSrc.topup}
              label={translate('wallet.common.buy')}
            /> */}
      </View>
    );
  };

  //======================== Render is backup items =====================
  const renderIsBackupItems = () => {
    return (
      <View style={styles.rowContainer}>
        <AppButton
          label={translate('wallet.common.later')}
          containerStyle={styles.outlinedButton}
          labelStyle={[
            CommonStyles.outlineButtonLabel,
            CommonStyles.text(Fonts.ARIAL, Colors.greyButtonLabel, RF(1.55)),
          ]}
          onPress={() => setIsBackedUp(true)}
        />
        <AppButton
          label={translate('wallet.common.backupNow')}
          containerStyle={styles.button}
          labelStyle={[
            CommonStyles.buttonLabel,
            CommonStyles.text(Fonts.ARIAL, Colors.white, RF(1.55)),
          ]}
          onPress={() => navigation.navigate('SecurityScreen')}
        />
      </View>
    );
  };

  //==================== Render Token Items =======================
  const renderTokensItems = () => {
    return (
      <Tokens
        values={balances}
        network={networkType}
        onTokenPress={item => {
          setSelectTokenVisible(false);
          const tokenInfo = getTokenDollarAmount(item.type);
          navigation.navigate('tokenDetail', {item, tokenInfo});
        }}
        onRefresh={onRefreshToken}
      />
    );
  };

  const onRefreshToken = async () => {
    wallet = await getWallet();
    return getBalances(wallet?.address);
  };

  //==================== Render App Modals =======================
  const renderAppModals = () => {
    return (
      <AppModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        {isSuccessVisible ? (
          <SuccessModal
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setSuccessVisible(false);
              setNotificationVisible(true);
              dispatch(updateCreateState());
            }}
          />
        ) : null}

        {isNotificationVisible ? (
          <NotificationActionModal
            title={translate('wallet.common.setPushNotification')}
            hint={translate('wallet.common.notificationHint')}
            btnText={translate('wallet.common.enable')}
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setModalVisible(false);
              if (wallet) {
                setLoading(true);
                setFetching(true);
                getBalances(wallet.address);
              }
            }}
          />
        ) : null}
      </AppModal>
    );
  };

  //==================== Render Network Picker =======================
  const renderNetworkPicker = () => {
    return (
      <NetworkPicker
        visible={pickerVisible}
        onRequestClose={setPickerVisible}
        network={networkType}
        onItemSelect={item => {
          onItemSelectNetworkPicker(item);
        }}
      />
    );
  };

  const onItemSelectNetworkPicker = async item => {
    await AsyncStorage.setItem(
      '@CURRENT_NETWORK_CHAIN_ID',
      item.chainId.toString(),
    );
    dispatch(updateNetworkType(item));
    setPickerVisible(false);
    // getBalances(wallet?.address);
    setBalances(null);
  };

  //==================== Render Select Token =======================
  const renderSelectToken = () => {
    return (
      <SelectToken
        visible={selectTokenVisible}
        onRequestClose={setSelectTokenVisible}
        values={balances}
        network={networkType}
        isSend={isSend}
        onTokenPress={item => {
          setSelectTokenVisible(false);
          const tokenInfo = getTokenDollarAmount(item.type);
          if (isSend) {
            navigation.navigate('send', {
              item,
              type: item.type,
              tokenInfo,
            });
          } else {
            navigation.navigate('receive', {item, type: item.type});
          }
        }}
      />
    );
  };

  //======================= Get Balances Function =======================
  const getBalances = async pubKey => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      await priceInDollars(pubKey);
      if (networkType?.name == 'BSC') {
        return getBSCBalances(pubKey);
      } else if (networkType?.name == 'Ethereum') {
        return getEthereumBalances(pubKey);
      } else if (networkType?.name == 'Polygon') {
        return getPolygonBalances(pubKey);
      } else if (networkType?.name == 'XANACHAIN') {
        return getXanaChainBalances(pubKey);
      } else {
        return new Promise((resolve, reject) => {
          let balanceRequests = [
            balance(pubKey, '', '', environment.ethRpc, 'eth'),
            balance(pubKey, '', '', environment.bnbRpc, 'bnb'),
            balance(pubKey, '', '', environment.polRpc, 'matic'),
            balance(
              pubKey,
              environment.tnftCont,
              environment.tnftAbi,
              environment.bnbRpc,
              'alia',
            ),
            balance(
              pubKey,
              environment.talCont,
              environment.tnftAbi,
              environment.polRpc,
              'alia',
            ),
            balance(
              pubKey,
              environment.usdtCont,
              environment.usdtAbi,
              environment.ethRpc,
              'usdt',
            ),
            balance(
              pubKey,
              environment.busdCont,
              environment.busdAbi,
              environment.bnbRpc,
              'busd',
            ),
          ];
          Promise.all(balanceRequests)
            .then(responses => {
              let balances = {
                ETH: responses[0],
                BNB: responses[1],
                Matic: responses[2],
                TNFT: responses[3],
                TAL: responses[4],
                USDT: responses[5],
                BUSD: responses[6],
                // ALIA: responses[5],
                // USDC: responses[6],
              };
              dispatch(updateBalances(balances));
              setBalances(balances);
              setLoading(false);
              setFetching(false);
              resolve();
            })
            .catch(err => {
              setLoading(false);
              setFetching(false);
              reject();
            });
        });
      }
    } else {
      setLoading(false);
      setFetching(false);
      modalAlert(
        translate('common.alertTitle'),
        translate('wallet.common.error.networkError'),
      );
    }
  };

  //=================== Price In Dollerrs =============================
  const priceInDollars = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [];
      try {
        if (networkType?.name == 'BSC') {
          balanceRequests = [currencyInDollar(pubKey, 'BSC')];
        } else if (networkType?.name == 'Ethereum') {
          balanceRequests = [currencyInDollar(pubKey, 'ETH')];
        } else if (networkType?.name == 'Polygon') {
          balanceRequests = [
            currencyInDollar(pubKey, 'Polygon'),
            currencyInDollar(pubKey, 'ETH'),
          ];
        } else if (networkType?.name == 'XANACHAIN') {
          balanceRequests = [currencyInDollar(pubKey, 'XANACHAIN')];
        } else {
          balanceRequests = [
            currencyInDollar(pubKey, 'BSC'),
            currencyInDollar(pubKey, 'ETH'),
            currencyInDollar(pubKey, 'Polygon'),
            currencyInDollar(pubKey, 'ALIA'),
            currencyInDollar(pubKey, 'XANACHAIN'),
          ];
        }
        Promise.all(balanceRequests)
          .then(responses => {
            let balances = {
              BNB: responses[0],
              ETH: networkType?.name == 'Polygon' ? responses[1] : responses[0],
              MATIC: responses[0],
              // ALIA: parseFloat(responses[0]) / parseFloat(responses[3]),
              XETA: responses[0],
            };
            setCurrencyPriceDollar(balances);
            setLoading(false);
            resolve();
          })
          .catch(err => {
            setLoading(false);
            setFetching(false);
            // modalAlert(
            //   translate('wallet.common.alert'),
            //   translate('wallet.common.error.networkError'),
            // );
            reject();
          });
      } catch (error) {
        reject();
      }
    });
  };

  //====================== Get Ethereum Balances ========================
  const getEthereumBalances = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [
        balance(pubKey, '', '', environment.ethRpc, 'eth'),
        balance(
          pubKey,
          environment.usdtCont,
          environment.usdtAbi,
          environment.ethRpc,
          'usdt',
        ),
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          let balances = {
            ETH: responses[0],
            USDT: responses[1],
          };
          dispatch(updateEthereumBalances(balances));
          setBalances(balances);
          setLoading(false);
          setFetching(false);
          resolve();
        })
        .catch(err => {
          setLoading(false);
          setFetching(false);
          reject();
        });
    });
  };

  //====================== Get BSC Balances ========================
  const getBSCBalances = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [
        balance(pubKey, '', '', environment.bnbRpc, 'bnb'),
        balance(
          pubKey,
          environment.tnftCont,
          environment.tnftAbi,
          environment.bnbRpc,
          'alia',
        ),
        balance(
          pubKey,
          environment.busdCont,
          environment.busdAbi,
          environment.bnbRpc,
          'busd',
        ),
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          let balances = {
            BNB: responses[0],
            TNFT: responses[1],
            BUSD: responses[2],
            ALIA: responses[3],
          };
          dispatch(updateBSCBalances(balances));
          setBalances(balances);
          setLoading(false);
          setFetching(false);
          resolve();
        })
        .catch(err => {
          setLoading(false);
          setFetching(false);
          reject();
        });
    });
  };

  //====================== Get Polygon Balances ========================
  const getPolygonBalances = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [
        balance(pubKey, '', '', environment.polRpc, 'matic'),
        balance(
          pubKey,
          environment.talCont,
          environment.tnftAbi,
          environment.polRpc,
          'alia',
        ),
        balance(
          pubKey,
          environment.usdcCont,
          environment.usdcAbi,
          environment.polRpc,
          'usdc',
        ),
        balance(
          pubKey,
          environment.wethCont,
          environment.wethAbi,
          environment.polRpc,
          'weth',
        ),
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          let balances = {
            Matic: responses[0],
            TAL: responses[1],
            USDC: responses[2],
            WETH: responses[3],
          };

          dispatch(updatePolygonBalances(balances));
          setBalances(balances);
          setLoading(false);
          setFetching(false);
          resolve();
        })
        .catch(err => {
          setLoading(false);
          setFetching(false);
          reject();
        });
    });
  };

  const getXanaChainBalances = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [
        balance(pubKey, '', '', environment.xanaRpc, 'xeta'),
      ];
      Promise.all(balanceRequests)
        .then(responses => {
          let balances = {
            Xeta: responses[0],
          };
          dispatch(updateXanaBalances(balances));
          setBalances(balances);
          setLoading(false);
          setFetching(false);
          resolve();
        })
        .catch(err => {
          setLoading(false);
          setFetching(false);
          reject();
        });
    });
  };

  //====================== Component render function ========================
  return (
    <AppBackground isBusy={balances ? loading : fetching}>
      <GradientBackground>
        <View style={styles.gradient}>
          {renderHeaderTokenSVGImage()}
          {renderPriceMainWalletText()}
          {renderHeaderButtonSendReceive()}
        </View>
      </GradientBackground>
      {!isBackedUp && (
        <View style={styles.backupContainer}>
          <Text style={styles.backupTitle}>
            {translate('wallet.common.backupRestorePhrase')}
          </Text>
          <Text style={styles.backupSubTitle}>
            {translate('wallet.common.restorePhraseIsImportant')}
          </Text>
          {renderIsBackupItems()}
        </View>
      )}
      {renderTokensItems()}
      {renderAppModals()}
      {renderNetworkPicker()}
      {renderSelectToken()}
    </AppBackground>
  );
};

//================= StyleSheet ============================
const styles = StyleSheet.create({
  gradient: {},
  priceCont: {},
  headerBtns: {
    flexDirection: 'row',
  },
  headerBottomCont: {
    width: wp('70%'),
    alignSelf: 'center',
    paddingTop: hp('1%'),
    paddingBottom: hp('2%'),
  },
  balanceContainer: {
    marginVertical: hp('2%'),
    paddingBottom: hp('1.5%'),
    alignItems: 'center',
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: RF(1.8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkIcon: {
    position: 'absolute',
    marginRight: wp('4%'),
    right: 0,
  },
  backupContainer: {
    backgroundColor: COLORS.buttonGroupBackground,
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 5,
    width: wp('92.5%'),
    alignSelf: 'center',
    marginTop: hp('2%'),
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backupTitle: {
    color: Colors.black,
    fontSize: RF(2.1),
    textAlign: 'center',
  },
  backupSubTitle: {
    color: Colors.tabLabel,
    fontSize: RF(1.25),
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    ...CommonStyles.button,
    marginTop: hp('3%'),
  },
  outlinedButton: {
    width: '48%',
    ...CommonStyles.outlineButton,
    marginTop: hp('3%'),
  },
});

export default React.memo(Wallet);
