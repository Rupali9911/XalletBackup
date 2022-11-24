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
import {alertWithSingleBtn} from '../../common/function';

const ethers = require('ethers');
var Accounts = require('web3-eth-accounts');

const singleSocket = new SingleSocket();
var accounts = new Accounts('');

const Wallet = ({route, navigation}) => {
  let wallet = null;
  let subscribeEth;
  let subscribeBnb;
  let subscribeMatic;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {isCreate, userData, isBackup} = useSelector(
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
    xetaBalance,
    networkType,
  } = useSelector(state => state.WalletReducer);

  const [isBackedUp, setIsBackedUp] = useState(isBackup);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    } else {
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
  }, [isFocused]);

  //======================== Use Effect Four 4444=======================
  useEffect(() => {
    setIsBackedUp(isBackup);
  }, [isFocused]);

  //======================== Use Effect Four 5555 =======================
  useEffect(async () => {
    wallet = await getWallet();
    setLoading(true);
    setFetching(true);
    getBalances(wallet?.address);
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
    if (balances) {
      if (networkType?.name == 'Ethereum') {
        let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
        setTotalValue(value);
      } else if (networkType?.name == 'BSC') {
        let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
        setTotalValue(value);
      } else if (networkType?.name == 'Polygon') {
        let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
        setTotalValue(value);
      } else if (networkType?.name == 'XANA CHAIN') {
        let value = parseFloat(xetaBalance); //+ parseFloat(balances.USDC)
        setTotalValue(value);
      }
    }
  }, [networkType, wethBalance, bnbBalance, maticBalance, xetaBalance]);

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
          {networkType?.name !== 'XANA CHAIN' &&
          networkType?.name !== 'Ethereum' ? (
            <SvgWithCssUri
              width={SIZE(25)}
              height={SIZE(25)}
              uri={networkType?.image}
            />
          ) : networkType?.name !== 'Ethereum' ? (
            <Image
              style={{height: SIZE(30), width: SIZE(30)}}
              source={{uri: networkType?.image}}
            />
          ) : (
            <Image
              style={{height: SIZE(25), width: SIZE(25)}}
              source={ImagesSrc.etherium}
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
      // for mainnet
      // let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      // for testing
      let bnbValue = parseFloat(bnbBalance) * currencyPriceDollar?.BNB;
      let tnftValue = parseFloat(tnftBalance) * currencyPriceDollar?.ALIA;
      let busdValue = parseFloat(busdBalance) * 1;
      let value = bnbValue + busdValue;
      totalValue = value;
    } else if (networkType?.name == 'XANA CHAIN') {
      // for mainnet
      // let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      // for testing
      let xetaValue = parseFloat(xetaBalance) * currencyPriceDollar?.XETA;
      let value = xetaValue;
      totalValue = value;
    } else if (networkType?.name == 'Polygon') {
      //for mainnet
      // let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
      // for testing
      let maticValue = parseFloat(maticBalance) * currencyPriceDollar?.MATIC;
      let talValue = parseFloat(talBalance) * currencyPriceDollar?.ALIA;
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
      } else if (networkType?.name == 'XANA CHAIN') {
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
              setFetching(false);
              resolve();
            })
            .catch(err => {
              console.log('@@@ Get balance load fun error', err);
              setLoading(false);
              setFetching(false);
              reject();
            });
        });
      }
    } else {
      setLoading(false);
      setFetching(false);
      alertWithSingleBtn(
        translate('wallet.common.alert'),
        translate('wallet.common.error.networkError'),
      );
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
          // currencyInDollar(pubKey, 'Xana Chain'),
        ];
        Promise.all(balanceRequests)
          .then(responses => {
            let balances = {
              BNB: responses[0],
              ETH: responses[1],
              MATIC: responses[2],
              ALIA: parseFloat(responses[0]) / parseFloat(responses[3]),
              XETA: responses[4],
            };
            setCurrencyPriceDollar(balances);
            setLoading(false);
            resolve();
          })
          .catch(err => {
            setLoading(false);
            setFetching(false);
            alertWithSingleBtn(
              translate('wallet.common.alert'),
              translate('wallet.common.error.networkError'),
            );
            reject();
          });
      });
    } catch (error) {
      console.log('@@@ price in dollars error ========>', error);
    }
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
          console.log('err', err);
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
          console.log('err', err);
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
        // balance(
        //   pubKey,
        //   environment.talCont,
        //   environment.tnftAbi,
        //   environment.polRpc,
        //   'alia',
        // ),
        // balance(
        //   pubKey,
        //   environment.usdcCont,
        //   environment.usdcAbi,
        //   environment.polRpc,
        //   'usdc',
        // ),
        // balance(
        //   pubKey,
        //   environment.wethCont,
        //   environment.wethAbi,
        //   environment.polRpc,
        //   'weth',
        // ),
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
          console.log('err', err);
          setLoading(false);
          setFetching(false);
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
    <AppBackground isBusy={balances ? loading : fetching}>
      {/* // <AppBackground isBusy={loading}> */}
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
