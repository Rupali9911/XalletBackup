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
import {translate, environment} from '../../walletUtils';
import PriceText from '../../components/priceText';
import { HeaderBtns } from './components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import { wp, hp, RF } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import ToggleButtons from '../../components/toggleButton';
import Tokens from './components/Tokens';
import { useSelector, useDispatch } from 'react-redux';
import { balance, watchEtherTransfers, watchAllTransactions, watchBalanceUpdate, watchBnBBalance } from './functions';
import SingleSocket from '../../helpers/SingleSocket';
import { Events } from '../../App';
import AppHeader from '../../components/appHeader';
import NetworkPicker from './components/networkPicker';
import { updateCreateState } from '../../store/reducer/userReducer';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Web3 from 'web3';
import SelectToken from './components/SelectToken';
import { addTransaction, addEthTransaction, addBnbTransaction, addMaticTransaction, updateBalances } from '../../store/reducer/walletReducer';

const ethers = require('ethers');

const singleSocket = new SingleSocket();

var Accounts = require('web3-eth-accounts');
var accounts = new Accounts("")

const Wallet = ({route, navigation}) => {

    const {wallet, isCreate} = useSelector(state => state.UserReducer);
    const {ethBalance,bnbBalance,maticBalance} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(false);
    const[modalVisible, setModalVisible] = useState(isCreate);
    const [isSuccessVisible, setSuccessVisible] = useState(isCreate);
    const [isNotificationVisible, setNotificationVisible] = useState(false);
    const [balances, setBalances] = useState(null);
    const [totalValue, setTotalValue] = useState(0);
    const [walletAccount, setWalletAccount] = useState();
    const [pickerVisible, setPickerVisible] = useState(false);
    const [selectTokenVisible, setSelectTokenVisible] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const [network, setNetwork] = useState({name: "BSC",icon: ImagesSrc.bnb});

    let subscribeEth;
    let subscribeBnb;
    let subscribeMatic;

    useEffect(()=>{
        if(wallet && !isCreate && isFocused){
            setLoading(true);
            getBalances(wallet.address);
        }
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
            // const ethSubscription = watchEtherTransfers(wallet.address, 'eth', (trx) => {
            //     let transaction = {
            //         ...trx,
            //         value: Web3.utils.fromWei(trx.value, 'ether'),
            //         type: trx.from == wallet.address ? 'OUT' : trx.to == wallet.address ? 'IN' : ''
            //     }
            //     dispatch(addEthTransaction(transaction));
            // });

            // const bnbSubscription = watchEtherTransfers(wallet.address, 'bnb', (trx) => {
            //     let transaction = {
            //         ...trx,
            //         value: Web3.utils.fromWei(trx.value, 'ether'),
            //         type: trx.from == wallet.address ? 'OUT' : trx.to == wallet.address ? 'IN' : ''
            //     }
            //     dispatch(addBnbTransaction(transaction));
            // });

            // const polygonSubscription = watchEtherTransfers(wallet.address, 'matic', (trx) => {
            //     let transaction = {
            //         ...trx,
            //         value: Web3.utils.fromWei(trx.value, 'ether'),
            //         type: trx.from == wallet.address ? 'OUT' : trx.to == wallet.address ? 'IN' : ''
            //     }
            //     getBalances(wallet.address);
            //     dispatch(addMaticTransaction(transaction));
            // });

            // const subscribeAll = watchAllTransactions(wallet.address);
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
            subscribeEth && subscribeEth.unsubscribe((error, success) => {
                if(success){
                    console.log('ETH Successfully unsubscribed!');
                    subscribeEth == null;
                }
            });
            subscribeBnb && subscribeBnb.unsubscribe((error, success) => {
                if(success){
                    console.log('BNB Successfully unsubscribed!');
                    subscribeBnb == null;
                }
            });
            subscribeMatic && subscribeMatic.unsubscribe((error, success) => {
                if(success){
                    console.log('Matic Successfully unsubscribed!');
                    subscribeMatic == null;
                }
            });
        }

            return () => {
                // ethSubscription.unsubscribe();
                // bnbSubscription.unsubscribe();
                // polygonSubscription.unsubscribe();
                subscribeEth && subscribeEth.unsubscribe((error, success) => {
                    if(success)
                        console.log('Successfully unsubscribed!');
                });
                subscribeBnb && subscribeBnb.unsubscribe((error, success) => {
                    if(success)
                        console.log('Successfully unsubscribed!');
                });
                subscribeMatic && subscribeMatic.unsubscribe((error, success) => {
                    if(success)
                        console.log('Successfully unsubscribed!');
                });
            }
    },[network]);

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

    const onRefreshToken = () => {
        return getBalances(wallet.address);
    }

    return (
        <AppBackground hideSafeArea lightStatus isBusy={loading}>
            <GradientBackground>
                <View style={styles.gradient}>

                    <View style={styles.header}>
                        <ToggleButtons
                            labelLeft={translate("wallet.common.tokens")}
                            labelRight={translate("wallet.common.nfts")} />
                        
                        <TouchableOpacity style={styles.networkIcon} hitSlop={{top:10,bottom:10,right:10,left:10}}
                            onPress={()=>setPickerVisible(true)}>
                            <Image source={network.icon} style={[CommonStyles.imageStyles(6)]} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.balanceContainer}>
                        <PriceText price={setBalanceField()} isWhite containerStyle={styles.priceCont} />
                        <TextView style={styles.balanceLabel}>{translate("wallet.common.mainWallet")}</TextView>
                    </View>
                    
                    <View style={[styles.headerBtns, styles.headerBottomCont]} >
                        <HeaderBtns image={ImagesSrc.send} label={translate("wallet.common.send")}
                            onPress={() => {
                                setIsSend(true); setSelectTokenVisible(true)
                            }} />
                        <HeaderBtns image={ImagesSrc.receive} label={translate("wallet.common.receive")}
                            onPress={() => {
                                setIsSend(false); setSelectTokenVisible(true)
                            }} />
                        <HeaderBtns onPress={() => {}} image={ImagesSrc.topup} label={translate("wallet.common.buy")} />
                    </View>
                </View>
            </GradientBackground>

            <Tokens
                values={balances}
                network={network}
                onTokenPress={(item) => {
                    navigation.navigate("tokenDetail", { item });
                }}
                onRefresh={onRefreshToken}
            />

            <AppModal visible={modalVisible} onRequestClose={()=>setModalVisible(false)}>
                {isSuccessVisible ?
                    <SuccessModal
                        onClose={() => setModalVisible(false)}
                        onDonePress={() => {
                            setSuccessVisible(false);
                            setNotificationVisible(true);
                            dispatch(updateCreateState());
                        }}
                    />
                    : null}

                {isNotificationVisible ? 
                    <NotificationActionModal
                        onClose={() => setModalVisible(false)}
                        onDonePress={() => {
                            setModalVisible(false);
                            if(wallet){
                                setLoading(true);
                                getBalances(wallet.address);
                            }
                        }}
                    />
                    : null}
            </AppModal>

            <NetworkPicker 
                visible={pickerVisible} 
                onRequestClose={setPickerVisible}
                network={network}
                onItemSelect={(item) => {
                    setNetwork(item);
                    setPickerVisible(false);
                }}/>
            
            <SelectToken 
                visible={selectTokenVisible} 
                onRequestClose={setSelectTokenVisible}
                values={balances}
                network={network}
                isSend={isSend}
                onTokenPress={(item) => {
                    setSelectTokenVisible(false);
                    if(isSend){
                        navigation.navigate("send", { item, type: item.type });
                    } else {
                        navigation.navigate("receive", { item, type: item.type });
                    }
                    
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
        width: wp("70%"),
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
        alignItems: 'center'
    },
    networkIcon: {
        position: 'absolute',
        marginRight: wp("4%"),
        right: 0
    }
});

export default Wallet;