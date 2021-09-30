import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
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
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import PriceText from '../../components/priceText';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import TextView from '../../components/appText';
import { HeaderBtns } from './components/HeaderButtons';
import ImagesSrc from '../../constants/Images';
import AppModal from '../../components/appModal';
import { Button } from 'react-native-paper';
import VerticalSeparator from '../../components/verticalSeparator';
import Separator from '../../components/separator';

// import { PaymentField } from './screenComponents';
// import { alertWithSingleBtn } from "./commonFunction";

const QRScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();

    const {item} = route.params;

    console.log('item',item);

    const { wallet } = useSelector((state) => state.UserReducer);

    const [price, setPrice] = useState("");
    const [showShare, setShowShare] = useState(false);
    const [qrData, setQrData] = useState(wallet.address);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // setQrData(wallet.address);
    }, [])

    let qrRef = useRef(null);

    const onSharing = () => {
        qrRef && qrRef.capture().then(uri => {
            console.log("do something with ", uri);
            let options = {
                title: "Share code",
                message: "Please scan code to send token",
                // url: `file://${uri}`,
                url: `${uri}`,
            };
            // Share.share(shareImage).catch(err => console.log(err));
            Share.open(options)
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    err && console.log(err);
                });
        });
    }

    const copyToClipboard = () => {
        Clipboard.setString(wallet.address);
        Alert.alert(translate("common.copied"));
    }

    return (
        <View style={[styles.scene]} >
            <View style={styles.QRContainer}>
                <ViewShot ref={(ref) => qrRef = ref} options={{ result: 'data-uri' }}>
                    <TouchableOpacity disabled style={styles.qrCodeImage} onPress={() => navigation.navigate("Pay", { title: translate("common.received"), label: `${translate("common.received")} !` })} >
                        {/* <Image style={styles.qrCodeImage} source={ImagesSrc.qr} /> */}
                        <QRCode
                            size={wp("40%")}
                            value={qrData}
                            getRef={(ref) => qrRef = ref}
                            quietZone={5}
                        />
                    </TouchableOpacity>
                    <TextView style={styles.codeValue}>{wallet.address}</TextView>
                    <TextView style={styles.qrLabel}>{""}</TextView>
                    {price!=="" && <TextView style={styles.price}>{price}</TextView>}
                    {price!=="" && <TextView style={styles.valueLabel}>BTC</TextView>}
                </ViewShot>
            </View>
            <View style={styles.actionContainer}>
                <View style={[styles.actionBtns]} >
                    <HeaderBtns
                        image={ImagesSrc.send}
                        label={translate("common.copy")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        bgColor={Colors.headerIconBg2}
                        onPress={() => copyToClipboard()}
                    />
                    <HeaderBtns
                        image={ImagesSrc.receive}
                        label={translate("common.setAmount")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        bgColor={Colors.headerIconBg2}
                        onPress={() => {setModalVisible(true)}}
                    />
                    <HeaderBtns
                        image={ImagesSrc.topup}
                        label={translate("common.share")}
                        labelColor={Colors.headerIcon2}
                        iconColor={Colors.headerIcon2}
                        bgColor={Colors.headerIconBg2}
                        onPress={() => {}}
                    />
                </View>
                <TextView style={styles.alert}>
                    {translate("common.sendAlert",{token: `${item.tokenName} (${item.type})`})}{"\n"}{translate("common.sendAlert2")}
                </TextView>
            </View>
            {
                showShare &&
                <AppButton label={translate("common.share")} containerStyle={[CommonStyles.button, styles.shareBtn]} labelStyle={CommonStyles.buttonLabel}
                    onPress={() => onSharing()} />
            }
            <AppModal visible={modalVisible} src={ImagesSrc.setAmountBg}>
                <KeyboardAwareScrollView contentContainerStyle={styles.modalContent}>
                    <View style={styles.setAmountContainer}>
                        <TextView style={styles.title}>{translate("common.enterAmount")}</TextView>
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
                        <Separator style={styles.separator}/>
                        <View style={styles.optionContainer}>
                            <Button
                                color={Colors.headerIcon2}
                                style={styles.optionButton}
                                labelStyle={styles.optionLabel}
                                uppercase={false}
                                onPress={()=>{
                                    setModalVisible(false)
                                    setPrice("")
                                }}>{translate("common.cancel")}</Button>
                            <VerticalSeparator />
                            <Button
                                color={Colors.headerIcon2}
                                style={styles.optionButton}
                                labelStyle={styles.optionLabel}
                                uppercase={false}
                                onPress={()=>setModalVisible(false)}>{translate("common.confirm")}</Button>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </AppModal>
        </View>
    )
};

const ScanScreen = () => {
    const navigation = useNavigation();
    const [price, setPrice] = useState("");
    return (
        <View style={[styles.scene]} >
            {/* <AppButton
                onPress={() => {
                    if (price.trim().length > 0) {
                        navigation.navigate("ReceiveScan", { price })
                    } else {
                            alertWithSingleBtn(
                                translate('common.alert'),
                                translate("common.error.amountAlert"),
                            );
                    }
                }}
                label={translate("common.scan")}
                containerStyle={[CommonStyles.button, styles.shareBtn]}
                labelStyle={CommonStyles.buttonLabel}
            /> */}
        </View>
    )
};

function Receive({ route, navigation }) {

    const [title, setTitle] = useState("");
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'QR', title: translate("common.qr") },
        { key: 'Scan', title: translate("common.scan") },
    ]);

    const renderScene = SceneMap({
        QR: QRScreen,
        Scan: ScanScreen,
    });

    const renderTabBar = (props) => {
        return (
            <TabBar
                {...props}
                renderLabel={({ route, focused, color }) => (
                    <Text style={{ color, ...styles.tabLabel }}>
                        {route.title}
                    </Text>
                )}
                contentContainerStyle={{ height: 45 }}
                indicatorStyle={{ backgroundColor: Colors.scanActive }}
                style={styles.tabItem}
                inactiveColor={Colors.sectionLabel}
                activeColor={Colors.scanActive}
            />
        )
    }

    return (
        <AppBackground>
            <AppHeader
                showBackButton={true}
                title={index == 0 ? translate("common.receive") : translate("common.scan")}
            />

            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={styles.tabItem}
            />

        </AppBackground>

    )
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
    tabItem: {
        backgroundColor: Colors.white,
        shadowColor: Colors.white
    },
    tabLabel: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.8),
        fontWeight: "normal",
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
    codeValue: {
        width: "80%",
        alignSelf: 'center',
        marginVertical: hp("4%"),
        color: Colors.codeColor,
        fontSize: RF(1.4),
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
        flex:1
    },
    actionContainer: {

    },
    alert: {
        maxWidth: "80%",
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp("3%"),
        color: 'red',
        fontSize: RF(1.5)
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
