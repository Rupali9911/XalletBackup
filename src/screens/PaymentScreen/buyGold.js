import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Alert, FlatList, TouchableOpacity } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate, amountValidation, environment } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';
import Separator from '../../components/separator';

export const PaymentField = (props) => {

    return (
        <View style={[styles.inputMainCont, { paddingHorizontal: props.coin ? wp("3%") : 0}]} >
            {
                props.coin ?
                    props.coin :
                    <Text style={styles.inputLeft} >{translate("common.price")}</Text>

            }
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
            {
                props.coin ?
                    null :
                    <Text style={styles.inputRight} >{"$"}</Text>
            }
        </View>
    )
}

const BuyGold = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { wallet } = useSelector(state => state.UserReducer);

    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');

    const showErrorAlert = (msg) => {
        Alert.alert(msg);
    }

    const showSuccessAlert = () => {
        Alert.alert(
            translate("common.transferInProgress", { token: `${amount} ${type}` }),
            '',
            [
                {
                    text: 'OK',
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
                title={translate("wallet.common.buyGold")}
            />

            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.balanceContainer}>
                        <Image source={ImagesSrc.goldcoin} style={styles.balanceIcon} />
                        <NumberFormat
                            value={"1000"}
                            displayType={'text'}
                            decimalScale={2}
                            thousandSeparator={true}
                            renderText={(formattedValue) => <TextView style={styles.priceCont}>{formattedValue}</TextView>} />

                    </View>

                    <View style={styles.inputContainer}>
                        <PaymentField
                        coin={
                            <Image source={ImagesSrc.goldcoin} style={styles.coinStyle} />
                        }
                            type={null}
                            value={amount}
                            onChangeText={(e) => {
                                let value = amountValidation(e, amount);
                                if (value) {
                                    setAmount(value);
                                } else {
                                    setAmount('');
                                }

                            }} />
                    </View>

                    <FlatList
                        data={[500, 1000, 5000, 10000, 50000, 100000]}
                        renderItem={({ item, index }) => {
                            const isSelected = item == amount ? true : false;
                            return (
                                <TouchableOpacity style={[styles.listValueContainer, isSelected && { backgroundColor: Colors.themeColor }]} onPress={() => { setAmount(`${item}`) }}>
                                    <Image source={ImagesSrc.goldcoin} style={styles.coinStyle} />
                                    <NumberFormat
                                        value={item}
                                        displayType={'text'}
                                        decimalScale={2}
                                        thousandSeparator={true}
                                        renderText={(formattedValue) => <Text style={[styles.listValue, isSelected && { color: Colors.white }]}>{formattedValue}</Text>} />

                                </TouchableOpacity>
                            );
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: hp("2%") }} />}
                        keyExtractor={(item, index) => `_${index}`}
                    />

                </View>

                <Separator style={styles.separator} />

                <View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>{translate("wallet.common.totalAmountToPay")}</Text>
                        <Text style={styles.value}>$ 1,300</Text>
                    </View>
                    <AppButton label={translate("wallet.common.buyGold")} containerStyle={CommonStyles.button} labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            if (amount > 0) {

                            } else {
                                Alert.alert(translate("wallet.common.requireSendField"));
                            }
                        }} />
                </View>

            </View>

        </AppBackground>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp("5%"),
        paddingBottom: 0,
        paddingTop: 0
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
        fontSize: RF(1.6),
        color: Colors.black,
        fontFamily: Fonts.ARIAL
    },
    balanceContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp("3%"),
        paddingVertical: wp("1.5%"),
        marginBottom: hp("2%"),
        borderRadius: wp("4%"),
        borderWidth: 1,
        borderColor: Colors.borderLightColor2,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center'
    },
    balanceIcon: {
        width: wp("3.5%"),
        height: wp("3.5%"),
        marginRight: 5,
        resizeMode: "contain"
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
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(2.5)),
        flex: 1,
    },
    inputRight: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.topUpfieldRight, RF(1.8)),
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
        alignItems: 'center',
        flexDirection: 'row'
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp("1%")
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
        fontSize: RF(2.3),
        fontFamily: Fonts.ARIAL_BOLD,
        color: Colors.themeColor
    },
    listValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 3
    },
    coinStyle: {
        width: wp("5%"),
        height: wp("5%") ,
        resizeMode: "contain"
    },
    listValue: {
        fontFamily: Fonts.ARIAL_BOLD,
        color: Colors.themeColor,
        fontSize: RF(2.2)
    }
})

export default BuyGold;
