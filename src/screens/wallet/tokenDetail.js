import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import NumberFormat from 'react-number-format';
import {useDispatch, useSelector} from 'react-redux';
import Web3 from 'web3';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import GradientBackground from '../../components/gradientBackground';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import {hp, RF, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {NEW_BASE_URL} from '../../common/constants';
import {
  addAllBnbTransactions,
  addAllEthTransactions,
  addAllMaticTransactions,
  addAllXetaTransactions,
} from '../../store/reducer/walletReducer';
import testnet from '../../common/networkType';
import {
  environment,
  IsTestNet,
  translate,
  getConfigDetailsFromEnviorment,
} from '../../walletUtils';
import {HeaderBtns} from './components/HeaderButtons';
import History from './components/History';
import {balance} from './functions';
import {networkType} from '../../common/networkType';
import {Loader} from '../../components';
import sendRequest, {getWallet} from '../../helpers/AxiosApiRequest';
import MultiActionModal from '../certificateScreen/MultiActionModal';

const TokenDetail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const environment = IsTestNet ? 'testnet' : 'mainnet';

  const {
    ethBalance,
    bnbBalance,
    maticBalance,
    tnftBalance,
    talBalance,
    usdcBalance,
    wethBalance,
    busdBalance,
    usdtBalance,
    xetaBalance,
    networkType,
  } = useSelector(state => state.WalletReducer);

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState(route.params.item);
  const [wallet, setWallet] = useState(null);

  const config = getConfigDetailsFromEnviorment(networkType?.name, item.type);
  const [backupPhrasePopup, setBackupPhrasePopup] = useState(false);
  const {isBackup} = useSelector(state => state.UserReducer);

  useEffect(async () => {
    setLoading(true);
    let wallet = await getWallet();
    setWallet(wallet);
    // getData()
    //     .then(() => setLoading(false))
    //     .catch((err) => {
    //         setLoading(false);
    //     });
    getTransactionsByType(
      wallet?.address,
      item.network.toLowerCase(),
      item.type,
    );
  }, []);

  // const getBalance = () => {
  //     let cont = '';
  //     let abi = '';
  //     let rpc = '';
  //     let type = '';

  //     switch (item.type) {
  //         case 'ETH':
  //             rpc = environment.ethRpc;
  //             type = 'eth';
  //             break;
  //         case 'BNB':
  //             rpc = environment.bnbRpc;
  //             type = 'bnb';
  //             break;
  //         case 'Matic':
  //             rpc = environment.polRpc;
  //             type = 'matic';
  //             break;
  //         case 'USDT':
  //             cont = environment.usdtCont;
  //             abi = environment.usdtAbi;
  //             rpc = environment.ethRpc;
  //             type = 'usdt';
  //             break;
  //         case 'BUSD':
  //             cont = environment.busdCont;
  //             abi = environment.busdAbi;
  //             rpc = environment.bnbRpc;
  //             type = 'busd';
  //             break;
  //         case 'ALIA':
  //             cont = item.network === 'BSC' ? environment.tnftCont : environment.talCont;
  //             abi = environment.aliaAbi;
  //             rpc = item.network === 'BSC' ? environment.bnbRpc : environment.polRpc;
  //             type = 'alia';
  //             break;
  //         case 'USDC':
  //             cont = environment.usdcCont;
  //             abi = environment.usdcAbi;
  //             rpc = environment.polRpc;
  //             type = 'usdc';
  //             break;
  //         case "WETH":
  //             cont = environment.wethCont;
  //             abi = environment.wethAbi;
  //             rpc = environment.polRpc;
  //             type = 'weth';
  //             break;
  //         default:
  //     }
  //     return balance(wallet?.address, cont, abi, rpc, type);
  // };

  const getData = () => {
    return new Promise((resolve, reject) => {
      getTransactionsByType(
        wallet?.address,
        item.network.toLowerCase(),
        item.type,
      )
        .then(responses => {
          resolve();
        })
        .catch(err => {
          reject();
        });

      // const requests = [getBalance()];
      // Promise.all(requests)
      //     .then(responses => {
      //         const balance = responses[0];
      //         let _item = item;
      //         _item.tokenValue = balance;
      //         setItem(_item);
      //         resolve();
      //     })
      //     .catch(err => {
      //         reject();
      //     });
    });
  };

  const getTokenValue = () => {
    let totalValue = 0;
    if (item.type == 'ETH' && item.network !== 'Polygon') {
      let value = parseFloat(ethBalance); //+ parseFloat(balances.USDT)
      totalValue = value;
    } else if (item.type == 'BNB') {
      let value = parseFloat(bnbBalance); //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
      totalValue = value;
    } else if (item.type == 'Matic') {
      let value = parseFloat(maticBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type === 'TNFT') {
      let value = parseFloat(tnftBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'TAL') {
      let value = parseFloat(talBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'USDC') {
      let value = parseFloat(usdcBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type === 'WETH' && item.network === 'Polygon') {
      let value = parseFloat(wethBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.network === 'BSC' && item.type == 'ALIA') {
      let value = parseFloat(tnftBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.network === 'Polygon' && item.type == 'ALIA') {
      let value = parseFloat(talBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'BUSD') {
      let value = parseFloat(busdBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'USDT') {
      let value = parseFloat(usdtBalance); //+ parseFloat(balances.USDC)
      totalValue = value;
    } else if (item.type == 'XETA') {
      let value = parseFloat(xetaBalance);
      totalValue = value;
    }

    return totalValue;
  };

  const getTransactionsByType = (address, type, coin) => {
    return new Promise((resolve, reject) => {
      let apiRequest = {};
      let params = {
        address,
        networkId: networkType?.id,
        environment,
      };
      if (
        coin !== 'BNB' &&
        coin !== 'ETH' &&
        coin !== 'Matic' &&
        coin !== 'XETA'
      ) {
        params.tokenName = coin;
        params.contractAddress = config.ContractAddress;
        //=================== API Request object ======================
        apiRequest.url = `${NEW_BASE_URL}/mobile/history`;
        apiRequest.method = 'GET';
        apiRequest.params = params;
      } else if (coin === 'XETA' && environment !== 'testnet') {
        apiRequest.url = `https://api.xanalia.com/xanachain/xanaChainHistory`;
        apiRequest.method = 'POST';
        apiRequest.data = {
          address: address,
        };
      } else {
        if (coin === 'XETA' && environment === 'testnet') {
          setLoading(false);
          reject();
          return;
        }
        apiRequest.url = `${NEW_BASE_URL}/mobile/history`;
        apiRequest.method = 'GET';
        apiRequest.params = params;
      }
      sendRequest(apiRequest)
        .then(res => {
          setLoading(false);
          if (res.success) {
            if (type == 'ethereum') {
              if (res.data.length !== 0)
                dispatch(addAllEthTransactions(res.data));
            } else if (type == 'bsc') {
              if (res.data.length !== 0)
                dispatch(addAllBnbTransactions(res.data));
            } else if (type == 'polygon') {
              if (res.data.length !== 0)
                dispatch(addAllMaticTransactions(res.data));
            } else if (type == 'xanachain') {
              if (res.data.length !== 0)
                dispatch(addAllXetaTransactions(res.data));
            }
          }
          resolve();
        })
        .catch(err => {
          setLoading(false);
          reject();
        });
    });
  };
  return (
    <AppBackground
    //isBusy={loading}
    >
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
                decimalScale={8}
                thousandSeparator={false}
                renderText={formattedValue => (
                  <TextView style={styles.priceCont}>
                    {Number(formattedValue)}
                  </TextView>
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
                isBackup
                  ? navigation.navigate('send', {
                      item,
                      type: item.type,
                      tokenInfo: route.params.tokenInfo,
                    })
                  : setBackupPhrasePopup(true);
              }}
              image={ImagesSrc.send}
              label={translate('wallet.common.send')}
            />
            <HeaderBtns
              onPress={() =>
                isBackup
                  ? navigation.navigate('receive', {item})
                  : setBackupPhrasePopup(true)
              }
              image={ImagesSrc.receive}
              label={translate('wallet.common.receive')}
            />
            {/* <HeaderBtns
              onPress={() => {}}
              image={ImagesSrc.topup}
              label={translate('wallet.common.buy')}
            /> */}
          </View>
          <MultiActionModal
            isVisible={backupPhrasePopup}
            closeModal={() => setBackupPhrasePopup(false)}
            navigation={navigation}
          />
        </View>
      </GradientBackground>
      {loading ? <Loader /> : <History coin={item} onRefresh={getData} />}
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
