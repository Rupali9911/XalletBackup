import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Web3 from 'web3';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import GradientBackground from '../../components/gradientBackground';
import PriceText from '../../components/priceText';
import Separator from '../../components/separator';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import {hp, RF, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import SingleSocket from '../../helpers/SingleSocket';
import {setPaymentObject} from '../../store/reducer/paymentReducer';
import {
  updateBalances,
  updateBSCBalances,
  updateEthereumBalances,
  updatePolygonBalances,
} from '../../store/reducer/walletReducer';
import {divideNo} from '../../utils';
import {environment, networkChain, tokens, translate} from '../../walletUtils';
import {basePriceTokens} from '../../web3/config/availableTokens';
import {blockChainConfig} from '../../web3/config/blockChainConfig';
import {HeaderBtns} from '../wallet/components/HeaderButtons';
import NetworkPicker from '../wallet/components/networkPicker';
import Tokens from '../wallet/components/Tokens';
import {balance} from '../wallet/functions';

const ethers = require('ethers');

const singleSocket = new SingleSocket();

var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('');

const WalletPay = ({route, navigation}) => {
  const {wallet, isCreate, data} = useSelector(state => state.UserReducer);
  const {paymentObject} = useSelector(state => state.PaymentReducer);
  const {ethBalance, bnbBalance, maticBalance, tnftBalance, talBalance} =
    useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const {
    chainType,
    price,
    priceStr,
    id,
    baseCurrency,
    ownerAddress,
    collectionAddress,
    allowedTokens,
    payableIn,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [walletAccount, setWalletAccount] = useState();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectTokenVisible, setSelectTokenVisible] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [network, setNetwork] = useState(
    chainType === 'polygon'
      ? networkChain[2]
      : chainType === 'ethereum'
      ? networkChain[0]
      : networkChain[1],
  );
  const [selectedObject, setSelectedObject] = useState(null);
  const [tradeCurrency, setTradeCurrency] = useState(null);
  const [priceInToken, setPriceInToken] = useState(price);
  const [activeTokens, setActiveTokens] = useState([]);

  let MarketPlaceAbi = '';
  let MarketContractAddress = '';
  let providerUrl = '';
  let ApproveAbi = '';

  if (chainType === 'polygon') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[1].marketConConfig.add;
    providerUrl = blockChainConfig[1].providerUrl;
    ApproveAbi = blockChainConfig[1].marketApproveConConfig.abi;
  } else if (chainType === 'binance') {
    MarketPlaceAbi = blockChainConfig[0].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[0].marketConConfig.add;
    providerUrl = blockChainConfig[0].providerUrl;
    ApproveAbi = blockChainConfig[0].marketApproveConConfig.abi;
  } else if (chainType === 'ethereum') {
    MarketPlaceAbi = blockChainConfig[1].marketConConfig.abi;
    MarketContractAddress = blockChainConfig[2].marketConConfig.add;
    providerUrl = blockChainConfig[2].providerUrl;
    ApproveAbi = blockChainConfig[2].marketApproveConConfig.abi;
  }

  useEffect(() => {
    console.log('useEffect');
    if (wallet && !isCreate && isFocused) {
      // setLoading(true);
      getBalances(wallet.address);
    }
    console.log('wallet pay use effect', data, route.params);
  }, [isFocused]);

  useEffect(() => {
    if (allowedTokens.length > 0 && payableIn == translate('common.allowedcurrency')) {
      let array = [];
      allowedTokens.map(_ => {
        array.push(_.key.toLowerCase());
      });
        console.log('tokens', tokens);
      let result = tokens.filter(item => {
          console.log('item', item);
        if (item.network.toLowerCase() === chainType) {
          console.log('same chain');
          if (array.includes(item.type.toLowerCase())) {
            console.log('same name');
            return true;
          } else if (
            array.includes('alia') &&
            (item.type === 'TAL' || item.type === 'TNFT')
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
     // console.log('result of active tokens', result);
      setActiveTokens(result);
    } else {
      if(payableIn){
        console.log("/////////". payableIn)
        let result = tokens.filter(_ => {
          if (
            _.network.toLowerCase() === chainType &&
            payableIn.toLowerCase() === _.tokenName.toLowerCase()
          ) {
            return true;
          } else if (
            _.network.toLowerCase() === chainType &&
            payableIn.toLowerCase() === 'alia' &&
            (_.tokenName === 'TAL' || _.tokenName === 'TNFT')
          ) {
            return true;
          } else {
            return false;
          }
        });
        setActiveTokens(result);
      }else{
        let result = tokens.filter(_ => {
          if (
            _.network.toLowerCase() === chainType &&
            baseCurrency?.key?.toLowerCase() === _.tokenName.toLowerCase()
          ) {
            return true;
          } else if (
            _.network.toLowerCase() === chainType &&
            baseCurrency?.key?.toLowerCase() === 'alia' &&
            (_.tokenName === 'TAL' || _.tokenName === 'TNFT')
          ) {
            return true;
          } else {
            return false;
          }
        });
        setActiveTokens(result);
      }
    }
  }, []);

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

  const calculatePrice = async tradeCurr => {
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    let MarketPlaceContract = new web3.eth.Contract(
      MarketPlaceAbi,
      MarketContractAddress,
    );
    console.log('price & priceStr', price, priceStr);
    console.log(
      `priceStr_${priceStr}`,
      baseCurrency.order,
      tradeCurr,
      id,
      ownerAddress,
      collectionAddress,
    );
    let res = await MarketPlaceContract.methods
      .calculatePrice(
        priceStr,
        baseCurrency.order,
        tradeCurr,
        id,
        ownerAddress,
        collectionAddress,
      )
      .call();
    console.log('calculate price response', res, price);
    if (res) return res;
    else return '';
  };

  const setBalanceField = () => {
    let totalValue = 0;
    if (network.name == 'Ethereum') {
      let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
      // console.log('Ethereum value',value);
      totalValue = value;
    } else if (network.name == 'BSC') {
      let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      // console.log('BSC value',value);
      totalValue = value;
    } else if (network.name == 'Polygon') {
      let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
      // console.log('Polygon value',value);
      totalValue = value;
    }
    return totalValue;
  };

  const IsActiveToPay = async () => {
    let tnft = parseFloat(`${tnftBalance}`);
    let tal = parseFloat(`${talBalance}`);
    let balance = parseFloat(`${selectedObject?.tokenValue}`);
    if (selectedObject) {
      if (tradeCurrency.approvalRequired) {
        const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        let approvalContract = new web3.eth.Contract(
          ApproveAbi,
          tradeCurrency.approvalAdd,
        );

        let decimals = await approvalContract.methods.decimals().call();
        if (
          parseInt(balance) / Math.pow(10, parseInt(decimals)) === 0 ||
          parseInt(balance) / Math.pow(10, parseInt(decimals)) < priceInToken
        ) {
          return false;
        } else {
          return true;
        }
      } else if (balance >= priceInToken) {
        return true;
      } else {
        return false;
      }

      // if(chainType === 'polygon' && tal > 0){
      //     return true;
      // } else if(chainType === 'binance' && tnft > 0){
      //     return true;
      // }else {
      //     return false;
      // }
    } else {
      return false;
    }
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

  const getCurrencyOnSelect = item => {
    let chain =
      item.network === 'BSC'
        ? 'binance'
        : item.network === 'Ethereum'
        ? 'ethereum'
        : item.network === 'Polygon'
        ? 'polygon'
        : '';
    let result = basePriceTokens.find(_ => {
      if (_.chain === chain) {
        if (_.key.toLowerCase() === item.type.toLowerCase()) {
          return true;
        } else if (
          (item.type === 'TAL' || item.type === 'TNFT') &&
          _.key.toLowerCase() === 'alia'
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
   // console.log('@@@@@@@@@@@@', result, item);
    return result;
  };

  // console.log(tokens)
  // console.log(basePriceTokens)
  return (
    <AppBackground isBusy={loading}>
      <GradientBackground>
        <View style={styles.gradient}>
          <AppHeader
            title={translate('wallet.common.pay')}
            titleStyle={styles.title}
          />

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
              image={ImagesSrc.receive}
              label={translate('wallet.common.receive')}
              onPress={() => {
                // setIsSend(false); setSelectTokenVisible(true)
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

      <Tokens
        values={balances}
        network={network}
        // allowedTokens={payableIn ? tokens.filter((item) => item.type == payableIn): tokens}
        allowedTokens={activeTokens}
        onTokenPress={async item => {
          setSelectedObject(item);
          let tradeCurrency = getCurrencyOnSelect(item);
          setTradeCurrency(tradeCurrency);
          let priceInToken = await calculatePrice(tradeCurrency.order);
          console.log('value', parseFloat(divideNo(priceInToken)));
          setPriceInToken(parseFloat(divideNo(priceInToken)));
        }}
        onRefresh={onRefreshToken}
      />

      <Separator style={styles.separator} />

      {selectedObject && (
        <View style={styles.totalContainer}>
          <View style={styles.payObject}>
            <Text style={styles.totalLabel}>{selectedObject.tokenName}</Text>
            <Text style={styles.value}>
              {selectedObject.type} {priceInToken || price}
            </Text>
          </View>
          {!IsActiveToPay() && (
            <TextView style={styles.alertMsg}>
              {translate('wallet.common.insufficientToken', {
                token: chainType === 'polygon' ? 'TAL' : 'TNFT',
              })}
            </TextView>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <AppButton
          label={translate('wallet.common.next')}
          containerStyle={CommonStyles.button}
          labelStyle={CommonStyles.buttonLabel}
          onPress={() => {
            // navigation.navigate("AddCard")
            if (selectedObject && selectedObject.tokenValue !== '0') {
              navigation.goBack();
              dispatch(
                setPaymentObject({
                  item: selectedObject,
                  currency: tradeCurrency,
                  priceInToken,
                  type: 'wallet',
                }),
              );
            }
          }}
          view={!IsActiveToPay()}
        />
      </View>

      <NetworkPicker
        visible={pickerVisible}
        onRequestClose={setPickerVisible}
        network={network}
        onItemSelect={item => {
          setNetwork(item);
          setPickerVisible(false);
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
    width: wp('50%'),
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
    paddingVertical: hp('2%'),
  },
  networkIcon: {
    position: 'absolute',
    marginRight: wp('4%'),
    right: 0,
  },
  buttonContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: 0,
  },
  totalContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  payObject: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: wp('100%'),
    marginVertical: hp('2%'),
  },
  totalLabel: {
    fontSize: RF(1.9),
    fontFamily: Fonts.ARIAL,
  },
  value: {
    fontSize: RF(1.9),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
  },
  title: {
    color: Colors.white,
    fontSize: RF(1.9),
  },
  alertMsg: {
    color: Colors.alert,
    fontSize: RF(1.5),
    marginVertical: hp('1%'),
  },
});

export default WalletPay;
