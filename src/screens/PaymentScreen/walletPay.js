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
import {translate, environment, tokens} from '../../walletUtils';
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
import { addTransaction, addEthTransaction, addBnbTransaction, addMaticTransaction, updateBalances } from '../../store/reducer/walletReducer';
import Fonts from '../../constants/Fonts';
import Separator from '../../components/separator';
import AppButton from '../../components/appButton';
import { setPaymentObject } from '../../store/reducer/paymentReducer';

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

    const {chainType} = route.params

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState(null);
    const [totalValue, setTotalValue] = useState(0);
    const [walletAccount, setWalletAccount] = useState();
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectTokenVisible, setSelectTokenVisible] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [network, setNetwork] = useState(chainType === 'polygon' ? {name: "Polygon",icon: ImagesSrc.matic} : {name: "BSC",icon: ImagesSrc.bnb});
    const [selectedObject, setSelectedObject] = useState(null);

    useEffect(()=>{
        console.log('useEffect')
        if(wallet && !isCreate && isFocused){
            setLoading(true);
            getBalances(wallet.address);
        }
        console.log('data',data);
    },[isFocused]);

    useEffect(() => {
        singleSocket.connectSocket().then(() => {
            ping(wallet.address);
        });

        const socketSubscribe = Events.asObservable().subscribe({
            next: (data) => {
                console.log('data', data);
                const response = JSON.parse(data);
                if (response.type == 'pong') {
                    connect(response.data);
                }
            }
        });

        return () => {
            socketSubscribe.unsubscribe();
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

    const IsActiveToPay = () => {
        let tnft = parseFloat(`${tnftBalance}`);
        let tal = parseFloat(`${talBalance}`);
        if(selectedObject){
            if(chainType === 'polygon' && tal > 0){
                return true;
            } else if(chainType === 'binance' && tnft > 0){
                return true;
            }else {
                return false;
            }
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

    const getBalances = (pubKey) => {
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
                setSelectedObject({
                    ...tokens[0],
                    tokenValue: responses[1]
                });
            }).catch((err) => {
                console.log('err', err);
                setLoading(false);
                reject();
            });
        });
    }

    const onRefreshToken = () => {
        return getBalances(wallet.address);
    }

    return (
        <AppBackground hideSafeArea lightStatus isBusy={loading}>
            <GradientBackground>
                <View style={styles.gradient}>

                    <View style={styles.header}>
                        <TextView style={styles.title}>{translate("wallet.common.pay")}</TextView>

                        <TouchableOpacity style={styles.networkIcon} hitSlop={{top:10,bottom:10,right:10,left:10}}
                            onPress={()=> {
                                // setPickerVisible(true)
                                }}>
                            <Image source={network.icon} style={[CommonStyles.imageStyles(6)]} />
                        </TouchableOpacity>
                    </View>

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
                onTokenPress={(item) => {
                    setSelectedObject(item);
                }}
                onRefresh={onRefreshToken}
            />

            <Separator style={styles.separator} />

            {selectedObject && <View style={styles.totalContainer}>
                <View style={styles.payObject}>
                    <Text style={styles.totalLabel}>{selectedObject.tokenName}</Text>
                    <Text style={styles.value}>{selectedObject.type} {selectedObject.tokenValue}</Text>
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
