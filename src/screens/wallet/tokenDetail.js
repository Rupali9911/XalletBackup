import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import AppBackground from '../../components/appBackground';
import TextView from '../../components/appText';
import AppModal from '../../components/appModal';
import SuccessModal from '../../components/successModal';
import NotificationActionModal from '../../components/notificationActionModal';
import GradientBackground from '../../components/gradientBackground';
import NumberFormat from 'react-number-format';
import CommonStyles from '../../constants/styles';
import { translate, environment } from '../../walletUtils';
import PriceText from '../../components/priceText';
import { HeaderBtns } from './components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import { wp, hp, RF } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import ToggleButtons from '../../components/toggleButton';
import Tokens from './components/Tokens';
import AppHeader from '../../components/appHeader';
import Fonts from '../../constants/Fonts';
import History from './components/History';
import { balance } from './functions';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { getTransactions } from '../../store/reducer/walletReducer';

const TokenDetail = ({ route, navigation }) => {

    const {} = route.params;
    const { wallet } = useSelector(state => state.UserReducer);
    const {ethBalance,bnbBalance,maticBalance} = useSelector(state => state.WalletReducer);
    const dispatch = useDispatch();

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(route.params.item);

    useEffect(()=>{
        setLoading(true);
        // getData()
        //     .then(() => setLoading(false))
        //     .catch((err) => {
        //         console.log('err', err);
        //         setLoading(false);
        //     });


        getTransactionsByType(wallet.address, item.network.toLowerCase());
    },[]);

    const getBalance = () => {
        let cont = "";
        let abi = "";
        let rpc = "";
        let type = "";

        switch(item.type){
            case 'ETH':
                rpc = environment.ethRpc;
                type = 'eth';
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
                cont = environment.aliaCont;
                abi = environment.aliaAbi;
                rpc = environment.bnbRpc;
                type = 'alia';
                break;
            case 'USDC':
                cont = environment.usdcCont;
                abi = environment.usdcAbi;
                rpc = environment.polRpc;
                type = 'usdc';
                break;
            default:
        }
        return balance(wallet.address, cont, abi, rpc, type);
    }

    const getData = () => {
        return new Promise((resolve, reject) => {
            const requests = [
                getBalance(),
            ]

            Promise.all(requests).then((responses) => {
                console.log('responses',responses);
                const balance = responses[0];
                let _item = item;
                _item.tokenValue = balance;
                setItem(_item);
                resolve();
            }).catch((err) => {
                console.log('err', err);
                reject();
            });
        });
    }

    const getTokenValue = () => {
        let totalValue = 0;
        if(item.type == 'ETH'){
            let value = parseFloat(ethBalance) //+ parseFloat(balances.USDT)
            console.log('Ethereum value',value);
            totalValue = value;
        }else if(item.type == 'BNB'){
            let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
            console.log('BSC value',value);
            totalValue = value;
        }else if(item.type == 'Matic'){
            let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
            console.log('Polygon value',value);
            totalValue = value;
        }
        return totalValue;
    }

    const getTransactionsByType = (address, type) => {
        fetch(`https://testapi.xanalia.com/xanawallet/fetch-transactions?addr=${address}&type=${type}`,{
            method: 'GET',
            headers: {
                Accept: '*/*',
                'content-type': 'application/json'
            },
        }).then((response) => {
            console.log('response',response);
            return ""
        })
        .then((res) => {
            console.log('res');
            setLoading(false);
        }).catch((err) => {
            console.log('err',err);
            setLoading(false);
        });
    }

    return (
        <AppBackground hideSafeArea lightStatus isBusy={loading}>
            <GradientBackground>
                <View style={styles.gradient}>

                    <AppHeader
                        showBackButton
                        isWhite
                        title={item.tokenName}
                    />

                    {item &&
                        <View style={styles.balanceContainer}>
                            <View style={styles.profileCont} >
                                <Image style={styles.profileImage} source={item.icon} />
                            </View>

                            <NumberFormat
                                value={getTokenValue()}
                                displayType={'text'}
                                decimalScale={4}
                                thousandSeparator={true}
                                renderText={(formattedValue) => <TextView style={styles.priceCont}>{formattedValue}</TextView>} />

                            <View style={styles.tokenDetail}>
                                <TextView style={styles.amount}>{item.amount}</TextView>
                                <TextView style={styles.percent}>{item.percent}</TextView>
                            </View>
                        </View>
                    }

                    <View style={[styles.headerBtns, styles.headerBottomCont]} >
                        <HeaderBtns onPress={() => { navigation.navigate("send", {item, type: item.type}) }} image={ImagesSrc.send} label={translate("common.send")} />
                        <HeaderBtns onPress={() => navigation.navigate("receive", {item})} image={ImagesSrc.receive} label={translate("common.receive")} />
                        <HeaderBtns onPress={() => { }} image={ImagesSrc.topup} label={translate("common.buy")} />
                    </View>
                </View>
            </GradientBackground>
            <History coin={item} onRefresh={getData}/>

        </AppBackground>
    );
}

const styles = StyleSheet.create({
    gradient: {
    },
    priceCont: {
        fontSize: RF(4),
        color: Colors.white,
        fontWeight: 'bold'
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    balanceLabel: {
        color: Colors.white,
        fontSize: RF(1.8)
    },
    profileCont: {
        ...CommonStyles.circle("15")
    },
    profileImage: {
        ...CommonStyles.imageStyles(15),
    },
    tokenDetail: {
        position: 'absolute',
        right: 10,
        alignItems: 'flex-end'
    },
    amount: {
        fontSize: RF(1.6),
        color: Colors.white,
        marginVertical: hp("0.1%"),
    },
    percent: {
        fontSize: RF(1.6),
        color: Colors.percentColor2,
        marginVertical: hp("0.1%")
    },
});

export default TokenDetail;