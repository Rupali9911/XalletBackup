import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';
import { AppHeader } from '../../components';
import { translate } from '../../walletUtils';
import Colors from '../../constants/Colors';
import { updateNotificationStatus } from '../../store/reducer/userReducer';
import { useDispatch } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import {
    openSettings,
} from 'react-native-permissions';
import { confirmationAlert } from '../../common/function';
import ListItem from '../../components/ListItem';
import { StyleSheet } from 'react-native';


function NotificationScreen() {
    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);


    const checkPermissions = async (status) => {
        if (status === true) {
            PushNotification.checkPermissions(async ({ alert }) => {
                console.log('CHECK PERMISSION', alert)
                if (!alert) {
                    NotificationAlert();
                }
            });
        }
        setToggle(status)
        dispatch(updateNotificationStatus(status))
    };

    const NotificationAlert = () => {
        return confirmationAlert(
            translate('wallet.common.notificationPermissionHeader'),
            translate('wallet.common.notificationPermissionDescription'),
            translate('common.Cancel'),
            translate('wallet.common.settings'),
            () => openSettings(),
            () => null,
        );
    };


    return (
        <SafeAreaView>
            <View style={styles.Header}>
                <AppHeader title={translate('wallet.common.notifications')} showBackButton />
            </View>

            <ScrollView>
                <View style={styles.section1}>

                    <ListItem
                        label={translate('wallet.common.enableNotifications')}
                        rightComponent={
                            <ToggleSwitch
                                onColor={Colors.themeColor}
                                offColor={Colors.GREY4}
                                isOn={toggle}
                                onToggle={isOn => {
                                    console.log('ToggleSwitch value', isOn)
                                    checkPermissions(isOn)
                                }}
                            />
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
export default NotificationScreen;


const styles = StyleSheet.create({

    Header: {
        width: '100%',
        backgroundColor: '#fff'
    },
    section1: {
        backgroundColor: Colors.white,
        marginTop: 0
    },

})

