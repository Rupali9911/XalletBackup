import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, Alert, KeyboardAvoidingView } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate, amountValidation, environment, processScanResult, SCAN_WALLET, getConfigDetailsFromEnviorment } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { transfer } from './functions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';
import { openSettings } from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const { height } = Dimensions.get('window');
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';
import { getWallet } from '../../helpers/AxiosApiRequest';
import { balanceTransfer, handleTransactionError } from '../wallet/functions/transactionFunctions'


const verifyAddress = (address) => {
    return new Promise((resolve, reject) => {
        const isVerified = Web3.utils.isAddress(address)
        if (isVerified) {
            resolve();
        } else {
            reject();
        }
    });
}

const showErrorAlert = (msg) => {
    alertWithSingleBtn(
        translate('common.error'),
        msg
    )
}

export const AddressField = (props) => {
    return (
        <View style={styles.inputMainCont} >
            <Text style={styles.inputLeft} >{translate("wallet.common.walletAddress")}</Text>
            <TextInput
                style={[styles.inputCont, styles.paymentField]}
                placeholder=""
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={val => props.onChangeText(val)}
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
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    style={[styles.inputCont, styles.paymentField, { fontSize: RF(2) }]}
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
        </View>
    )
}

//*************************************************************************/
//=========================Scan Screen Start ==============================
/*************************************************************************/
const ScanScreen = React.memo((props) => {
    let refScanner = null;
    const { camera } = useSelector(state => state.PermissionReducer);
    const dispatch = useDispatch();
    const { jumpTo, setResult, position } = props;

    const [isActive, setIsActive] = useState(false);

    useEffect(async () => {
        if (position == 1) {
            // console.log("@@@ Scan screen useEffect to reactive 11111=========>", position, camera)
            await checkCameraPermission();
            // console.log("@@@ Scan screen useEffect to reactive 22222=========>")
            setIsActive(true);
            // console.log("@@@ Scan screen useEffect to reactive 33333=========>", isActive)
        }
    }, [position, camera]);

    const checkCameraPermission = async () => {
        const granted = await Permission.checkPermission(PERMISSION_TYPE.camera);
        // console.log("@@@ Scan screen check permission 11111=========>", granted)
        if (!granted) {
            // console.log("@@@ Scan screen check permission 22222=========>", granted)
            const requestPer = await Permission.requestPermission(PERMISSION_TYPE.camera);
            // console.log("@@@ Scan screen check permission 33333=========>", requestPer)
            if (requestPer == false) {
                confirmationAlert(
                    translate("wallet.common.cameraPermissionHeader"),
                    translate("wallet.common.cameraPermissionMessage"),
                    translate("common.Cancel"),
                    translate("wallet.common.settings"),
                    () => openSettings(),
                    () => null,
                )
            }
            return
        }
    }

    const onSuccess = (e) => {
        processScanResult(e, SCAN_WALLET).then((result) => {
            if (result.walletAddress) {
                verifyAddress(result.walletAddress).then(() => {
                    setResult(result.walletAddress, result.amount);
                    jumpTo('Send');
                }).catch(() => {
                    alertWithSingleBtn(
                        translate("wallet.common.error.invalidCode"),
                        translate("wallet.common.error.scanCodeAlert"),
                        () => {
                            refScanner && refScanner.reactivate();
                        }
                    );
                });
            }
        }).catch(() => {
            alertWithSingleBtn(
                translate("wallet.common.error.invalidCode"),
                translate("wallet.common.error.scanCodeAlert"),
                () => {
                    refScanner && refScanner.reactivate();
                }
            );
        });
    };

    const cameraNotAuthView = () => {
        return (
            <View style={CommonStyles.center}>
                <Text style={styles.cameraNotAuth} >
                    {translate("wallet.common.cameraNotAuth")}
                </Text>
            </View>
        )
    }
    console
    return (
        <View style={[styles.scene]} >
            {isActive ?
                <QRCodeScanner
                    reactivate={isActive}
                    containerStyle={styles.cameraContainer}
                    ref={(scanner) => refScanner = scanner}
                    onRead={onSuccess}
                    showMarker={true}
                    cameraProps={{
                        notAuthorizedView: (
                            cameraNotAuthView()
                        ),
                    }}
                    notAuthorizedView={cameraNotAuthView()}
                    checkAndroid6Permissions={true}
                    customMarker={<TouchableOpacity disabled style={{ zIndex: 1000 }} >
                        <Image style={styles.scanStyle} source={ImagesSrc.scanRectangle} />
                    </TouchableOpacity>}
                    cameraStyle={styles.qrCameraStyle}
                    topViewStyle={{ flex: 0 }}
                    bottomViewStyle={{ flex: 0 }}
                />
                : null
            }
        </View>
    )
});

/*************************************************************************/
//=========================SendScreen Start ==============================
/*************************************************************************/
const SendScreen = React.memo((props) => {
    const navigation = useNavigation();
    //====================== Props Destructuring =========================
    const { item, type, setLoading, loading } = props;

    //====================== Getting data from reducers =========================
    const { userData } = useSelector(state => state.UserReducer);
    const { ethBalance, bnbBalance, maticBalance, tnftBalance, talBalance, busdBalance, usdtBalance, usdcBalance, wethBalance, xetaBalance, networkType } = useSelector(state => state.WalletReducer);

    //====================== States Initiliazation =========================
    const [address, setAddress] = useState(props.address);
    const [amount, setAmount] = useState(props.amount);

    //==================== Global Variables =======================
    let wallet = null

    //====================== Use Effect Start =========================
    useEffect(async () => {
        wallet = await getWallet();
    }, [])

    useEffect(() => {
        setAddress(props.address);
        setAmount(props.amount);
    }, [props.address, props.amount]);

    const getTokenValue = () => {
        let totalValue = 0;
        if (item.type == 'ETH' && item.network !== 'Polygon') {
            let value = parseFloat(ethBalance)
            // console.log('Ethereum value', value);
            totalValue = value;
        } else if (item.type == 'BNB') {
            let value = parseFloat(bnbBalance)
            // console.log('BSC value', value);
            totalValue = value;
        } else if (item.type == 'BUSD') {
            let value = parseFloat(busdBalance)
            // console.log('BUSD value', value);
            totalValue = value;
        } else if (item.type == 'USDT') {
            let value = parseFloat(usdtBalance)
            // console.log('USDT value', value);
            totalValue = value;
        } else if (item.type == 'Matic') {
            let value = parseFloat(maticBalance)
            // console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == 'TNFT') {
            let value = parseFloat(tnftBalance)
            // console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == 'TAL') {
            let value = parseFloat(talBalance)
            // console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == 'USDC') {
            let value = parseFloat(usdcBalance)
            // console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == "WETH" && item.network === 'Polygon') {
            let value = parseFloat(wethBalance)
            // console.log('Polygon value', value);
            totalValue = value;
        } else if (item.network === 'BSC' && item.type == 'ALIA') {
            // console.log("Item network", item.network)
            let value = parseFloat(tnftBalance);
            totalValue = value;
        } else if (item.network === 'Polygon' && item.type == 'ALIA') {
            // console.log("Item network", item.network)
            let value = parseFloat(talBalance);
            totalValue = value;
            // console.log("Total value is ", totalValue)
        } else if (item.network === 'XANA CHAIN' && item.type == 'XETA') {
            // console.log("Item network", item.network)
            let value = parseFloat(xetaBalance);
            totalValue = value;
            // console.log("Total value is ", totalValue)
        }
        return totalValue;
    }

    const transferAmount = async () => {
        let wallet = await getWallet();
        const { item, type, setLoading } = props;

        const transferParameters = {
            publicAddress: wallet?.address,
            privKey: wallet?.privateKey,
            amount: amount,
            toAddress: address,
            tokenType: type,
            chainType: networkType?.name,
            chainId: networkType?.chainId,
            networkId: networkType?.id,
        }
        setLoading(true);
        // console.log("@@@ parameters in transation function =============>", networkType?.name, type);
        const config = getConfigDetailsFromEnviorment(networkType?.name, type);
        // console.log("@@@ config in transation function =============>", config);

        balanceTransfer(transferParameters, config).then((transferResponse) => {
            // console.log("Balance Transfer response ======>", transferResponse);
            setLoading(false);
            if (transferResponse?.success) {
                showSuccessAlert();
            }
        }).catch((err) => {
            console.log("@@@ balance transfrer error =====>", err);
            setLoading(false);
            handleTransactionError(err);
        });
    }

    const showSuccessAlert = () => {
        Alert.alert(
            translate("wallet.common.transferInProgress", { token: `${amount} ${type}` }),
            translate("wallet.common.reflectInHistory", { token: `${amount} ${type}` }),
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
        <View style={styles.container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.contentContainer}>
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

                    </View>
                    <View style={styles.inputContainer}>
                        <AddressField
                            onChangeText={setAddress}
                            onSubmitEditing={(txt) => {
                                // verifyAddress(txt);
                            }}
                            value={address} />
                    </View>

                    <View style={styles.inputContainer}>
                        <PaymentField
                            type={type}
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
                </View>
                <View style={{ height: height / 2.7, justifyContent: 'flex-end' }}>
                    <AppButton
                        label={translate("wallet.common.send")}
                        // view={loading}
                        view={address && (amount > 0) ? false : true}
                        containerStyle={CommonStyles.button}
                        labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            if (address && address !== '' && amount > 0) {
                                if (parseFloat(amount) <= parseFloat(`${item.tokenValue}`)) {
                                    // setLoading(true);
                                    verifyAddress(address).then(() => {
                                        transferAmount();
                                    }).catch(() => {
                                        showErrorAlert(translate("wallet.common.invalidAddress"));
                                        setLoading(false);
                                    });
                                }
                                else {
                                    showErrorAlert(translate("wallet.common.insufficientFunds"));
                                }
                            } else {
                                showErrorAlert(translate("wallet.common.requireSendField"));
                            }
                        }
                        } />
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
});

//*************************************************************************/
//=========================Send Screen Start ==============================
/*************************************************************************/
const Send = ({ route, navigation }) => {
    //================= Props Destructuring =============================
    const { item, type } = route.params;
    // console.log("@@@ Send screen props ============>", item, type)
    //================= States Initialiazation =============================
    const [loading, setLoading] = useState(false);
    const [sendToAddress, setSendToAddress] = useState(null);
    const [amountToSend, setAmountToSend] = useState('');
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'Send', title: translate("wallet.common.send") },
        { key: 'Scan', title: translate("wallet.common.scan") },
    ]);

    const setResult = (address, amount) => {
        setAmountToSend(amount);
        setSendToAddress(address);
    }

    const _renderScene = ({ route, jumpTo, position }) => {
        switch (route.key) {
            case 'Send':
                return <SendScreen setLoading={setLoading} item={item} type={type} loading={loading} address={sendToAddress} amount={amountToSend} />;
            case 'Scan':
                return <ScanScreen setLoading={setLoading} position={index} loading={loading} setResult={setResult} jumpTo={jumpTo} />;
            default:
                return null;
        }
    };

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
                lazy={true}
            />
        )
    }

    return (
        <AppBackground isBusy={loading} hideBottomSafeArea={index == 1}>
            <KeyboardAvoidingView behavior="height" style={{ flexGrow: 1 }}  >
                <AppHeader
                    showBackButton
                    title={translate("wallet.common.send")}
                />
                <TabView
                    lazy={true}
                    renderTabBar={renderTabBar}
                    navigationState={{ index, routes }}
                    renderScene={_renderScene}
                    onIndexChange={index => {
                        setIndex(index);
                    }}
                    style={styles.tabItem}
                />
            </KeyboardAvoidingView>
        </AppBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        padding: wp("5%"),
    },
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
    contentContainer: {
        flex: 1,
    },
    inputContainer: {
        marginVertical: hp("2%"),
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
        fontSize: RF(3.4),
        color: Colors.black,
        fontWeight: 'bold'
    },
    balanceContainer: {
        marginVertical: hp("2%"),
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileCont: {
        ...CommonStyles.circle("13")
    },
    profileImage: {
        ...CommonStyles.imageStyles(13),
    },
    inputCont: {
        paddingHorizontal: wp("1%"),
        height: hp('5%')
    },
    inputLeft: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.GREY1, RF(1.6))
    },
    paymentField: {
        paddingHorizontal: wp("1.5%"),
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(1.6)),
        flex: 1,
    },
    inputRight: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(2)),
        marginBottom: hp('0.2%'),
        alignSelf: 'center',
    },
    inputBottom: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.inputBottomPayment, RF(1.6)),
        textAlign: "right",
        marginRight: wp("1%")
    },
    inputMainCont: {
        width: "100%",
        // height: hp("7%"),
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GREY1,
    },
    qrCameraStyle: {
        height: "100%",
        flex: 1,
    },
    scanStyle: {
        width: wp("30%"),
        height: wp("70%"),
        resizeMode: "contain",
    },
    rescan: {
        position: 'absolute',
        borderRadius: hp("2.5%"),
        borderWidth: 2,
        alignSelf: 'center',
        bottom: 20,
        borderColor: Colors.themeColor,
        paddingHorizontal: wp("4%"),
        paddingVertical: hp("1%"),
        backgroundColor: Colors.themeColor
    },
    cameraNotAuth: {
        textAlign: 'center',
        fontSize: 16,
    },
    cameraContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Send;