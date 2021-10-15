import React, { useState } from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    Modal,
    StyleSheet,
    SafeAreaView,
    Text,
} from 'react-native';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';
import { RF, wp, hp } from '../../constants/responsiveFunct';
import ButtonGroup from '../buttonGroup';
import { translate, CARD_MASK } from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import { useNavigation } from '@react-navigation/native';
import NotEnoughGold from './alertGoldModal';
import { useSelector, useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';
import { formatWithMask } from 'react-native-mask-input';
import { getPaymentIntent } from '../../store/reducer/paymentReducer';
import {useStripe} from '@stripe/stripe-react-native';

const PaymentNow = (props) => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {paymentObject} = useSelector(state => state.PaymentReducer);
    const {data} = useSelector(state => state.UserReducer);

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { visible, onRequestClose, NftId, price, chain } = props;
    const [opacity, setOpacity] = useState(0.88);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [notEnoughGoldVisible, setNotEnoughGoldVisible] = useState(false);

    const getTitle = () => {
        let title = "";
        if(paymentObject && paymentObject.type == 'card'){
            title = translate("wallet.common.payByCreditCard")
        }
        return title;
    }

    const _getPaymentIntent = () => {

        const params = {
            cardId: paymentObject.item.id,
            nftId: NftId,
            chainType: chain || "binance"
        }

        dispatch(getPaymentIntent(data.token, params)).then(res => {
            console.log('res',res);
        }).catch((err) => {
            console.log('err',err);
        });
    }

    const initializePaymentSheet = async (_data) => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = _data;

        const { error } = await initPaymentSheet({
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
        });
        if (!error) {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet({ clientSecret });

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType={'slide'}
            transparent
            onShow={() => setOpacity(0.88)}
            onRequestClose={() => {
                // setOpacity(0);
                onRequestClose();
            }}>
            <View style={[styles.container, { backgroundColor: Colors.whiteOpacity(opacity) }]}>
                <TouchableOpacity style={styles.emptyArea} onPress={() => {
                    // setOpacity(0);
                    onRequestClose();
                }} />
                <View style={styles.contentContainer}>
                    <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={() => {
                        // setOpacity(0);
                        onRequestClose();
                    }}>
                        <Image style={styles.closeIcon} source={ImagesSrc.cancelIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{getTitle()}</Text>

                    <Text style={styles.balance}>{translate("wallet.common.balanceAmount")}</Text>
                    
                    <View style={styles.valueContainer}>
                        <Text style={styles.symbol} >$</Text>
                        <NumberFormat
                            value={price || 0}
                            displayType={'text'}
                            decimalScale={4}
                            thousandSeparator={true}
                            renderText={formattedValue => <Text numberOfLines={1} style={styles.amount}>{formattedValue}</Text>} // <--- Don't forget this!
                        />
                    </View>
                    

                    <Separator style={styles.separator}/>

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>{translate("wallet.common.topup.creditCard")}</Text>
                        {paymentObject && <Text style={styles.cardNumber}>
                            {formatWithMask({
                                text: `424242424242${paymentObject.item.last4}`,
                                mask: CARD_MASK
                            }).obfuscated}
                        </Text>}
                        <TouchableOpacity style={styles.editContainer} onPress={() => {
                            navigation.navigate("Cards",{})
                            onRequestClose();
                        }}>
                            <Image source={ImagesSrc.edit} style={CommonStyles.imageStyles(3)}/>
                        </TouchableOpacity>
                    </View>

                    <Separator style={styles.separator}/>

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>{translate("wallet.common.totalAmount")}</Text>
                        <Text style={styles.value}>$ {price}</Text>
                    </View>

                    {selectedMethod == 2 && <Text style={styles.goldValue}><Image source={ImagesSrc.goldcoin}/> {price}</Text>}

                    <AppButton
                        label={translate("wallet.common.next")}
                        containerStyle={CommonStyles.button}
                        labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            if(NftId && paymentObject){
                                _getPaymentIntent();
                            }
                        }}
                    />

                </View>
                <SafeAreaView style={{ backgroundColor: Colors.white }} />
            </View>
            <NotEnoughGold
                visible={notEnoughGoldVisible}
                onNavigate={() => {
                    onRequestClose();
                    setNotEnoughGoldVisible(false);
                }}
                onRequestClose={() => {
                    setNotEnoughGoldVisible(false)
                }}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        flex: 1
    },
    container: {
        flex: 1,
    },
    emptyArea: {
        flex: 1
    },
    contentContainer: {
        backgroundColor: Colors.white,
        padding: "4%",
        borderTopLeftRadius: wp("4%"),
        borderTopRightRadius: wp("4%"),
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        
        elevation: 5,
    },
    closeIcon: {
        alignSelf: 'flex-end',
        ...CommonStyles.imageStyles(5)
    },
    title: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2),
        alignSelf: 'center',
        marginVertical: wp("3%"),
        marginBottom: hp("3%")        
    },
    optionContainer: {
        backgroundColor: Colors.WHITE3,
        borderRadius: wp("1%")
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: hp("1%"),
        marginVertical: hp("2.5%")
    },
    separator: {
        width: wp("100%"), 
        // marginVertical: hp("2%")
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
    goldValue: {
        fontSize: RF(2.3),
        fontFamily: Fonts.ARIAL_BOLD,
        color: Colors.themeColor,
        alignSelf: 'flex-end',
        marginBottom: hp("1%")
    },
    balance: {
        fontSize: RF(1.8),
        fontFamily: Fonts.ARIAL,
        marginVertical: hp("1.5%"),
        alignSelf: 'center'
    },
    amount: {
        fontSize: RF(4.2),
        fontFamily: Fonts.ARIAL,
        color: Colors.themeColor,
    },
    valueContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: hp("3%"),
    },
    symbol: {
        fontSize: RF(2),
        fontFamily: Fonts.ARIAL,
        color: Colors.themeColor,
        marginTop: hp("0.5%")
    },
    cardNumber: {
        color: Colors.themeColor,
        fontSize: RF(1.8),
        fontFamily: Fonts.ARIAL
    },
    editContainer: {
        position: 'absolute',
        right: -5,
        top: -15
    }
});

export default PaymentNow;