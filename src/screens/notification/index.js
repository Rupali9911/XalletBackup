import React, { useEffect, useState } from 'react';


import {
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { AppHeader } from '../../components';
import styles from './styles';
import { translate } from '../../walletUtils';
import Colors from '../../constants/Colors';
import { updateNotificationStatus } from '../../store/reducer/userReducer';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotification } from '../../store/reducer/userReducer';
import { updateUserData } from '../../store/reducer/userReducer';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import {
    checkNotifications,
    openSettings,
    requestNotifications,
} from 'react-native-permissions';
import { confirmationAlert } from '../../common/function';
// import { initiateLogout } from '../../store/reducer/userReducer';










const ListItem = props => {
    return (

        <View style={styles.centerProfileCont}>
            <View>
                <Text style={styles.listLabel}>{props.label}</Text>
            </View>
            {props.rightComponent ? (props.rightComponent) : null}
        </View>
    );
};




function NotificationScreen() {
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);
    const status = !toggle ? true : false


    // const { showSuccess } = useSelector(state => state.UserReducer);
    // const modalState = Platform.OS === 'android' ? false : showSuccess;
    // const [modalVisible, setModalVisible] = useState(modalState);
    // const [isNotificationVisible, setNotificationVisible] = useState(false);


    // console.log('This value is of push_ntification:', pushNotification)

    // const handleToggle = () => {
    //     dispatch(updateNotificationStatus(status))

    // }


    // const newStatus = toggle ? 1 : 0
    //     dispatch(updateNotificationStatus(newStatus))
    // }

    const checkPermissions = async () => {
        PushNotification.checkPermissions(async ({ alert }) => {
            console.log('CHECK PERMISSION', alert)
            if (!alert) {
                customNotificationAlert();
                // setToggle(false)
            }
            else {
                // dispatch(updateNotificationStatus(status))

                setToggle(!toggle) ?
                    dispatch(updateNotificationStatus(status))
                    : dispatch(updateNotificationStatus(status))

            }
            // dispatch(updateNotificationStatus(status))
        });
    };

    const customNotificationAlert = () => {
        return confirmationAlert(
            translate('wallet.common.notificationPermissionHeader'),
            translate('wallet.common.notificationPermissionDescription'),
            translate('common.Cancel'),
            translate('wallet.common.settings'),
            () => openSettings(),
            () => null,
        );
    };
    // let language =
    //     fetch(`https://d2xw2jn71az7zi.cloudfront.net/lang/xanalia-app\en.json`)
    // console.log('languageRequest', language)

    // const renderAppModal = () => {
    //     return (
    //         <AppModal
    //             visible={isNotificationVisible}
    //             onRequestClose={() => isNotificationVisible(false)}>



    //             <NotificationActionModal
    //                 title={translate('wallet.common.setPushNotification')}
    //                 // hint={translate('wallet.common.notificationHint')}
    //                 hint={'enable notifications'}
    //                 btnText={translate('wallet.common.enable')}
    //                 onClose={() => setNotificationVisible(false)}
    //                 onDonePress={() => {
    //                     setModalVisible(false);
    //                     Platform.OS === 'ios'
    //                         ? checkNotifications().then(({ status, settings }) => {
    //                             if (status == 'denied') {
    //                                 requestNotifications(['alert', 'sound']).then(
    //                                     ({ status, settings }) => { },
    //                                 );
    //                             }
    //                             if (status == 'blocked') {
    //                                 Linking.openSettings();
    //                             }
    //                         })
    //                         : openSettings();
    //                 }}
    //             />

    //         </AppModal>
    //     );
    // };



    // const checkPermissions = async () => {
    //     PushNotification.checkPermissions(async ({ alert }) => {
    //         console.log('CHECK PERMISSION', alert)
    //         if (!alert) {
    //             // setNotificationVisible(true);
    //             Alert.alert(
    //                 'Push Notification Error',
    //                 'You need to enable push notification permissions in your device settings to receive notifications.',
    //                 [{
    //                     text: 'OK',
    //                     onPress: () => {
    //                         console.log('OK')
    //                         setToggle(toggle);

    //                     }
    //                 }],
    //                 { cancelable: false }
    //             );

    //         } else {
    //             setModalVisible(false);
    //         }
    //         //Call setToken api here
    //         dispatch(updateNotificationStatus(true))
    //     });
    // };

    // const checkPermissions = async () => {
    //     PushNotification.checkPermissions(async ({ alert }) => {
    //         console.log('CHECK PERMISSION', alert);
    //         if (!alert) {
    //             // If user has not granted notification permissions, show a message
    //             Alert.alert(
    //                 'Enable notifications',
    //                 'Please enable notifications to receive alerts',
    //                 [
    //                     {
    //                         text: 'Cancel',
    //                         onPress: () => console.log('Cancel Pressed'),
    //                         style: 'cancel',
    //                     },
    //                     {
    //                         text: 'OK',
    //                         onPress: () => {
    //                             console.log('OK')
    //                             // Open app settings to allow user to enable notifications
    //                             // PushNotification.openSettings();
    //                         },
    //                     },
    //                 ],
    //                 { cancelable: false }
    //             );
    //             // Hide any notification-related UI elements
    //             setNotificationVisible(false);
    //             setModalVisible(false);
    //         } else {
    //             // User has granted notification permissions, show any relevant UI elements
    //             setNotificationVisible(true);
    //             setModalVisible(true);
    //         }
    //         //Call setToken api here
    //         dispatch(updateNotificationStatus(true));
    //     });
    // };




    // const checkPushNotificationPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
    //         if (!granted) {
    //             Alert.alert(
    //                 'Push Notification Error',
    //                 'You need to enable push notification permissions in your device settings to receive notifications.',
    //                 [{
    //                     text: 'OK',
    //                     onPress: () => {
    //                         console.log('OK')
    //                         setToggle(toggle);

    //                     }
    //                 }],
    //                 { cancelable: false }
    //             );
    //         }
    //     } else {
    //         PushNotification.checkPermissions((permissions) => {
    //             if (!permissions.alert) {
    //                 Alert.alert(
    //                     'Push Notification Error',
    //                     'You need to enable push notification permissions in your device settings to receive notifications.',
    //                     [{ text: 'OK' }],
    //                     { cancelable: false }
    //                 );
    //             }
    //             dispatch(updateNotificationStatus(true))

    //         });
    //     }
    // };

    // const renderAppModal = () => {
    //     return (
    //         <AppModal
    //             visible={modalVisible}
    //         >
    //         </AppModal>
    //     );
    // };

    // { renderAppModal() }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', backgroundColor: '#fff' }}>
                <AppHeader title={translate('wallet.common.notifications')} showBackButton />
            </View>

            <ScrollView>
                <View style={[styles.section2, { marginTop: 0 }]}>

                    <ListItem

                        label={translate('wallet.common.enableNotifications')}
                        rightComponent={
                            <ToggleSwitch

                                onColor={Colors.themeColor}
                                offColor={Colors.GREY4}
                                isOn={toggle}
                                disable={true}
                                // updateNotificationStatus={updateNotificationStatus}
                                // status={1}
                                onToggle={isOn => {
                                    // { !toggle ? (console.log('updateNotificationFrom user Data: ', handleToggle)) : null }
                                    // userData.push_notification === true
                                    // console.log('onToggleCall: ')
                                    // dispatch(updateUserData(userData, newPushNotificationEnabled));

                                    // {
                                    // !toggle ?
                                    // dispatch(initiateLogout())
                                    // console.log(initiateLogout)
                                    checkPermissions()

                                    // setToggle(!toggle);
                                    // dispatch(updateNotificationStatus(status)) : null
                                    // dispatch(updateNotificationStatus(status === 1)) :

                                    // }

                                    // dispatch(updateNotificationStatus(status === 1))
                                    // dispatch(updateNotification())
                                    // updateNotificationStatus

                                    // dispatch()
                                    // // { !toggle ? updateNotificationStatus : null }
                                    // updateNotificationStatus
                                    // handleToggle
                                    // const reqData = {
                                    //     device_id: '123',
                                    //     device_token: '234',
                                    //     status: 1
                                    // }
                                    // sendRequest({
                                    //     url: `${NEW_BASE_URL}/users/create-mobile-device`,
                                    //     method: 'POST',
                                    //     data: reqData

                                    // })
                                    //     .then(response => {
                                    //         console.log('response from create-mobile-device api', response)
                                    //         // resolve();
                                    //     })
                                    //     .catch(error => {
                                    //         console.log('Error from create-mobile-device api', error)
                                    //         // reject(error);
                                    //     });

                                    // console.log('updateNotificationStatus on')
                                    // AsyncStorage.getItem('@NOTIFICATION_TOKEN').then(device_token => {
                                    //     let req_data = {
                                    //         device_id: DeviceInfo.getUniqueId(),
                                    //         device_token: device_token,
                                    //         // status: status,
                                    //     };
                                    //     console.log('Request param for create-mobile-device api', req_data)

                                    //     sendRequest({
                                    //         url: `${NEW_BASE_URL}/users/create-mobile-device`,
                                    //         method: 'POST',
                                    //         data: req_data,
                                    //     })
                                    //         .then(res => {
                                    //             console.log('response from create-mobile-device api', res)
                                    //             resolve();
                                    //         })
                                    //         .catch(e => {
                                    //             console.log('Error from create-mobile-device api', e)
                                    //             reject(e);
                                    //         });

                                    // });
                                }}
                            />

                        }
                    />


                </View>
                {/* <AppModal
                    visible={modalVisible} /> */}

                {/* <AppModal

                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}>

                    {isNotificationVisible ? (
                        <NotificationActionModal
                            title={translate('wallet.common.setPushNotification')}
                            hint={translate('wallet.common.notificationHint')}
                            btnText={translate('wallet.common.enable')}
                            onClose={() => setModalVisible(false)}
                            onDonePress={() => {
                                setModalVisible(false);
                                Platform.OS === 'ios'
                                    ? checkNotifications().then(({ status, settings }) => {
                                        if (status == 'denied') {
                                            requestNotifications(['alert', 'sound']).then(
                                                ({ status, settings }) => { },
                                            );
                                        }
                                        if (status == 'blocked') {
                                            Linking.openSettings();
                                        }
                                    })
                                    : openSettings();
                            }}
                        />
                    ) : null}
                </AppModal> */}
            </ScrollView>
            {/* {renderAppModal()} */}

        </SafeAreaView>
    );
}



export default NotificationScreen;

