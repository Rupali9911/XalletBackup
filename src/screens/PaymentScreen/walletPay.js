import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import AppBackground from '../../components/appBackground';
import TextView from '../../components/appText';
import AppModal from '../../components/appModal';
import SuccessModal from '../../components/successModal';
import NotificationActionModal from '../../components/notificationActionModal';
import GradientBackground from '../../components/gradientBackground';
import NumberFormat from 'react-number-format';
import CommonStyles from '../../constants/styles';
import {translate, environment, tokens, networkChain} from '../../walletUtils';
import PriceText from '../../components/priceText';
import { HeaderBtns } from '../wallet/components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import { wp, hp, RF } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import ToggleButtons from '../../components/toggleButton';
import Tokens from '../wallet/components/Tokens';
import { useSelector, useDispatch } from 'react-redux';
import { balance, watchEtherTransfers, watchAllTransactions, watchBalanceUpdate, watchBnBBalance } from '../wallet/functions';
import SingleSocket from '../../helpers/SingleSocket';
import { Events } from '../../App';
import AppHeader from '../../components/appHeader';
import NetworkPicker from '../wallet/components/networkPicker';
import { updateCreateState } from '../../store/reducer/userReducer';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Web3 from 'web3';
import SelectToken from '../wallet/components/SelectToken';
import {updateBalances, updateEthereumBalances, updateBSCBalances, updatePolygonBalances} from '../../store/reducer/walletReducer';
import Fonts from '../../constants/Fonts';
import Separator from '../../components/separator';
import AppButton from '../../components/appButton';
import { setPaymentObject } from '../../store/reducer/paymentReducer';
import { blockChainConfig } from '../../web3/config/blockChainConfig';
import { divideNo } from '../../utils';
import { basePriceTokens } from '../../web3/config/availableTokens';

const ethers = require('ethers');

const singleSocket = new SingleSocket();

var Accounts = require('web3-eth-accounts');
var accounts = new Accounts("")

const WalletPay = ({route, navigation}) => {

    const {wallet, isCreate, data} = useSelector(state => state.UserReducer);
    const {paymentObject} = useSelector(state => state.PaymentReducer);
    const {ethBalance,bnbBalance,maticBalance, tnftBalance, talBalance} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const {chainType, price, priceStr, id, baseCurrency, ownerAddress, collectionAddress, allowedTokens} = route.params

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState(null);
    const [totalValue, setTotalValue] = useState(0);
    const [walletAccount, setWalletAccount] = useState();
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectTokenVisible, setSelectTokenVisible] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [network, setNetwork] = useState(chainType === 'polygon' ? networkChain[2] : chainType === 'ethereum' ? networkChain[0] : networkChain[1]);
    const [selectedObject, setSelectedObject] = useState(null);
    const [tradeCurrency, setTradeCurrency] = useState(null);
    const [priceInToken, setPriceInToken] = useState(price);
    const [activeTokens, setActiveTokens] = useState([]);

    let MarketPlaceAbi = "";
    let MarketContractAddress = "";
    let providerUrl = "";
    let ApproveAbi = "";

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
        MarketPlaceAbi = blockChainConfig[2].marketConConfig.abi;
        MarketContractAddress = blockChainConfig[2].marketConConfig.add;
        providerUrl = blockChainConfig[2].providerUrl;
        ApproveAbi = blockChainConfig[2].marketApproveConConfig.abi;
      }

    useEffect(()=>{
        console.log('useEffect')
        if(wallet && !isCreate && isFocused){
            setLoading(true);
            getBalances(wallet.address);
        }
        console.log('wallet pay use effect',data);
    },[isFocused]);

    useEffect(() => {
        if (allowedTokens.length > 0) {
            let array = [];
            allowedTokens.map(_ => {
                array.push(_.key.toLowerCase());
            });
            let result = tokens.filter((item) => {
                if(item.network.toLowerCase() === chainType){
                   if(array.includes(item.tokenName.toLowerCase())){
                    return true;
                   } else if(array.includes('alia') && (item.tokenName === 'TAL' || item.tokenName === 'TNFT')) {
                       return true;
                   } else {
                       return false;
                   }
                } else {
                    return false;
                }
            });
            setActiveTokens(result);
        } else {
            let result = tokens.filter(_ => {
                if(_.network.toLowerCase() === chainType && baseCurrency.key.toLowerCase() === _.tokenName.toLowerCase()){
                    return true;
                } else if(_.network.toLowerCase() === chainType && baseCurrency.key.toLowerCase() === 'alia' && (_.tokenName === 'TAL' || item.tokenName === 'TNFT')){
                    return true;
                } else {
                    return false;
                }
            });
            setActiveTokens(result);
        }
    },[]);

    useEffect(()=>{
        console.log('update Total',network);
        if(balances){
            if(network.name == 'Ethereum'){
                let value = parseFloat(ethBalance) //+ parseFloat(balances.USDT)
                console.log('value',value);
                setTotalValue(value);
            }else if(network.name == 'BSC'){
                let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
                console.log('value',value);
                setTotalValue(value);
            }else if(network.name == 'Polygon'){
                let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
                console.log('value',value);
                setTotalValue(value);
            }
        }
    },[network, ethBalance, bnbBalance, maticBalance]);

    const calculatePrice = async (tradeCurr) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        let MarketPlaceContract = new web3.eth.Contract(
          MarketPlaceAbi,
          MarketContractAddress
        );
        console.log('price & priceStr', price, priceStr);
        console.log(
            `priceStr_${priceStr}`,
            baseCurrency.order,
            tradeCurr,
            id,
            ownerAddress,
            collectionAddress
        )
        let res = await MarketPlaceContract.methods
          .calculatePrice(
            priceStr,
            baseCurrency.order,
            tradeCurr,
            id,
            ownerAddress,
            collectionAddress
          )
          .call();
        console.log("calculate price response", res, price);
        if (res) return res;
        else return "";
      }

    const setBalanceField = () => {
        let totalValue = 0;
        if(network.name == 'Ethereum'){
            let value = parseFloat(ethBalance) //+ parseFloat(balances.USDT)
            // console.log('Ethereum value',value);
            totalValue = value;
        }else if(network.name == 'BSC'){
            let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
            // console.log('BSC value',value);
            totalValue = value;
        }else if(network.name == 'Polygon'){
            let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
            // console.log('Polygon value',value);
            totalValue = value;
        }
        return totalValue;
    }

    const IsActiveToPay = async () => {
        let tnft = parseFloat(`${tnftBalance}`);
        let tal = parseFloat(`${talBalance}`);
        let balance = parseFloat(`${selectedObject?.tokenValue}`);
        if(selectedObject){
            if(tradeCurrency.approvalRequired){
                const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
                let approvalContract = new web3.eth.Contract(
                    ApproveAbi,
                    tradeCurrency.approvalAdd
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
            }else if(balance >= priceInToken){
                return true;
            }else{
                return false;
            }
            
            // if(chainType === 'polygon' && tal > 0){
            //     return true;
            // } else if(chainType === 'binance' && tnft > 0){
            //     return true;
            // }else {
            //     return false;
            // }
        }else{
            return false;
        }
        
    }

    const ping = async (public_key) => {
        console.log('accounts',public_key);
        let data = {
            "type": "ping",
            "data": {
                "type": "wallet",
                "publicKey": public_key
            }
        }
        return singleSocket.onSendMessage(data);
    }

    const getSig = (message) => {
        let wlt = accounts.privateKeyToAccount(wallet.privateKey);
        let sigMsg = wlt.sign(message, wallet.privateKey);
        return sigMsg.signature;
    }

    const connect = async (msg) => {
        console.log('connecting', msg);
        let data = {
            "type": "connect",
            "data": {
                "type": "wallet",
                "data": {
                    "walletId": wallet.address,
                    "publicKey": wallet.address,
                    "sig": `${getSig(msg)}`
                }
            }
        }
        singleSocket.onSendMessage(data);
    }

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
        if(network.name == 'BSC'){
            return getBSCBalances(pubKey);
        }else if(network.name == 'Ethereum'){
            return getEthereumBalances(pubKey);
        }else if(network.name == 'Polygon'){
            return getPolygonBalances(pubKey);
        }else {
            return new Promise((resolve, reject) => {
                let balanceRequests = [
                    balance(pubKey, "", "", environment.ethRpc, "eth"),
                    balance(pubKey, "", "", environment.bnbRpc, "bnb"),
                    balance(pubKey, "", "", environment.polRpc, "matic"),
                    balance(pubKey, environment.tnftCont, environment.tnftAbi, environment.bnbRpc, "alia"),
                    balance(pubKey, environment.talCont, environment.tnftAbi, environment.polRpc, "alia"),
                    // balance(pubKey, environment.usdtCont, environment.usdtAbi, environment.ethRpc, "usdt"),
                    // balance(pubKey, environment.busdCont, environment.busdAbi, environment.bnbRpc, "busd"),
                    // balance(pubKey, environment.aliaCont, environment.aliaAbi, environment.bnbRpc, "alia"),
                    // balance(pubKey, environment.usdcCont, environment.usdcAbi, environment.polRpc, "usdc")
                ];
    
                Promise.all(balanceRequests).then((responses) => {
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
                }).catch((err) => {
                    console.log('err', err);
                    setLoading(false);
                    reject();
                });
            });
        }
      };

    const onRefreshToken = () => {
        return getBalances(wallet.address);
    }

    const getCurrencyOnSelect = (item) => {
        let chain = item.network === 'BSC' ? 'binance' : item.network === 'Ethereum' ? 'ethereum' : item.network === 'Polygon' ? 'polygon' : ''
        let result = basePriceTokens.find(_ => {
            if(_.chain === chain){
                if(_.key.toLowerCase() === item.tokenName.toLowerCase()){
                    return true;
                }else if((item.tokenName === 'TAL' || item.tokenName === 'TNFT') && _.key.toLowerCase() === 'alia'){
                    return true;
                } else {
                    return false;
                }
            }else {
                return false;
            }
        });
        console.log('@@@@@@@@@@@@',result,item);
        return result;
    } 

    return (
        <AppBackground isBusy={loading}>
            <GradientBackground>
                <View style={styles.gradient}>
                <AppHeader
                    title={translate("wallet.common.pay")}
                    titleStyle={styles.title}
                />

                    <View style={styles.balanceContainer}>
                        <PriceText price={setBalanceField()} isWhite containerStyle={styles.priceCont} />
                        <TextView style={styles.balanceLabel}>{translate("wallet.common.mainWallet")}</TextView>
                    </View>

                    <View style={[styles.headerBtns, styles.headerBottomCont]} >
                        <HeaderBtns image={ImagesSrc.receive} label={translate("wallet.common.receive")}
                            onPress={() => {
                                // setIsSend(false); setSelectTokenVisible(true)
                            }} />
                        <HeaderBtns onPress={() => {}} image={ImagesSrc.topup} label={translate("wallet.common.buy")} />
                    </View>
                </View>
            </GradientBackground>

            <Tokens
                values={balances}
                network={network}
                allowedTokens={activeTokens}
                onTokenPress={async(item) => {
                    setSelectedObject(item);
                    let tradeCurrency = getCurrencyOnSelect(item);
                    setTradeCurrency(tradeCurrency);
                    let priceInToken = await calculatePrice(tradeCurrency.order);
                    console.log('value',parseFloat(divideNo(priceInToken)));
                    setPriceInToken(parseFloat(divideNo(priceInToken)));
                }}
                onRefresh={onRefreshToken}
            />

            <Separator style={styles.separator} />

            {selectedObject && <View style={styles.totalContainer}>
                <View style={styles.payObject}>
                    <Text style={styles.totalLabel}>{selectedObject.tokenName}</Text>
                    <Text style={styles.value}>{selectedObject.type} {priceInToken || price}</Text>
                </View>
                {!IsActiveToPay() && <TextView style={styles.alertMsg}>{translate("wallet.common.insufficientToken",{token: chainType === 'polygon'?'TAL':'TNFT'})}</TextView>}
            </View>}

            <View style={styles.buttonContainer}>
                
                <AppButton
                    label={translate("wallet.common.next")}
                    containerStyle={CommonStyles.button}
                    labelStyle={CommonStyles.buttonLabel}
                    onPress={() => {
                        // navigation.navigate("AddCard")
                        if(selectedObject && selectedObject.tokenValue !== '0'){
                            navigation.goBack();
                            dispatch(setPaymentObject({
                                item: selectedObject,
                                currency: tradeCurrency,
                                priceInToken,
                                type: 'wallet'
                            }));
                        }
                    }}
                    view={!IsActiveToPay()}
                />
            </View>

            <NetworkPicker
                visible={pickerVisible}
                onRequestClose={setPickerVisible}
                network={network}
                onItemSelect={(item) => {
                    setNetwork(item);
                    setPickerVisible(false);
                }}/>

        </AppBackground>
    );
}

const styles = StyleSheet.create({
    gradient: {
    },
    priceCont:{

    },
    headerBtns: {
        flexDirection: "row"
    },
    headerBottomCont: {
        width: wp("50%"),
        alignSelf: "center",
        paddingTop: hp('1%'),
        paddingBottom: hp('2%'),
    },
    balanceContainer: {
        marginVertical: hp("2%"),
        paddingBottom: hp("1.5%"),
        alignItems: 'center',
    },
    balanceLabel: {
        color: Colors.white,
        fontSize: RF(1.8)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: hp("2%")
    },
    networkIcon: {
        position: 'absolute',
        marginRight: wp("4%"),
        right: 0
    },
    buttonContainer: {
        paddingHorizontal: wp("5%"),
        paddingBottom: 0
    },
    totalContainer: {
        paddingHorizontal: wp("5%"),
        marginBottom: hp("2%")
    },
    payObject: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    separator: {
        width: wp("100%"),
        marginVertical: hp("2%")
    },
    totalLabel: {
        fontSize: RF(1.9),
        fontFamily: Fonts.ARIAL
    },
    value: {
        fontSize: RF(1.9),
        fontFamily: Fonts.ARIAL_BOLD,
        color: Colors.themeColor
    },
    title: {
        color: Colors.white,
        fontSize: RF(1.9)
    },
    alertMsg: {
        color: Colors.alert,
        fontSize: RF(1.5),
        marginVertical: hp("1%")
    }
});

export default WalletPay;
