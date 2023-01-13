import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import { useSelector } from 'react-redux';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import { BlurView } from "@react-native-community/blur";

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import TextView from '../../components/appText';
import { HeaderBtns } from './components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import { Button } from 'react-native-paper';
import VerticalSeparator from '../../components/verticalSeparator';
import Separator from '../../components/separator';
import { Portal } from '@gorhom/portal';

// import { PaymentField } from './screenComponents';
// import { alertWithSingleBtn } from "./commonFunction";

const QRScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const { item } = route.params;

    // console.log('item', item);

    const { userData } = useSelector((state) => state.UserReducer);
    const wallet = userData?.userWallet;

    const [price, setPrice] = useState("");
    const [showShare, setShowShare] = useState(false);
    const [qrData, setQrData] = useState(wallet?.address);
    const [modalVisible, setModalVisible] = useState(false);
    const [copyAddress, setCopyAddress] = useState(false);

    useEffect(() => {
        setQrData(wallet?.address + ' ');
        if (Number(price) !== 0) {
            setQrData(wallet?.address + ' ' + price)
        } else {
            setQrData(wallet.address);
        }
    }, [price])

    let qrRef = useRef(null);

    const onSharing = () => {
        qrRef && qrRef.capture().then(uri => {
            // console.log("do something with ", uri);
            let options = {
                title: "Share code",
                url: `${uri}`,
            };

            Share.open(options)
                .then((res) => {
                    // console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
        });
    }

    const copyToClipboard = () => {
        Clipboard.setString(wallet?.address);
        setCopyAddress(true);
        setTimeout(() => {
            setCopyAddress(false);
        }, 700);
    }

    return (
        <View style={[styles.scene]} >
            <View style={styles.QRContainer}>
                <ViewShot ref={(ref) => qrRef = ref} options={{ result: 'data-uri' }}>
                    <TouchableOpacity disabled style={styles.qrCodeImage} onPress={() => navigation.navigate("Pay", { title: translate("wallet.common.received"), label: `${translate("wallet.common.received")} !` })} >
                        {/* <Image style={styles.qrCodeImage} source={ImagesSrc.qr} /> */}
                        <QRCode
                            size={wp("40%")}
                            value={qrData}
                            getRef={(ref) => qrRef = ref}
                            quietZone={5}
                        />
                    </TouchableOpacity>
                    <TextView style={styles.codeValue}>{wallet?.address}</TextView>
                    <TextView style={styles.qrLabel}>{""}</TextView>
                    {(price !== "" && Number(price) !== 0) && <TextView style={styles.price}>{price}</TextView>}
                    {(price !== "" && Number(price) !== 0) && <TextView style={styles.valueLabel}>{item.type}</TextView>}
                </ViewShot>
            </View>
            <View style={styles.actionContainer}>
                <View style={[styles.actionBtns]} >
                    <HeaderBtns
                        image={ImagesSrc.send}
                        label={translate("wallet.common.copy")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        bgColor={Colors.headerIconBg2}
                        labelStyle={styles.btnLabel}
                        onPress={() => copyToClipboard()}
                        address={copyAddress}
                    />
                    <HeaderBtns
                        image={ImagesSrc.receive}
                        label={translate("wallet.common.setAmount")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        labelStyle={styles.btnLabel}
                        bgColor={Colors.headerIconBg2}
                        onPress={() => { setModalVisible(true) }}
                    />
                    <HeaderBtns
                        image={ImagesSrc.topup}
                        label={translate("wallet.common.share")}
                        labelStyle={styles.btnLabel}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        bgColor={Colors.headerIconBg2}
                        onPress={onSharing}
                    />
                </View>
                <TextView style={styles.alert}>
                    {translate("wallet.common.sendAlert", { token: `${item.tokenName} (${item.type})` })}{"\n"}{translate("wallet.common.sendAlert2")}
                </TextView>
            </View>
            {
                showShare &&
                <AppButton label={translate("wallet.common.share")} containerStyle={[CommonStyles.button, styles.shareBtn]} labelStyle={CommonStyles.buttonLabel}
                    onPress={() => onSharing()} />
            }
            <Portal>
                <Modal
                    visible={modalVisible}
                    transparent
                >
                    <BlurView
                        style={styles.absolute}
                        blurType="light"
                        blurAmount={10}
                    >
                        <KeyboardAwareScrollView contentContainerStyle={styles.modalContent}>
                            <View style={styles.setAmountContainer}>
                                <TextView style={styles.title}>{translate("wallet.common.enterAmount")}</TextView>
                                <TextInput
                                    style={styles.amountInput}
                                    onChangeText={(e) => {
                                        const reg = /^\d+(\.\d{0,8})?$/
                                        if (e.length > 0 && reg.test(e)) {
                                            setPrice(e)
                                        } else if (e.length == 1 && e === '.') {
                                            setPrice('0.')
                                        } else if (e.length == 0) {
                                            setPrice(e)
                                        }
                                    }}
                                    value={price}
                                    maxLength={10}
                                    keyboardType={'numeric'}
                                />
                                <Separator style={styles.separator} />
                                <View style={styles.optionContainer}>
                                    <Button
                                        color={Colors.headerIcon2}
                                        style={styles.optionButton}
                                        labelStyle={styles.optionLabel}
                                        uppercase={false}
                                        onPress={() => {
                                            setModalVisible(false)
                                            setPrice("")
                                        }}>{translate("wallet.common.cancel")}</Button>
                                    <VerticalSeparator />
                                    <Button
                                        color={Colors.headerIcon2}
                                        style={styles.optionButton}
                                        labelStyle={styles.optionLabel}
                                        uppercase={false}
                                        onPress={() => setModalVisible(false)}>{translate("wallet.common.confirm")}</Button>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </BlurView>
                </Modal>
            </Portal>
        </View>
    )
};

function Receive({ route, navigation }) {

    return (
        <AppBackground>
            <AppHeader
                showBackButton={true}
                title={translate("wallet.common.receive")}
            />

            <QRScreen />

        </AppBackground>

    )
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    inputCont: {
        marginTop: hp("3%")
    },
    qrCodeImage: {
        width: wp("40%"),
        height: wp("40%"),
        resizeMode: "contain",
        alignSelf: "center",
        marginTop: hp("7%"),
        backgroundColor: Colors.white,
    },
    qrLabel: {
        color: Colors.black,
        textAlign: "center",
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2.1),
        fontWeight: "bold",
        marginTop: hp("2%"),
        marginBottom: hp("1%")
    },
    shareBtn: {
        backgroundColor: Colors.scanActive
    },
    btnLabel: {
        fontSize: RF(1.8)
    },
    codeValue: {
        width: "80%",
        alignSelf: 'center',
        marginVertical: hp("4%"),
        color: Colors.codeColor,
        fontSize: RF(2),
        textAlign: 'center'
    },
    actionBtns: {
        flexDirection: 'row',
        width: wp("70%"),
        alignSelf: "center",
        paddingTop: hp('1%'),
        paddingBottom: hp('2%'),
    },
    QRContainer: {
        flex: 1
    },
    actionContainer: {

    },
    alert: {
        maxWidth: "90%",
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp("3%"),
        color: 'red',
        fontSize: RF(1.7)
    },
    price: {
        alignSelf: 'center',
        fontSize: RF(5),
        fontWeight: 'bold'
    },
    valueLabel: {
        alignSelf: 'center'
    },
    modalContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: wp("9%")
    },
    setAmountContainer: {
        backgroundColor: Colors.lightBackground,
        borderRadius: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: RF(2.5),
        fontWeight: 'bold',
        marginVertical: hp("2%"),
        marginBottom: hp("1%")
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(95, 148, 255, 0.6)"
    },
    amountInput: {
        backgroundColor: Colors.white,
        width: "90%",
        padding: wp("2%"),
        borderRadius: 5,
        marginVertical: hp("2%"),
        color: Colors.black
    },
    optionContainer: {
        width: '100%',
        borderTopColor: Colors.borderColor,
        borderTopWidth: 0,
        flexDirection: 'row',
    },
    optionButton: {
        flex: 1,
        paddingVertical: hp("1%")
    },
    optionLabel: {
        fontFamily: Fonts.ARIAL,
        fontWeight: 'bold',
        fontSize: RF(1.8)
    },
    separator: {
        backgroundColor: Colors.borderColorGrey
    }
})

export default Receive;
