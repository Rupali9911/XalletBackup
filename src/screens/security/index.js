import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import ToggleSwitch from 'toggle-switch-react-native';
import DeviceInfo from "react-native-device-info";
import styles from "./styled";
import { translate, languageArray } from '../../walletUtils';
import { AppHeader } from '../../components';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../common/responsiveFunction';
import { images, colors } from '../../res';
import Colors from '../../constants/Colors';
import Modal from "react-native-modal";
import { setAppLanguage } from '../../store/reducer/languageReducer';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItem = (props) => {
    return (
        <TouchableOpacity disabled={props.disableView} onPress={props.onPress} style={styles.itemCont} >
            <View style={styles.centerProfileCont} >
                <Text style={styles.listLabel} >{props.label}</Text>
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

    const dispatch = useDispatch();
    const [toggle, setToggle] = useState(false);

    useEffect(async () => {
        let pass = await AsyncStorage.getItem("@passcode");

        if (pass) {
            setToggle(true)
        } else {
            setToggle(false)
        }
    }, [])

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
                            offColor={colors.GREY4}
                            onToggle={isOn => {
                                navigation.navigate("PasscodeScreen", { updateToggle: () => setToggle(!toggle), screen: "security" })
                            }}
                        />}
                    />

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

export default SecurityScreen;