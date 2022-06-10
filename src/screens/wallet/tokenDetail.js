import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import GradientBackground from '../../components/gradientBackground';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { BASE_URL } from '../../common/constants';
import {
  addAllBnbTransactions,
  addAllEthTransactions,
  addAllMaticTransactions,
} from '../../store/reducer/walletReducer';
import testnet from "../../common/networkType"
import { environment, IsTestNet, translate } from '../../walletUtils';
import { HeaderBtns } from './components/HeaderButtons';
import History from './components/History';
import { balance } from './functions';
import { networkType } from '../../common/networkType'

const TokenDetail = ({ route, navigation }) => {
  const { } = route.params;
  const { wallet } = useSelector(state => state.UserReducer);
  const { ethBalance, bnbBalance, maticBalance, tnftBalance, talBalance, usdcBalance, wethBalance, busdBalance, usdtBalance } =
    useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(route.params.item);

  useEffect(() => {
    setLoading(true);
    // getData()
    //     .then(() => setLoading(false))
    //     .catch((err) => {
    //         console.log('err', err);
    //         setLoading(false);
    //     });
      getTransactionsByType(wallet?.address, item.network.toLowerCase(),item.type.toLowerCase());
      console.log("0101010101010",item.network)
  }, []);

  const getBalance = () => {
    let cont = '';
    let abi = '';
    let rpc = '';
    let type = '';

    switch (item.type) {
      case 'ETH':
        if (item.network!=="Polygon") {
          rpc = environment.ethRpc;
          type = 'eth';
        }else{
          rpc = environment.polRpc;
          type = 'eth';
        }
        break;
      case 'BNB':
        rpc = environment.bnbRpc;
        type = 'bnb';
        break;
      case 'Matic':
        rpc = environment.polRpc;
        type = 'matic';
        break;
      case 'USDT':
        cont = environment.usdtCont;
        abi = environment.usdtAbi;
        rpc = environment.ethRpc;
        type = 'usdt';
        break;
      case 'BUSD':
        cont = environment.busdCont;
        abi = environment.busdAbi;
        rpc = environment.bnbRpc;
        type = 'busd';
        break;
      case 'ALIA':
        cont = item.network === 'BSC' ? environment.tnftCont : environment.talCont;
        abi = environment.aliaAbi;
        rpc = item.network === 'BSC' ? environment.bnbRpc : environment.polRpc;
        type = 'alia';
        break;
      case 'USDC':
        cont = environment.usdcCont;
        abi = environment.usdcAbi;
        rpc = environment.polRpc;
        type = 'usdc';
        break;
      case 'WETH':
        cont = environment.wethCont;
        abi = environment.wethAbi;
        rpc = environment.polRpc;
        type = 'weth';
        break;
      default:
    }
    return balance(wallet?.address, cont, abi, rpc, type);
  };

  const getData = () => {
    return new Promise((resolve, reject) => {
      const requests = [getBalance()];

      Promise.all(requests)
        .then(responses => {
          console.log('responses ###############', responses);
          const balance = responses[0];
          let _item = item;
          _item.tokenValue = balance;
          setItem(_item);
          resolve();
        })
        .catch(err => {
          console.log('err', err);
          reject();
        });
    });
  };

  const getTokenValue = () => {
    let totalValue = 0;
    if (item.type == 'ETH' && item.network !== 'Polygon') {
      console.log("Item network",item.network)
      let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
      totalValue = value;
    } else if (item.type == 'BNB') {
      let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      totalValue = value;
    } else if (item.type == 'Matic') {
      let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type === 'TNFT') {
      console.log("Item network",item.network)
      let value = parseFloat(tnftBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'TAL') {
      console.log("Item network",item.network)
      let value = parseFloat(talBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'USDC') {
      let value = parseFloat(usdcBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type === 'ETH' && item.network === 'Polygon') {
      console.log("Item network",item.network)
      let value = parseFloat(`${wethBalance}`); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.network === 'BSC' && item.type == 'ALIA') {
      console.log("Item network",item.network)
      let value = parseFloat(tnftBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.network === 'Polygon' && item.type == 'ALIA') {
      console.log("Item network",item.network)
      let value = parseFloat(talBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'BUSD') {
      let value = parseFloat(busdBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'USDT') {
      let value = parseFloat(usdtBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    }

    return totalValue;
  };

  const getTransactionsByType = (address, type,coin) => {
    console.log("tal condition",coin)

    //coin === "tnft"||coin === "tal" ? coin = "alia" : coin

    console.log('address,type,coin', address, type,coin, `${BASE_URL}/xanawallet/fetch-transactions?addr=${address}&type=${type == 'ethereum' ? 'eth' : type}&networkType=${networkType}&coin=${coin}`)
    return new Promise((resolve, reject) => {
      fetch(
        `${BASE_URL}/xanawallet/fetch-transactions?addr=${address}&type=${type==="ethereum"?type="eth":type}&networkType=${networkType}&coin=${coin}`,
      )
        .then(response => {
           console.log('response1234512345', response);
          return response.json();
        })
        .then(res => {
          console.log('res', res);
          setLoading(false);
          if (res.success) {
            if (type == 'eth') {
              const array = [];
              res.data.map(_item => {
                array.push({
                  ..._item,
                  //value: Web3.utils.fromWei(trx.value, 'ether'),
                  type:
                    _item.from == wallet?.address
                      ? 'OUT'
                      : _item.to == wallet?.address
                        ? 'IN'
                        : '',
                });
              });
              array.reverse();
              dispatch(addAllEthTransactions(array));

            } else if (type == 'bsc') {
              const _array = [];
              res.data.map(_item => {
                _array.push({
                  ..._item,
                  type:
                    _item.from == wallet?.address
                      ? 'OUT'
                      : _item.to == wallet?.address
                        ? 'IN'
                        : '',
                });
              });
              _array.reverse();
              console.log('_array#########', _array);
              dispatch(addAllBnbTransactions(_array));
            } else if (type == 'polygon') {
              const __array = [];
              res.data.map(_item => {
                __array.push({
                  ..._item,
                  type:
                    _item.from == wallet?.address
                      ? 'OUT'
                      : _item.to == wallet?.address
                        ? 'IN'
                        : '',
                });
              });
              __array.reverse();
              console.log("ARRAY 987654321",__array)
              dispatch(addAllMaticTransactions(__array));

            }
          }
          resolve();
        })
        .catch(err => {
          console.log('err', err);
          setLoading(false);
          reject();
        });
    });
  };
  return (
    <AppBackground isBusy={loading}>
      <GradientBackground>
        <View style={styles.gradient}>
          <AppHeader showBackButton isWhite title={item.tokenName} />

          {item && (
            <View style={styles.balanceContainer}>
              <View style={styles.profileCont}>
                <Image style={styles.profileImage} source={item.icon} />
              </View>

              <NumberFormat
                value={getTokenValue()}
                displayType={'text'}
                decimalScale={4}
                thousandSeparator={true}
                renderText={formattedValue => (
                  <TextView style={styles.priceCont}>{formattedValue}</TextView>
                )}
              />

              {/*<View style={styles.tokenDetail}>*/}
              {/*<TextView style={styles.amount}>{item.amount}</TextView>*/}
              {/*<TextView style={styles.percent}>{item.percent}</TextView>*/}
              {/*</View>*/}
            </View>
          )}

          <View style={[styles.headerBtns, styles.headerBottomCont]}>
            <HeaderBtns
              onPress={() => {
                navigation.navigate('send', { item, type: item.type });
              }}
              image={ImagesSrc.send}
              label={translate('wallet.common.send')}
            />
            <HeaderBtns
              onPress={() => navigation.navigate('receive', { item })}
              image={ImagesSrc.receive}
              label={translate('wallet.common.receive')}
            />
            {/* <HeaderBtns
              onPress={() => {}}
              image={ImagesSrc.topup}
              label={translate('wallet.common.buy')}
            /> */}
          </View>
        </View>
      </GradientBackground>
      <History coin={item} onRefresh={getData} />
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  gradient: {},
  priceCont: {
    fontSize: RF(4),
    color: Colors.white,
    fontWeight: 'bold',
  },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: Colors.white,
    fontSize: RF(1.8),
  },
  profileCont: {
    ...CommonStyles.circle('15'),
  },
  profileImage: {
    ...CommonStyles.imageStyles(15),
  },
  tokenDetail: {
    position: 'absolute',
    right: 10,
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: RF(1.6),
    color: Colors.white,
    marginVertical: hp('0.1%'),
  },
  percent: {
    fontSize: RF(1.6),
    color: Colors.percentColor2,
    marginVertical: hp('0.1%'),
  },
});

export default TokenDetail;
