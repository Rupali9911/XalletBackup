import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    Platform
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
import { openSettings } from 'react-native-permissions';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';
import SingleSocket from '../../helpers/SingleSocket';
import { Events } from '../../App';
import { useDispatch, useSelector } from 'react-redux';
import AppModal from '../../components/appModal';
import ApproveModalContent from '../../components/approveAppModal';
import { alertWithSingleBtn } from '../../utils';
import { setConnectedApps, setConnectedAppsToLocal, setRequestAppId, setSocketOpenStatus } from '../../store/reducer/walletReducer';

const singleSocket = SingleSocket.getInstance();

const ListItems = (props) => {
    const { item, socketOpen } = props;

    const [details, setDetails] = useState(null); 

    useEffect(()=>{
        if(socketOpen){
            getAppDetail(item);
        }
        
        const socketSubscribe = Events.asObservable().subscribe({
            next: data => {
              console.log('data', data);
              const response = JSON.parse(data);
              if(response.type == 'success'){
                  setDetails(response.data);
              }
            },
          });

    },[socketOpen]);

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
        <TouchableOpacity onPress={() => props.onPress && props.onPress(item)} style={styles.listCont} >
            <View style={styles.profileCont} >
                <Image style={styles.profileImage} source={{uri: details?.icon}} />
            </View>
            <View style={styles.centerCont} >
                <Text style={styles.tokenName} >{details?.name}</Text>
            </View>
            <View style={{ ...CommonStyles.center }} >
                <Image style={styles.actionIcon} source={ImagesSrc.deleteIcon} />
            </View>
        </TouchableOpacity>
    )
}

let flag = false;

const Connect = ({ route, navigation }) => {

    const {appId} = route.params;
    const dispatch = useDispatch();
    const {wallet, data, passcode} = useSelector(state => state.UserReducer);
    const {connectedApps,socketOpen} = useSelector(state => state.WalletReducer);

    const [isSocketConnected, setSocketConnected] = useState(false);
    const [approveModal, setApproveModal] = useState(false);
    const [requestedAppData, setRequestedAppData] = useState(null);

    const onCheckPermission = async () => {
        const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);

        if (Platform.OS === 'android') {
            if (!isGranted && flag) {
                confirmationAlert(
                    'This feature requires camera access',
                    'To enable access, tap Settings and turn on Camera.',
                    'Cancel',
                    'Settings',
                    () => openSettings(),
                    () => null
                )
            } else {
                flag = true;
                navigation.navigate("scanToConnect");
            }
        } else {
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
                navigation.navigate("scanToConnect");
            }
        }
    }

    const renderApps = ({ item, index }) => {
        return <ListItems item={item} socketOpen={socketOpen}/>
    }

    const keyExtractor = (item, index) => { return `_${index}` }

    console.log('appId',appId);

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
        if(socketOpen){
            if(appId && !passcode){
                connectApp(appId);
            }
        }else{
            singleSocket.connectSocket(onSocketOpen, onSocketClose).then(() => {
                if(appId && !passcode){
                    connectApp(appId);
                }
            });
        }
        const socketSubscribe = Events.asObservable().subscribe({
            next: data => {
              console.log('data', data);
              const response = JSON.parse(data);
              if (response.type == 'newconnectionrequest') {
                  setRequestedAppData(response.data);
                  setApproveModal(true);
              }else if(response.type == 'success' && typeof(response.data) == 'string'){
                  alertWithSingleBtn('',response.data);
              }else if(response.type == 'connected'){
                  alertWithSingleBtn('',response.data);
                  let ids = response.data.split(':');
                  if(ids.length > 1){
                      if(connectedApps.includes(ids[1])){
                      }else{
                          let array = [...connectedApps, ids[1]];
                          dispatch(setConnectedAppsToLocal(array));
                      }
                  }
              }
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
                    walletId: wallet.address,
                    publicKey: wallet.address,
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
                walletId: wallet.address,
                flag: flag,
                publicKey: wallet.address
            }
        }
        singleSocket.onSendMessage(data);
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
                        ListEmptyComponent={() => {
                            return (
                              <View style={styles.emptyView}>
                                <Image source={ImagesSrc.noApp} style={styles.emptyImage} />
                                <TextView style={styles.noData}>
                                  {translate('wallet.common.noAppConnect')}
                                </TextView>
                              </View>
                            );
                          }}
                    />
                </View>

                <AppButton label={translate("wallet.common.newConnection")} containerStyle={CommonStyles.button} labelStyle={[CommonStyles.buttonLabel]}
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