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
    const [toggle, setToggle] = useState(false);


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


                                onToggle={isOn => {
                                    setToggle(!toggle);

                                    { !toggle ? alert('enabled') : null }
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
