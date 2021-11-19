import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Events} from '../../App';
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
import SingleSocket from '../../helpers/SingleSocket';
import {updateCreateState} from '../../store/reducer/userReducer';
import {
  updateBalances,
  updateEthereumBalances,
  updateBSCBalances,
  updatePolygonBalances,
} from '../../store/reducer/walletReducer';
import {environment, translate} from '../../walletUtils';
import {HeaderBtns} from './components/HeaderButtons';
import NetworkPicker from './components/networkPicker';
import SelectToken from './components/SelectToken';
import Tokens from './components/Tokens';
import {balance, watchBalanceUpdate} from './functions';

const ethers = require('ethers');

const singleSocket = new SingleSocket();

var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('');

const Wallet = ({route, navigation}) => {
  const {wallet, isCreate, data, isBackup} = useSelector(
    state => state.UserReducer,
  );
  const {ethBalance, bnbBalance, maticBalance, tnftBalance, talBalance} =
    useSelector(state => state.WalletReducer);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isBackedUp, setIsBackedUp] = useState(isBackup);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(isCreate);
  const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [balances, setBalances] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [walletAccount, setWalletAccount] = useState();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectTokenVisible, setSelectTokenVisible] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [network, setNetwork] = useState({name: 'BSC', icon: ImagesSrc.bnb});

  let subscribeEth;
  let subscribeBnb;
  let subscribeMatic;

  useEffect(() => {
    if (wallet && !isCreate && isFocused) {
      setLoading(true);
      getBalances(wallet.address);
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
    console.log('data', data, wallet);
  }, [isFocused]);

  useEffect(() => {
    // singleSocket.connectSocket().then(() => {
    //     ping(wallet.address);
    // });

    const socketSubscribe = Events.asObservable().subscribe({
      next: data => {
        console.log('data', data);
        const response = JSON.parse(data);
        if (response.type == 'pong') {
          connect(response.data);
        }
      },
    });

    return () => {
      socketSubscribe.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      setIsBackedUp(isBackup);
    });
    return () => {
      unsubscribeBlur();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    if (network.name == 'Ethereum' && subscribeEth == null) {
      subscribeEth = watchBalanceUpdate(() => {
        getBalances(wallet.address);
      }, 'eth');
    } else if (network.name == 'BSC' && subscribeBnb == null) {
      subscribeBnb = watchBalanceUpdate(() => {
        getBalances(wallet.address);
      }, 'bsc');
      // watchBnBBalance();
    } else if (network.name == 'Polygon' && subscribeMatic == null) {
      subscribeMatic = watchBalanceUpdate(() => {
        getBalances(wallet.address);
      }, 'polygon');
    } else {
      subscribeEth &&
        subscribeEth.unsubscribe((error, success) => {
          if (success) {
            console.log('ETH Successfully unsubscribed!');
            subscribeEth == null;
          }
        });
      subscribeBnb &&
        subscribeBnb.unsubscribe((error, success) => {
          if (success) {
            console.log('BNB Successfully unsubscribed!');
            subscribeBnb == null;
          }
        });
      subscribeMatic &&
        subscribeMatic.unsubscribe((error, success) => {
          if (success) {
            console.log('Matic Successfully unsubscribed!');
            subscribeMatic == null;
          }
        });
    }

    return () => {
      // ethSubscription.unsubscribe();
      // bnbSubscription.unsubscribe();
      // polygonSubscription.unsubscribe();
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
    };
  }, [network]);

  useEffect(() => {
    console.log('update Total', network);
    if (balances) {
      if (network.name == 'Ethereum') {
        let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
        console.log('value', value);
        setTotalValue(value);
      } else if (network.name == 'BSC') {
        let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
        console.log('value', value);
        setTotalValue(value);
      } else if (network.name == 'Polygon') {
        let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
        console.log('value', value);
        setTotalValue(value);
      }
    }
  }, [network, ethBalance, bnbBalance, maticBalance]);

  const setBalanceField = () => {
    let totalValue = 0;
    if (network.name == 'Ethereum') {
      let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
      // console.log('Ethereum value',value);
      totalValue = value;
    } else if (network.name == 'BSC') {
      // for mainnet
      // let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)

      //for testing
      let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      // console.log('BSC value',value);
      totalValue = value;
    } else if (network.name == 'Polygon') {
      //for mainnet
      // let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)

      //for testing
      let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
      // console.log('Polygon value',value);
      totalValue = value;
    }
    return totalValue;
  };

  const ping = async public_key => {
    console.log('accounts', public_key);
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
    console.log('connecting', msg);
    let data = {
      type: 'connect',
      data: {
        type: 'wallet',
        data: {
          walletId: wallet.address,
          publicKey: wallet.address,
          sig: `${getSig(msg)}`,
        },
      },
    };
    singleSocket.onSendMessage(data);
  };

  const getEthereumBalances = pubKey => {
    return new Promise((resolve, reject) => {
      let balanceRequests = [
        balance(pubKey, '', '', environment.ethRpc, 'eth'),
        // balance(pubKey, environment.usdtCont, environment.usdtAbi, environment.ethRpc, "usdt"),
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          // console.log('balances',responses);
          let balances = {
            ETH: responses[0],
            // USDT: responses[1],
          };
          dispatch(updateEthereumBalances(balances));
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
        // balance(pubKey, environment.busdCont, environment.busdAbi, environment.bnbRpc, "busd"),
        // balance(pubKey, environment.aliaCont, environment.aliaAbi, environment.bnbRpc, "alia"),
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          // console.log('balances',responses);
          let balances = {
            BNB: responses[0],
            TNFT: responses[1],
            // BUSD: responses[2],
            // ALIA: responses[3],
          };
          dispatch(updateBSCBalances(balances));
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
        // balance(pubKey, environment.usdcCont, environment.usdcAbi, environment.polRpc, "usdc")
      ];

      Promise.all(balanceRequests)
        .then(responses => {
          // console.log('balances',responses);
          let balances = {
            Matic: responses[0],
            TAL: responses[1],
            // USDC: responses[2],
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

  const getBalances = pubKey => {
    if (network.name == 'BSC') {
      return getBSCBalances(pubKey);
    } else if (network.name == 'Ethereum') {
      return getEthereumBalances(pubKey);
    } else if (network.name == 'Polygon') {
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
          // balance(pubKey, environment.usdtCont, environment.usdtAbi, environment.ethRpc, "usdt"),
          // balance(pubKey, environment.busdCont, environment.busdAbi, environment.bnbRpc, "busd"),
          // balance(pubKey, environment.aliaCont, environment.aliaAbi, environment.bnbRpc, "alia"),
          // balance(pubKey, environment.usdcCont, environment.usdcAbi, environment.polRpc, "usdc")
        ];

        Promise.all(balanceRequests)
          .then(responses => {
            // console.log('balances',responses);
            let balances = {
              ETH: responses[0],
              BNB: responses[1],
              Matic: responses[2],
              TNFT: responses[3],
              TAL: responses[4],
              // USDT: responses[3],
              // BUSD: responses[4],
              // ALIA: responses[5],
              // USDC: responses[6],
            };
            dispatch(updateBalances(balances));
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
    }
  };

  const onRefreshToken = () => {
    return getBalances(wallet.address);
  };
  return (
    <AppBackground hideSafeArea lightStatus isBusy={loading}>
      <GradientBackground>
        <View style={styles.gradient}>
          <View style={styles.header}>
            <ToggleButtons
              labelLeft={translate('wallet.common.tokens')}
              labelRight={translate('wallet.common.nfts')}
            />

            <TouchableOpacity
              style={styles.networkIcon}
              hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
              onPress={() => setPickerVisible(true)}>
              <Image
                source={network.icon}
                style={[CommonStyles.imageStyles(6)]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <PriceText
              price={setBalanceField()}
              isWhite
              containerStyle={styles.priceCont}
            />
            <TextView style={styles.balanceLabel}>
              {translate('wallet.common.mainWallet')}
            </TextView>
          </View>

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
            <HeaderBtns
              onPress={() => {}}
              image={ImagesSrc.topup}
              label={translate('wallet.common.buy')}
            />
          </View>
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
          <View style={styles.rowContainer}>
            <AppButton
              label={translate('wallet.common.later')}
              containerStyle={styles.outlinedButton}
              labelStyle={[
                CommonStyles.outlineButtonLabel,
                CommonStyles.text(Fonts.ARIAL, Colors.greyButtonLabel, RF(1.7)),
              ]}
              onPress={() => setIsBackedUp(true)}
            />
            <AppButton
              label={translate('wallet.common.backupNow')}
              containerStyle={styles.button}
              labelStyle={[
                CommonStyles.buttonLabel,
                CommonStyles.text(Fonts.ARIAL, Colors.white, RF(1.7)),
              ]}
              onPress={() => navigation.navigate('SecurityScreen')}
            />
          </View>
        </View>
      )}
      <Tokens
        values={balances}
        network={network}
        onTokenPress={item => {
          navigation.navigate('tokenDetail', {item});
        }}
        onRefresh={onRefreshToken}
      />
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
      <NetworkPicker
        visible={pickerVisible}
        onRequestClose={setPickerVisible}
        network={network}
        onItemSelect={item => {
          setNetwork(item);
          setPickerVisible(false);
        }}
      />
      <SelectToken
        visible={selectTokenVisible}
        onRequestClose={setSelectTokenVisible}
        values={balances}
        network={network}
        isSend={isSend}
        onTokenPress={item => {
          setSelectTokenVisible(false);
          if (isSend) {
            navigation.navigate('send', {item, type: item.type});
          } else {
            navigation.navigate('receive', {item, type: item.type});
          }
        }}
      />
    </AppBackground>
  );
};

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
    paddingHorizontal: wp('5%'),
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
    fontSize: RF(2.2),
    textAlign: 'center',
  },
  backupSubTitle: {
    color: Colors.tabLabel,
    fontSize: RF(1.4),
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: '47.5%',
    ...CommonStyles.button,
    marginTop: hp('3%'),
  },
  outlinedButton: {
    width: '47.5%',
    ...CommonStyles.outlineButton,
    marginTop: hp('3%'),
  },
});

export default Wallet;
