import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot";
import { useSelector } from 'react-redux';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate } from '../../walletUtils';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import TextView from '../../components/appText';
import { HeaderBtns } from './components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import { Portal } from '@gorhom/portal';
import MultiButtonModal from '../../components/MultiButtonModal';

// import { PaymentField } from './screenComponents';
// import { alertWithSingleBtn } from "./commonFunction";

const QRScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const { userData } = useSelector((state) => state.UserReducer);
    const wallet = userData?.userWallet;

    const [price, setPrice] = useState("");
    const [showShare, setShowShare] = useState(false);
    const [qrData, setQrData] = useState(wallet?.address);
    const [copyAddress, setCopyAddress] = useState(false);
    const [amountPopup, setAmountPopup] = useState(false)


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
            let options = {
                title: "Share code",
                url: `${uri}`,
            };

            Share.open(options)
                .then((res) => {
                })
                .catch((err) => {

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
                        copyAddress={copyAddress}
                    />
                    <HeaderBtns
                        image={ImagesSrc.receive}
                        label={translate("wallet.common.setAmount")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        labelStyle={styles.btnLabel}
                        bgColor={Colors.headerIconBg2}
                        onPress={() => { setAmountPopup(true) }}
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
                <MultiButtonModal
                    isVisible={amountPopup}
                    setAmount={true}
                    closeModal={() => setAmountPopup(false)}
                    title={translate('wallet.common.enterAmount')}
                    leftButtonText={translate('common.Cancel')}
                    rightButtonText={translate('common.Confirm')}
                    onLeftPress={() => {
                        setAmountPopup(false)
                        setPrice("")
                    }}
                    onRightPress={() =>
                        setAmountPopup(false)

                    }
                    onChangeValue={(e) => {
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
                >
                </MultiButtonModal>
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
})






export default Receive;
