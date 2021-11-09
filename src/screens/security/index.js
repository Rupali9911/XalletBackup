import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import ToggleSwitch from 'toggle-switch-react-native';
import styles from "./styled";
import { translate } from '../../walletUtils';
import { AppHeader } from '../../components';
import { responsiveFontSize as RF } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';

const ListItem = (props) => {

    const { isBackup } = useSelector(state => state.UserReducer);
    console.log('isBackup ------>',isBackup)
    return (
        <TouchableOpacity disabled={props.disableView} onPress={props.onPress} style={styles.itemCont} >
            <View style={styles.centerProfileCont} >
                <View>
                    <Text style={styles.listLabel} >{props.label}</Text>
                    {props.subLabel && <Text style={[styles.listSubLabel, { color: isBackup ? Colors.badgeGreen : Colors.alert }]}>{isBackup ? translate("wallet.common.backupSuccess") : translate("wallet.common.notBackedUp")}</Text>}
                </View>
                {
                    props.rightText ?
                        <Text style={styles.listLabel} >{props.rightText}</Text>
                        :
                        props.right ?
                            <View style={{ flexDirection: "row" }} >
                                <Text style={styles.listLabel} >{props.right}</Text>
                                <EntypoIcon size={RF(2.5)} color={Colors.GREY8} name="chevron-right" />
                            </View>
                            :
                            props.rightComponent ?
                                props.rightComponent :
                                <EntypoIcon size={RF(2.5)} color={Colors.GREY8} name="chevron-right" />
                }
            </View>
        </TouchableOpacity>
    )
}

function SecurityScreen({
    navigation
}) {

    const { wallet } = useSelector(state => state.UserReducer);
    const { passcode } = useSelector(state => state.AsyncReducer);

    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        setToggle(passcode ? true : false)
    }, [passcode])

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={{ width: "100%", backgroundColor: "#fff" }}>
                <AppHeader
                    title={translate("wallet.common.security")}
                    showBackButton
                />

            </View>

            <ScrollView>

                <View style={[styles.section2, { marginTop: 0 }]} >

                    <ListItem
                        disableView
                        onPress={() => null}
                        label={translate("wallet.common.passcode")}
                        rightComponent={<ToggleSwitch
                            isOn={toggle}
                            onColor={Colors.themeColor}
                            offColor={Colors.GREY4}
                            onToggle={isOn => {
                                navigation.navigate("PasscodeScreen", { screen: "security" })
                            }}
                        />}
                    />

                    {wallet.mnemonic && <ListItem
                        onPress={() => {
                            if(wallet.mnemonic){
                                navigation.navigate("recoveryPhrase", { wallet })
                            }
                        }}
                        label={translate("wallet.common.backupPhrase")}
                        subLabel={true}
                    />}

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default SecurityScreen;