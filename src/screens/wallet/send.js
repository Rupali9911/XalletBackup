import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate, amountValidation, environment } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import {transfer} from './functions';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';

export const AddressField = (props) => {

    return (
        <View style={[styles.inputMainCont]} >
            <Text style={styles.inputLeft} >{translate("wallet.common.walletAddress")}</Text>
            <TextInput
                style={[styles.inputCont, styles.paymentField]}
                placeholder=""
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}
                editable={props.editable}
            />
        </View>
    )
}

export const PaymentField = (props) => {

    return (
        <View style={[styles.inputMainCont]} >
            <Text style={styles.inputLeft} >{translate("wallet.common.amount")}</Text>
            <TextInput
                style={[styles.inputCont, styles.paymentField]}
                keyboardType='decimal-pad'
                placeholder="0"
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}
                editable={props.editable}
            />
            <Text style={styles.inputRight} >{props.type}</Text>
        </View>
    )
}

const Send = ({route, navigation}) => {

    const dispatch = useDispatch();
    const {wallet} = useSelector(state => state.UserReducer);
    const {ethBalance,bnbBalance,maticBalance} = useSelector(state => state.WalletReducer);

    const {item,type} = route.params;

    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState('');

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

    const transferAmount = async () => {
        const publicAddress = wallet.address;
        const privKey = wallet.privateKey;        
        const toAddress = address;
        setLoading(true);
        switch(type){
            case 'ETH':
                // let ethBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "eth", "", "", environment.ethRpc, 10, 21000).then((ethBalance)=>{
                    console.log("ethBalance", ethBalance);
                    if(ethBalance.success){
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'USDT':
                // let usdtBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "usdt", environment.usdtCont, environment.usdtAbi, environment.ethRpc, 10, 81778).then((usdtBalance)=>{
                    console.log("usdtBalance", usdtBalance);
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'BNB':
                // let bnbBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "bnb", "", "", environment.bnbRpc, 10, 21000).then((bnbBalance)=>{
                    console.log("bnbBalance", bnbBalance);
                    if(bnbBalance.success){
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'BUSD':
                // let busdBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "busd", environment.busdCont, environment.busdAbi, environment.bnbRpc, 10, 81778).then((busdBalance)=>{
                    console.log("busdBalance", busdBalance);
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'ALIA':
                // let aliaBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "alia", environment.aliaCont, environment.aliaAbi, environment.bnbRpc, 10, 81778).then((aliaBalance)=>{
                    console.log("aliaBalance", aliaBalance);
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'Matic':
                // let maticBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "matic", "", "", environment.polRpc, 10, 21000).then((maticBalance)=>{
                    console.log("maticBalance", maticBalance);
                    if(maticBalance.success){
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            case 'USDC':
                // let usdcBalance = await 
                transfer(publicAddress, privKey, amount, toAddress, "usdc", environment.usdcCont, environment.usdcAbi, environment.polRpc, 10, 81778).then((usdcBalance)=>{
                    console.log("usdcBalance", usdcBalance);
                    setLoading(false);
                }).catch((err)=>{
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });
                
                return;
            default:
        }
    }

    const verifyAddress = (address) => {
        return Web3.utils.isAddress(address);
    }

    const showErrorAlert = (msg) => {
        alertWithSingleBtn(
            translate('common.error'),
            msg
        )
    }

    const showSuccessAlert = () => {
        Alert.alert(
            translate("wallet.common.transferInProgress", {token: `${amount} ${type}`}),
            '',
            [
                {
                    text: translate('wallet.common.ok'),
                    onPress: () => {
                        navigation.popToTop();
                    }
                }
            ]
        );
    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader
                showBackButton={true}
                title={translate("wallet.common.send")}
            />

            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.balanceContainer}>
                        <View style={styles.profileCont} >
                            <Image style={styles.profileImage} source={item.icon} />
                        </View>

                        <NumberFormat
                            value={getTokenValue()}
                            displayType={'text'}
                            decimalScale={2}
                            thousandSeparator={true}
                            renderText={(formattedValue) => <TextView style={styles.priceCont}>{formattedValue}</TextView>} />

                    </View>
                    <View style={styles.inputContainer}>
                        <AddressField 
                            onChangeText={setAddress}
                            onSubmitEditing={(txt) => {
                                // verifyAddress(txt);
                            }}/>
                        
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <PaymentField 
                            type={type} 
                            value={amount}
                            onChangeText={(e) => {
                                let value = amountValidation(e, amount);
                                if(value){
                                    setAmount(value);
                                }else {
                                    setAmount('');
                                }
                                
                            }}/>
                    </View>
                </View>
                <AppButton label={translate("wallet.common.send")} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                    onPress={() => {
                        if(address !== '' && amount > 0){
                            if (parseFloat(amount) <= parseFloat(`${item.tokenValue}`)) {
                                if (verifyAddress(address)) {
                                    transferAmount();
                                } else {
                                    showErrorAlert(translate("wallet.common.invalidAddress"));
                                }
                            }
                            else {
                                showErrorAlert(translate("wallet.common.insufficientFunds"));
                            }  
                        }else{
                            showErrorAlert(translate("wallet.common.requireSendField"));
                        }
                    }} />
            </View>

        </AppBackground>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp("5%")
    },
    contentContainer: {
        flex: 1,
    },
    inputContainer: {
        marginVertical: hp("3%")
    },
    input: {
        padding: wp("2%"),
        backgroundColor: Colors.inputBackground,
        color: Colors.black,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: RF(2)
    },
    inputLabel: {
        fontSize: RF(2.2),
        fontWeight: 'bold',
        paddingVertical: wp("2%")
    },
    priceCont: {
        fontSize: RF(4),
        color: Colors.black,
        fontWeight: 'bold'
    },
    balanceContainer: {
        marginVertical: hp("2%"),
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileCont: {
        ...CommonStyles.circle("15")
    },
    profileImage: {
        ...CommonStyles.imageStyles(15),
    },
    inputCont: {
        paddingHorizontal: wp("1%")
    },
    inputLeft: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.inputLeftPayment, RF(1.4))
    },
    paymentField: {
        textAlign: "right",
        paddingHorizontal: wp("2%"),
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(2)),
        flex: 1,
    },
    inputRight: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.topUpfieldRight, RF(1.8)),
        marginTop: hp('0.5%')
    },
    inputBottom: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.inputBottomPayment, RF(1.6)),
        textAlign: "right",
        marginRight: wp("1%")
    },
    inputMainCont: {
        width: "100%",
        paddingVertical: hp("1%"),
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColorInput,
        alignSelf: "center",
        flexDirection: 'row'
    },
})

export default Send;
