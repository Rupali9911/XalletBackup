import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Platform, Linking
} from 'react-native';
import AppBackground from '../../components/appBackground';
import TextView from '../../components/appText';
import AppHeader from '../../components/appHeader';
import { RF, hp, wp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';
import AppButton from '../../components/appButton';
import Fonts from '../../constants/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagesSrc from '../../constants/Images';
import { translate } from '../../walletUtils';
import {checkNotifications, openSettings, requestNotifications} from 'react-native-permissions';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';
import SingleSocket from '../../helpers/SingleSocket';
import { Events } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import AppModal from '../../components/appModal';
import ApproveModalContent from '../../components/approveAppModal';
import { alertWithSingleBtn } from '../../utils';
import { setConnectedApps, setConnectedAppsToLocal, setRequestAppId, setSocketOpenStatus } from '../../store/reducer/walletReducer';
import { getSig } from '../wallet/functions';
import NotificationActionModal from '../../components/notificationActionModal';
import {BASE_URL} from "../../common/constants";
import axios from "axios";
const singleSocket = SingleSocket.getInstance();

const ListItems = (props) => {
    const { item, socketOpen } = props;

    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (socketOpen) {
            getAppDetail(item);
        }
        const socketSubscribe = Events.asObservable().subscribe({
            next: data => {
                console.log('______socket subscribe', data);
                try {
                    const response = JSON.parse(data);
                    if (response.status == 'success' && response.type == 'appInfo') {
                        setDetails(response.data);
                    }
                } catch (err) {
                    console.log('err________', err, data);
                }
            },
        });

    }, [socketOpen]);

    const getAppDetail = (appId) => {
        let _data = {
            type: "app",
            data: {
                appId: appId
            }
        }

        singleSocket && singleSocket.onSendMessage(_data);
    }

    return (
        <TouchableOpacity disabled onPress={() => props.onPress && props.onPress(item)} style={styles.listCont} >
            <View style={styles.profileCont} >
                <Image style={styles.profileImage} source={{ uri: details?.icon }} />
            </View>
            <View style={styles.centerCont} >
                <Text style={styles.tokenName} >{details?.name}</Text>
            </View>
            <TouchableOpacity style={{ ...CommonStyles.center }} onPress={() => props.onDisconnect && props.onDisconnect(item, details?.name)}>
                <Image style={styles.actionIcon} source={ImagesSrc.deleteIcon} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const Connect = ({ route, navigation }) => {

    const { appId } = route.params;
    const dispatch = useDispatch();
    const { wallet, data, passcode } = useSelector(state => state.UserReducer);
    const { socketOpen } = useSelector(state => state.WalletReducer);

    const [isSocketConnected, setSocketConnected] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [requestedAppData, setRequestedAppData] = useState(null);
    const [connectedApps, setConnectedApps] = useState([]);
    const [showConnectionSuccess, setConnectionSuccess] = useState(false);

    const onCheckPermission = async () => {

        alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.comingSoon'),
        )

        // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);
        //
        // if (!isGranted) {
        //     confirmationAlert(
        //         translate("wallet.common.cameraPermissionHeader"),
        //         translate("wallet.common.cameraPermissionMessage"),
        //         translate("common.Cancel"),
        //         translate("wallet.common.settings"),
        //         () => openSettings(),
        //         () => null
        //     )
        // } else {
        //     navigation.navigate("scanToConnect");
        // }
    }

    const renderApps = ({ item, index }) => {
        return <ListItems item={item} socketOpen={socketOpen} onDisconnect={disconnectApp} />
    }

    const keyExtractor = (item, index) => { return `_${index}` }

    console.log('appId', appId);

    const onSocketOpen = () => {
        dispatch(setSocketOpenStatus(true));
    }

    const onSocketClose = () => {
        dispatch(setSocketOpenStatus(false));
    }

    // useEffect(()=>{
    //     if(passcode){
    //         navigation.navigate('PasscodeScreen',{screen: "security"});
    //     }
    // },[]);

    useEffect(() => {
        console.log('useEffect, passcode', passcode, !passcode, socketOpen)
        if (socketOpen) {
            if (appId && !passcode) {
                connectApp(appId);
            }
            getAppId();
        } else {
            singleSocket.connectSocket(onSocketOpen, onSocketClose).then(() => {
                console.log('Socket connected')
                if (appId && !passcode) {
                    console.log('Connect app called')
                    connectApp(appId);
                }
                getAppId();
            });
        }

        const socketSubscribe = Events.asObservable().subscribe({
            next: data => {
                console.log('socket subscribe', data);
                try {
                    const response = JSON.parse(data);

                    if (response.status === 'success') {
                        if (response.type == 'newconnectionrequest') {
                            setRequestedAppData(response.data);
                            setApproveModal(true);
                        } else if (response.type == 'remove') {
                            // alertWithSingleBtn('', response.data);
                            if (response.data.appId) {
                                setConnectedApps([]);
                                navigation.setParams({ appId: null });
                            }
                        } else if (response.type == 'walletInfo') {
                            if (response.data.isAppApproved == 'true') {
                                setConnectedApps([response.data.appId]);

                                let url = `https://app-api.xana.net/auth/get-user-nonce`;
                                let urlXanalia = `${BASE_URL}/auth/get-address-nonce`;

                                let body = {
                                    walletAddress: wallet?.address
                                }
                                let bodyXanalia = {
                                    publicAddress: wallet?.address
                                }

                                axios.post(url, body)
                                    .then(response => {
                                        console.log(response.data?.data, "Get Nonce response")
                                        let signature = getSig(response.data?.data?.nonce, wallet.privateKey);
                                        axios.post(urlXanalia, bodyXanalia)
                                            .then(responseXanalia => {
                                                console.log(responseXanalia.data?.data, "Get Nonce response Xanalia")
                                                let signatureXanalia = getSig(responseXanalia.data?.data, wallet.privateKey);
                                                let _data = {
                                                    type: "sig",
                                                    data: {
                                                        sig: signature,
                                                        walletId: wallet?.address,
                                                        nonce: response.data?.data?.nonce,
                                                        sigXanalia: signatureXanalia,
                                                        nonceXanalia: responseXanalia.data?.data
                                                    }
                                                }
                                                console.log('Data sent to sig event', _data)
                                                singleSocket.onSendMessage(_data);
                                            })
                                            .catch(error => {
                                                console.log(error, "Get Nonce error Xanalia")
                                            });
                                    })
                                    .catch(error => {
                                        console.log(error.response, "Get Nonce error")

                                    });
                            }else if (response.data.isConnected == 'false') {
                                singleSocket.connectSocket(onSocketOpen, onSocketClose).then(() => {
                                });
                            } else {
                                setConnectedApps([]);
                            }
                        } else if (response.type == 'connection approved') {
                            // alertWithSingleBtn('', response.data);
                            let id = response.data.appId;
                            if (id) {
                                if (connectedApps.includes(id)) {
                                    alertWithSingleBtn( translate("wallet.common.alert"), translate("wallet.common.error.appAlreadyConnected"));
                                } else {
                                    // let array = [...connectedApps, ids[1]];
                                    // dispatch(setConnectedAppsToLocal(array));
                                    getAppId();
                                }
                            }
                        } else if (response.type == 'asksig') {
                            console.log('message_data', response.data);
                            let signature = getSig(response.data.msg, wallet.privateKey);
                            let _data = {
                                type: "sig",
                                data: {
                                    sig: signature,
                                    walletId: wallet?.address
                                }
                            }
                            singleSocket.onSendMessage(_data);
                        } else if (response.type == 'sig') {
                            // alertWithSingleBtn( translate("wallet.common.connectionEstablished"), translate("wallet.common.openApp"));
                            setConnectionSuccess(true)
                        } else if (response.type == 'connected') {
                            // alertWithSingleBtn('', '');
                        }
                    } else if (response.status === 'error') {
                        if (response.type == 'wallet') {

                        } else if (response.type == 'approve') {
                            alertWithSingleBtn('', translate('wallet.common.error.appNotConnected'));
                        }else if (response.type == 'remove') {
                            setConnectedApps([]);
                            // navigation.setParams({ appId: null });
                        }
                    }
                } catch (err) {
                    console.log('err________', err);
                }

                //  else if (response.type == 'error' && !response.data.includes("walletId doesn't exists")) {
                //     console.log('error',response.data);
                //     if(response.data.includes(`walletID:${wallet.address}`)){
                //         alertWithSingleBtn('', '');
                //     }else{
                //         alertWithSingleBtn('', response.data);
                //     }
                // }
            },
        });
        return () => {
            socketSubscribe && socketSubscribe.unsubscribe();
        };
    }, [appId]);

    const connectApp = (appId) => {
        console.log('connecting', appId);
        dispatch(setRequestAppId(null));
        let data = {
            type: 'connect',
            data: {
                type: "wallet",
                data: {
                    walletId: wallet?.address,
                    publicKey: wallet?.address,
                    appId: appId
                }
            },
        };
        singleSocket.onSendMessage(data);
    };

    const approveRejectApp = (appId, flag) => {
        let data = {
            type: "approve",
            data: {
                appId: appId,
                walletId: wallet?.address,
                flag: flag,
                publicKey: wallet?.address
            }
        }
        singleSocket.onSendMessage(data);
        navigation.setParams({
            appId: null,
        });
    }

    const disconnectApp = (id, name) => {
        console.log('id from disconnect spp',id)
        confirmationAlert(
            translate('wallet.common.verification'),
            translate('wallet.common.askDisconnect', { appName: name }),
            translate('wallet.common.cancel'),
            '',
            () => {
                let data = {
                    type: "remove",
                    data: {
                        appId: id,
                        walletId: wallet?.address
                    }
                }
                console.log('disconnect app', data);
                singleSocket.onSendMessage(data);
            },
            () => null
        );
    }

    const getAppId = () => {
        const data = {
            type: "wallet",
            data: {
                walletId: wallet?.address
            }
        }
        singleSocket.onSendMessage(data);
    }

    const handleListEmptyComponent = () => {
        return (
            <View style={styles.emptyView}>
                <Image source={ImagesSrc.noApp} style={styles.emptyImage} />
                <TextView style={styles.noData}>
                    {translate('wallet.common.noAppConnect')}
                </TextView>
            </View>
        );
    }

    return (
        <AppBackground>
            <AppHeader
                title={translate("wallet.common.walletConnect")}
                titleStyle={styles.screenTitle} />
            <View style={styles.container}>
                <TextView style={styles.heading}>{translate("wallet.common.connectInfo")}{"\n"}{translate("wallet.common.connectInfo2")}</TextView>

                <View style={styles.list}>
                    <FlatList
                        data={connectedApps}
                        renderItem={renderApps}
                        keyExtractor={keyExtractor}
                        ListEmptyComponent={handleListEmptyComponent}
                    />
                </View>

                <AppButton label={translate("wallet.common.connect")} containerStyle={CommonStyles.button} labelStyle={[CommonStyles.buttonLabel]}
                    onPress={onCheckPermission} />
            </View>
            <AppModal
                visible={approveModal}
                onRequestClose={() => setApproveModal(false)}>
                <ApproveModalContent
                    onClose={() => setApproveModal(false)}
                    appData={requestedAppData}
                    onAcceptPress={(appId) => {
                        approveRejectApp(appId, true);
                        setApproveModal(false);
                    }}
                    onRejectPress={(appId) => {
                        approveRejectApp(appId, false);
                        setApproveModal(false);
                    }}
                />
            </AppModal>
            <AppModal
                visible={showConnectionSuccess}
                onRequestClose={() => setConnectionSuccess(false)}>
                <NotificationActionModal
                    title={translate('wallet.common.connectionEstablished')}
                    hint={translate('wallet.common.openApp')}
                    btnText={translate('common.OK')}
                        onClose={() => setConnectionSuccess(false)}
                        onDonePress={() => {
                            setConnectionSuccess(false);
                        }}
                    />
            </AppModal>
        </AppBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp("5%"),
        paddingVertical: hp("2%"),
        paddingBottom: hp("4%")
    },
    screenTitle: {
        fontWeight: 'normal'
    },
    heading: {
        maxWidth: "80%",
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp("1.5%"),
        fontSize: RF(2),
        color: Colors.headingColor
    },
    list: {
        flex: 1,
        marginTop: hp("6%")
    },
    profileCont: {
        ...CommonStyles.circle("13")
    },
    profileImage: {
        ...CommonStyles.imageStyles(13),
    },
    listCont: {
        // paddingHorizontal: wp("4%"),
        paddingVertical: hp('1.8%'),
        flexDirection: "row",
        alignItems: 'center',
    },
    priceTxt: {
        fontSize: RF(2.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.black
    },
    townTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.townTxt,
        marginVertical: hp("0.5%")
    },
    percentTxt: {
        fontSize: RF(1.4),
        fontFamily: Fonts.ARIAL,
        color: Colors.percentColor,
        marginVertical: hp("0.5%")
    },
    centerCont: {
        flex: 1,
        paddingHorizontal: wp("4.1%"),
        // justifyContent: "center",
    },
    tokenName: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(2.3),
        color: Colors.townName,
    },
    separator: {
        backgroundColor: Colors.separatorThird,
        width: wp('90%'),
    },
    timeIcon: {
        ...CommonStyles.imageStyles(20)
    },
    timeCont: {
        ...CommonStyles.center,
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('3%')
    },
    timerTitle: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.8),
        color: Colors.timerTitle,
        textAlign: "center",
        marginTop: hp('1%')
    },
    timerDes: {
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.6),
        color: Colors.timerTitle,
        textAlign: "center",
        marginTop: hp('1%')
    },
    timerBtn: {
        borderColor: Colors.timerButtonBorder,
        marginTop: hp('3%'),
        backgroundColor: Colors.white
    },
    timerLabel: {
        fontSize: RF(1.8),
        color: Colors.timerButtonLabel,
    },
    noData: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.tabLabel, RF(2)),
        textAlign: "center",
        marginVertical: hp('2%')
    },
    detailsContainer: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    actionIcon: {
        ...CommonStyles.imageStyles(6)
    },
    button: {
        backgroundColor: Colors.buttonBackground,
        borderRadius: 10
    },
    emptyView: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp('5%'),
    },
    emptyImage: {
        width: wp('25%'),
        height: wp('25%'),
        alignSelf: 'center',
        marginVertical: hp('4%'),
    },
});

export default Connect;
