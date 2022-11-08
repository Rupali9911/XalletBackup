import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { SIZE } from 'src/constants';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppModal from '../../components/appModal';
import TextView from '../../components/appText';
import GradientBackground from '../../components/gradientBackground';
import NotificationActionModal from '../../components/notificationActionModal';
import PriceText from '../../components/priceText';
import SuccessModal from '../../components/successModal';
import ToggleButtons from '../../components/toggleButton';
import { COLORS } from '../../constants';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { getWallet } from '../../helpers/AxiosApiRequest';
import SingleSocket from '../../helpers/SingleSocket';
import { updateCreateState } from '../../store/reducer/userReducer';
import {
  updateBalances,
  updateBSCBalances,
  updateEthereumBalances,
  updateNetworkType,
  updatePolygonBalances
} from '../../store/reducer/walletReducer';
import { environment, translate } from '../../walletUtils';
import { HeaderBtns } from './components/HeaderButtons';
import NetworkPicker from './components/networkPicker';
import SelectToken from './components/SelectToken';
import Tokens from './components/Tokens';
import { balance, currencyInDollar } from './functions';

const ethers = require('ethers');
var Accounts = require('web3-eth-accounts');

const singleSocket = new SingleSocket();
var accounts = new Accounts('');

const Wallet = ({ route, navigation }) => {

  let wallet = null
  let subscribeEth;
  let subscribeBnb;
  let subscribeMatic;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const { isCreate, userData, isBackup } = useSelector(
    state => state.UserReducer,
  );
  const {
    bnbBalance,
    tnftBalance,
    busdBalance,
    usdtBalance,
    ethBalance,
    maticBalance,
    talBalance,
    usdcBalance,
    wethBalance,
    networkType,
  } = useSelector(state => state.WalletReducer);

  const [isBackedUp, setIsBackedUp] = useState(isBackup);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(isCreate);
  const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [balances, setBalances] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectTokenVisible, setSelectTokenVisible] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [currencyPriceDollar, setCurrencyPriceDollar] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [walletAccount, setWalletAccount] = useState();
  // const [network, setNetwork] = useState({name: 'BSC', icon: ImagesSrc.bnb});


  //======================== Use Effect First 1111 =======================
  useEffect(() => {
    console.log("@@@ On wallet tab, first useEffect =======>");
    // singleSocket.connectSocket().then(() => {
    //   // ping(wallet.address);
    // });
    // const socketSubscribe = Events.asObservable().subscribe({
    //   next: data => {
    //     console.log('socket subscribe', data);
    //     const response = JSON.parse(data);
    //     if (response.type == 'pong') {
    //       connect(response.data);
    //     }
    //   },
    // });

    return () => {
      // socketSubscribe.unsubscribe();
    };
  }, []);

  //======================== Use Effect Second 2222 =======================
  useEffect(() => {
    console.log("@@@ On wallet tab, second useEffect blur =======>");
    const unsubscribeBlur = navigation.addListener('blur', () => {
      console.log("@@@ On wallet tab, second useEffect blur inside=======>");
      setIsBackedUp(isBackup);
    });
    return () => {
      unsubscribeBlur();
    };
  }, []);

  //======================== Use Effect Third 3333 =======================
  useEffect(async () => {
    wallet = await getWallet();
    console.log("@@@ On wallet tab, third useEffect wallet 1111=======>");
    if (wallet && !isCreate && isFocused) {
      setLoading(true);
      getBalances(wallet?.address);
      console.log("@@@ On wallet tab, third useEffect wallet 2222 if=======>");
    } else {
      console.log("@@@ On wallet tab, third useEffect wallet 3333 else =======>");
      subscribeEth &&
        subscribeEth.unsubscribe((error, success) => {
          if (success) console.log('Successfully unsubscribed!');
        });
      subscribeBnb &&
        subscribeBnb.unsubscribe((error, success) => {
          if (success) console.log('Successfully unsubscribed!');
        });
      subscribeMatic &&
        subscribeMatic.unsubscribe((error, success) => {
          if (success) console.log('Successfully unsubscribed!');
        });
    }
    // console.log('wallet use effect', userData, wallet);
  }, [isFocused]);

  //======================== Use Effect Four 4444=======================
  useEffect(() => {
    console.log("@@@ On wallet tab, Is backup useEffect wallet 1111 =======>");
    setIsBackedUp(isBackup);
  }, [isFocused]);

  //======================== Use Effect Four 5555 =======================
  useEffect(async () => {
    console.log("@@@ On wallet tab, fourth useEffect wallet 1111 =======>");
    wallet = await getWallet();
    setLoading(true);
    getBalances(wallet?.address);
    console.log("@@@ On wallet tab, fourth useEffect wallet 2222=======>");
    // if (network.name == 'Ethereum' && subscribeEth == null) {
    //   subscribeEth = watchBalanceUpdate(() => {
    //     getBalances(wallet.address);
    //   }, 'eth');
    // } else if (network.name == 'BSC' && subscribeBnb == null) {
    //   subscribeBnb = watchBalanceUpdate(() => {
    //     getBalances(wallet.address);
    //   }, 'bsc');
    //   // watchBnBBalance();
    // } else if (network.name == 'Polygon' && subscribeMatic == null) {
    //   subscribeMatic = watchBalanceUpdate(() => {
    //     getBalances(wallet.address);
    //   }, 'polygon');
    // } else {
    //   subscribeEth &&
    //     subscribeEth.unsubscribe((error, success) => {
    //       if (success) {
    //         console.log('ETH Successfully unsubscribed!');
    //         subscribeEth == null;
    //       }
    //     });
    //   subscribeBnb &&
    //     subscribeBnb.unsubscribe((error, success) => {
    //       if (success) {
    //         console.log('BNB Successfully unsubscribed!');
    //         subscribeBnb == null;
    //       }
    //     });
    //   subscribeMatic &&
    //     subscribeMatic.unsubscribe((error, success) => {
    //       if (success) {
    //         console.log('Matic Successfully unsubscribed!');
    //         subscribeMatic == null;
    //       }
    //     });
    // }

    return () => {
      // ethSubscription.unsubscribe();
      // bnbSubscription.unsubscribe();
      // polygonSubscription.unsubscribe();
      // subscribeEth &&
      //   subscribeEth.unsubscribe((error, success) => {
      //     if (success) console.log('Successfully unsubscribed!');
      //   });
      // subscribeBnb &&
      //   subscribeBnb.unsubscribe((error, success) => {
      //     if (success) console.log('Successfully unsubscribed!');
      //   });
      // subscribeMatic &&
      //   subscribeMatic.unsubscribe((error, success) => {
      //     if (success) console.log('Successfully unsubscribed!');
      //   });
    };
  }, [networkType]);

  //======================== Use Effect Four 6666 =======================
  useEffect(() => {
    console.log("@@@ On wallet tab, If balance useEffect wallet 1111 =======>");
    if (balances) {
      console.log("@@@ On wallet tab, Inside If balance useEffect wallet 1111 =======>");
      if (networkType?.name == 'Ethereum') {
        let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
        setTotalValue(value);
      } else if (networkType?.name == 'BSC') {
        let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
        setTotalValue(value);
      } else if (networkType?.name == 'Polygon') {
        let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
        setTotalValue(value);
      }
    }
  }, [networkType, wethBalance, bnbBalance, maticBalance]);

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
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
          onPress={() => setPickerVisible(true)}>
          <SvgUri
            width={SIZE(25)}
            height={SIZE(25)}
            uri={networkType?.image}
          />
        </TouchableOpacity>
      </View>
    )
  }

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
    )
  }

  const setBalanceField = () => {
    let totalValue = 0;
    if (networkType?.name == 'Ethereum') {
      let eth = parseFloat(ethBalance) * currencyPriceDollar?.ETH; //+ parseFloat(balances.USDT)
      let usdtValue = parseFloat(usdtBalance) * 1;
      let value = eth + usdtValue;
      totalValue = value;
    } else if (networkType?.name == 'BSC') {
      // for mainnet
      // let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      // for testing
      let bnbValue = parseFloat(bnbBalance) * currencyPriceDollar?.BNB;
      let tnftValue = parseFloat(tnftBalance) * currencyPriceDollar?.ALIA;
      let busdValue = parseFloat(busdBalance) * 1;
      let value = bnbValue + tnftValue + busdValue;
      totalValue = value;
    } else if (networkType?.name == 'Polygon') {
      //for mainnet
      // let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
      // for testing
      let maticValue = parseFloat(maticBalance) * currencyPriceDollar?.MATIC;
      let talValue = parseFloat(talBalance) * currencyPriceDollar?.ALIA;
      let usdctValue = parseFloat(usdcBalance) * 1;
      let value = ""
      if (networkType == 'testnet') {
        value = maticValue + talValue + usdctValue;
      } else {
        let wethValue = parseFloat(wethBalance) * currencyPriceDollar?.ETH;
        value = maticValue + talValue + usdctValue + wethValue;
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
            setSelectTokenVisible(true);
          }}
        />
        <HeaderBtns
          image={ImagesSrc.receive}
          label={translate('wallet.common.receive')}
          onPress={() => {
            setIsSend(false);
            setSelectTokenVisible(true);
          }}
        />
        {/* <HeaderBtns
              onPress={() => {}}
              image={ImagesSrc.topup}
              label={translate('wallet.common.buy')}
            /> */}
      </View>
    )
  }

  //======================== Render is backup items =====================
  const renderIsBackupItems = () => {
    return (
      <View style={styles.rowContainer}>
        <AppButton
          label={translate('wallet.common.later')}
          containerStyle={styles.outlinedButton}
          labelStyle={[
            CommonStyles.outlineButtonLabel,
            CommonStyles.text(
              Fonts.ARIAL,
              Colors.greyButtonLabel,
              RF(1.55),
            ),
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
    )
  }

  //==================== Render Token Items =======================
  const renderTokensItems = () => {
    return (
      <Tokens
        values={balances}
        network={networkType}
        onTokenPress={item => {
          // console.log('Token details transfered######', item);
          navigation.navigate('tokenDetail', { item });
        }}
        onRefresh={onRefreshToken}
      />
    )
  }

  const onRefreshToken = () => {
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
                getBalances(wallet.address);
              }
            }}
          />
        ) : null}
      </AppModal>
    )
  }

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
    )
  }

  const onItemSelectNetworkPicker = async (item) => {
    await AsyncStorage.setItem("@CURRENT_NETWORK_CHAIN_ID", item.chainId.toString());
    dispatch(updateNetworkType(item));
    setPickerVisible(false);
    // getBalances(wallet?.address);
    setBalances(null);
  }

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
          if (isSend) {
            navigation.navigate('send', { item, type: item.type });
          } else {
            navigation.navigate('receive', { item, type: item.type });
          }
        }}
      />
    )
  }

  //======================= Get Balances Function =======================
  const getBalances = async pubKey => {
    console.log("@@@ get balance fun =======>")
    await priceInDollars(pubKey);
    if (networkType?.name == 'BSC') {
      console.log("@@@ get balance fun BSC=======>")
      return getBSCBalances(pubKey);
    } else if (networkType?.name == 'Ethereum') {
      return getEthereumBalances(pubKey);
    } else if (networkType?.name == 'Polygon') {
      return getPolygonBalances(pubKey);
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
          // balance(pubKey, environment.aliaCont, environment.aliaAbi, environment.bnbRpc, "alia"),
          // balance(pubKey, environment.usdcCont, environment.usdcAbi, environment.polRpc, "usdc")
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
            resolve();
          })
          .catch(err => {
            console.log('@@@ Get balance load fun error', err);
            setLoading(false);
            reject();
          });
      });
    }
  };

  //=================== Price In Dollerrs =============================
  const priceInDollars = pubKey => {
    try {
      return new Promise((resolve, reject) => {
        let balanceRequests = [
          currencyInDollar(pubKey, 'BSC'),
          currencyInDollar(pubKey, 'ETH'),
          currencyInDollar(pubKey, 'Polygon'),
          currencyInDollar(pubKey, 'ALIA'),
        ];
        Promise.all(balanceRequests)
          .then(responses => {
            let balances = {
              BNB: responses[0],
              ETH: responses[1],
              MATIC: responses[2],
              ALIA: parseFloat(responses[0]) / parseFloat(responses[3]),
            };
            setCurrencyPriceDollar(balances);
            setLoading(false);
            resolve();
          })
          .catch(err => {
            console.log('err', err);
            setLoading(false);
            reject();
          });
      });
    } catch (error) {
      console.log("@@@ price in dollars error ========>", error)
    }
  };

  //====================== Get Ethereum Balances ========================
  const getEthereumBalances = pubKey => {
    // console.log("@@@ get Ethereum balance ========>", pubKey);
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
          resolve();
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
          reject();
        });
    });
  };


  //====================== Get BSC Balances ========================
  const getBSCBalances = pubKey => {
    console.log("@@@ get BSC balance ========>",);
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
          // console.log('@@@ BSC BALANCE RESPONSES ========>', responses);
          let balances = {
            BNB: responses[0],
            TNFT: responses[1],
            BUSD: responses[2],
            ALIA: responses[3],
          };
          dispatch(updateBSCBalances(balances));
          setBalances(balances);
          setLoading(false);
          resolve();
        })
        .catch(err => {
          //console.log('err', err);
          setLoading(false);
          reject();
        });
    });
  };

  //====================== Get Polygon Balances ========================
  const getPolygonBalances = pubKey => {
    // console.log("@@@ get polygon balance ========>", pubKey);
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
          resolve();
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
          reject();
        });
    });
  };

  //======================== Other functions =======================
  const ping = async public_key => {

    let data = {
      type: 'ping',
      data: {
        type: 'wallet',
        publicKey: public_key,
      },
    };
    return singleSocket.onSendMessage(data);
  };

  const getSig = message => {
    let wlt = accounts.privateKeyToAccount(wallet.privateKey);
    let sigMsg = wlt.sign(message, wallet.privateKey);
    return sigMsg.signature;
  };

  const connect = async msg => {
    let data = {
      type: 'connect',
      data: {
        type: 'wallet',
        data: {
          walletId: wallet?.address,
          publicKey: wallet?.address,
          sig: `${getSig(msg)}`,
        },
      },
    };
    singleSocket.onSendMessage(data);
  };

  //====================== Component render function ========================
  return (
    <AppBackground isBusy={balances ? loading : true}>
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

export default Wallet;
