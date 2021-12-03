import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Image, Alert, KeyboardAvoidingView } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import ImagesSrc from '../../constants/Images';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import { translate, amountValidation, environment, processScanResult, SCAN_WALLET } from '../../walletUtils';
import { alertWithSingleBtn } from '../../utils';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import AppButton from '../../components/appButton';
import FetchingIndicator from '../../components/fetchingIndicator';
import CommonStyles from '../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';
import { transfer } from './functions';
import NumberFormat from 'react-number-format';
import Web3 from 'web3';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';
import { openSettings } from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCameraPermission } from '../../store/reducer/cameraPermission';

const { height } = Dimensions.get('window');

let flag = true;

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

const getTokenValue = (item) => {
    const { ethBalance, bnbBalance, maticBalance } = useSelector(state => state.WalletReducer);
    let totalValue = 0;
    if (item.type == 'ETH') {
        let value = parseFloat(ethBalance) //+ parseFloat(balances.USDT)
        console.log('Ethereum value', value);
        totalValue = value;
    } else if (item.type == 'BNB') {
        let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
        console.log('BSC value', value);
        totalValue = value;
    } else if (item.type == 'Matic') {
        let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
        console.log('Polygon value', value);
        totalValue = value;
    }
    return totalValue;
}

const transferAmount = async () => {

    const { wallet } = useSelector(state => state.UserReducer);
    const publicAddress = wallet.address;
    const privKey = wallet.privateKey;
    const toAddress = address;
    setLoading(true);
    switch (type) {
        case 'ETH':
            // let ethBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "eth", "", "", environment.ethRpc, 10, 21000).then((ethBalance) => {
                console.log("ethBalance", ethBalance);
                if (ethBalance.success) {
                    showSuccessAlert();
                }
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'USDT':
            // let usdtBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "usdt", environment.usdtCont, environment.usdtAbi, environment.ethRpc, 10, 81778).then((usdtBalance) => {
                console.log("usdtBalance", usdtBalance);
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'BNB':
            // let bnbBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "bnb", "", "", environment.bnbRpc, 10, 21000).then((bnbBalance) => {
                console.log("bnbBalance", bnbBalance);
                if (bnbBalance.success) {
                    showSuccessAlert();
                }
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'BUSD':
            // let busdBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "busd", environment.busdCont, environment.busdAbi, environment.bnbRpc, 10, 81778).then((busdBalance) => {
                console.log("busdBalance", busdBalance);
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'ALIA':
            // let aliaBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "alia", environment.aliaCont, environment.aliaAbi, environment.bnbRpc, 10, 81778).then((aliaBalance) => {
                console.log("aliaBalance", aliaBalance);
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'Matic':
            // let maticBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "matic", "", "", environment.polRpc, 10, 21000).then((maticBalance) => {
                console.log("maticBalance", maticBalance);
                if (maticBalance.success) {
                    showSuccessAlert();
                }
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        case 'USDC':
            // let usdcBalance = await
            transfer(publicAddress, privKey, amount, toAddress, "usdc", environment.usdcCont, environment.usdcAbi, environment.polRpc, 10, 81778).then((usdcBalance) => {
                console.log("usdcBalance", usdcBalance);
                setLoading(false);
            }).catch((err) => {
                console.log("err", err);
                setLoading(false);
                showErrorAlert(err.msg);
            });

            return;
        default:
    }
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

const ScanScreen = (props) => {
    const navigation = useNavigation();
    let refScanner = null;
    const { camera } = useSelector(state => state.PermissionReducer);
    const dispatch = useDispatch();
    const [screenLoading, setScreenLoading] = useState(false);

    const { loading, jumpTo, setResult, setLoading, position } = props;

    useEffect(() => {
        if (position == 1) {
            setScreenLoading(true)
            checkCameraPermission()
            refScanner && refScanner.reactivate();
        }
    }, [position, camera]);

    const checkCameraPermission = async () => {
        const granted = await Permission.checkPermission(PERMISSION_TYPE.camera);
        if (!granted) {
            AsyncStorage.setItem("languageCheck", JSON.stringify({ cameraPermission: true }))
            const requestPer = await Permission.requestPermission(PERMISSION_TYPE.camera);
            setScreenLoading(false)
            return
        }
        setScreenLoading(false)
        dispatch(setCameraPermission(granted))
    }

    const onSuccess = (e) => {
        console.log('e', e);
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
    return (
        <View style={[styles.scene]} >

            {
                screenLoading ?
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                        <FetchingIndicator />
                    </View> :
                    camera ? <QRCodeScanner
                        ref={(scanner) => refScanner = scanner}
                        onRead={onSuccess}
                        permissionDialogTitle={translate("wallet.common.info")}
                        permissionDialogMessage={translate("wallet.common.needCameraPermission")}
                        showMarker={true}
                        notAuthorizedView={<View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={styles.cameraNotAuth} >
                                {translate("wallet.common.cameraNotAuth")}
                            </Text>
                        </View>
                        }
                        customMarker={<TouchableOpacity disabled style={{ zIndex: 1000 }} >
                            <Image style={styles.scanStyle} source={ImagesSrc.scanRectangle} />
                        </TouchableOpacity>}
                        containerStyle={{ flex: 1 }}
                        cameraStyle={styles.qrCameraStyle}
                        topViewStyle={{ flex: 0 }}
                        bottomViewStyle={{ flex: 0 }}
                    /> :
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={styles.cameraNotAuth} >{translate("wallet.common.cameraNotAuth")}</Text>
                        </View>
            }
            {/* {
                <TouchableOpacity style={styles.rescan}>
                    <TextView style={{color:Colors.white}}>Rescan</TextView>
                </TouchableOpacity>
            } */}
        </View>
    )
};

const SendScreen = (props) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { wallet } = useSelector(state => state.UserReducer);
    const { ethBalance, bnbBalance, maticBalance, tnftBalance, talBalance } = useSelector(state => state.WalletReducer);
    const [address, setAddress] = useState(props.address);
    const [amount, setAmount] = useState(props.amount);
    const [transfering, setTransfering] = useState(false);

    const { item, type, setLoading, loading } = props;

    useEffect(() => {
        setAddress(props.address);
        setAmount(props.amount);
    }, [props.address, props.amount]);

    const getTokenValue = () => {
        let totalValue = 0;
        if (item.type == 'ETH') {
            let value = parseFloat(ethBalance) //+ parseFloat(balances.USDT)
            console.log('Ethereum value', value);
            totalValue = value;
        } else if (item.type == 'BNB') {
            let value = parseFloat(bnbBalance) //+ parseFloat(balances.BUSD) + parseFloat(balances.ALIA)
            console.log('BSC value', value);
            totalValue = value;
        } else if (item.type == 'Matic') {
            let value = parseFloat(maticBalance) //+ parseFloat(balances.USDC)
            console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == 'TNFT') {
            let value = parseFloat(tnftBalance) //+ parseFloat(balances.USDC)
            console.log('Polygon value', value);
            totalValue = value;
        } else if (item.type == 'TAL') {
            let value = parseFloat(talBalance) //+ parseFloat(balances.USDC)
            console.log('Polygon value', value);
            totalValue = value;
        }
        return totalValue;
    }

    const transferAmount = async () => {
        const publicAddress = wallet.address;
        const privKey = wallet.privateKey;
        const toAddress = address;
        setLoading(true);
        switch (type) {
            case 'ETH':
                // let ethBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "eth", "", "", environment.ethRpc, 10, 21000).then((ethBalance) => {
                    console.log("ethBalance", ethBalance);
                    if (ethBalance.success) {
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'USDT':
                // let usdtBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "usdt", environment.usdtCont, environment.usdtAbi, environment.ethRpc, 10, 81778).then((usdtBalance) => {
                    console.log("usdtBalance", usdtBalance);
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'BNB':
                // let bnbBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "bnb", "", "", environment.bnbRpc, 10, 21000).then((bnbBalance) => {
                    console.log("bnbBalance", bnbBalance);
                    if (bnbBalance.success) {
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'BUSD':
                // let busdBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "busd", environment.busdCont, environment.busdAbi, environment.bnbRpc, 10, 81778).then((busdBalance) => {
                    console.log("busdBalance", busdBalance);
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'ALIA':
                // let aliaBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "alia", environment.aliaCont, environment.aliaAbi, environment.bnbRpc, 10, 81778).then((aliaBalance) => {
                    console.log("aliaBalance", aliaBalance);
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'Matic':
                // let maticBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "matic", "", "", environment.polRpc, 10, 21000).then((maticBalance) => {
                    console.log("maticBalance", maticBalance);
                    if (maticBalance.success) {
                        showSuccessAlert();
                    }
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'USDC':
                // let usdcBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "usdc", environment.usdcCont, environment.usdcAbi, environment.polRpc, 10, 81778).then((usdcBalance) => {
                    console.log("usdcBalance", usdcBalance);
                    setLoading(false);
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

                return;
            case 'TNFT':
                // let aliaBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "alia", environment.tnftCont, environment.tnftAbi, environment.bnbRpc, 10, 81778).then((tnftBalance) => {
                    console.log("tnftBalance", tnftBalance);
                    setLoading(false);
                    if (tnftBalance.success) {
                        showSuccessAlert();
                    }
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });

            case 'TAL':
                // let aliaBalance = await
                transfer(publicAddress, privKey, amount, toAddress, "alia", environment.talCont, environment.tnftAbi, environment.polRpc, 10, 81778).then((talBalance) => {
                    console.log("talBalance", talBalance);
                    setLoading(false);
                    if (talBalance.success) {
                        showSuccessAlert();
                    }
                }).catch((err) => {
                    console.log("err", err);
                    setLoading(false);
                    showErrorAlert(err.msg);
                });


            default:
        }
    }

    const showSuccessAlert = () => {
        Alert.alert(
            translate("wallet.common.transferInProgress", { token: `${amount} ${type}` }),
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
                        view={loading}
                        containerStyle={CommonStyles.button}
                        labelStyle={CommonStyles.buttonLabel}
                        onPress={() => {
                            if (address && address !== '' && amount > 0) {
                                if (parseFloat(amount) <= parseFloat(`${item.tokenValue}`)) {
                                    setLoading(true);
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
                        }} />
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const Send = ({ route, navigation }) => {

    const { item, type } = route.params;

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

    const renderScene = SceneMap({
        Send: SendScreen,
        Scan: ScanScreen,
    });

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
                    renderTabBar={renderTabBar}
                    navigationState={{ index, routes }}
                    renderScene={_renderScene}
                    onIndexChange={async index => {
                        if (index) {
                            const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);

                            if (!isGranted) {
                                confirmationAlert(
                                    'This feature requires camera access',
                                    'To enable access, tap Settings and turn on Camera.',
                                    'Cancel',
                                    'Settings',
                                    () => openSettings(),
                                    () => null
                                )
                            } else {
                                setIndex(index);
                            }
                        } else {
                            setIndex(index);
                        }
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
        padding: wp("5%")
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
    }
})

export default Send;
