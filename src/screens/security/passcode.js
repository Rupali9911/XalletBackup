import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, View, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ToggleSwitch from 'toggle-switch-react-native';
import DeviceInfo from "react-native-device-info";
import styles from "./styled";
import { translate, languageArray } from '../../walletUtils';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF } from '../../common/responsiveFunction';
import { images, colors } from '../../res';
import Colors from '../../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

function PasscodeScreen({
    route,
    navigation
}) {

    const { updateToggle, screen } = route.params;

    const [passcode, setpasscode] = useState([])
    const [reEnterpasscode, setReenterpasscode] = useState([])
    const [status, setStatus] = useState(false)
    const [oldPasscode, setoldPasscode] = useState("")

    const dispatch = useDispatch();
    let numberArr = Array.from({ length: 9 }, (_, i) => i + 1);
    numberArr.push(0)
    numberArr.push("")

    useEffect(async () => {
        let pass = await AsyncStorage.getItem("@passcode");

        if (pass) {
            setStatus(true)
            setoldPasscode(pass)
        }

    }, [])

    const addItem = (v) => {

        let active = status ? "passcode" : passcode.length === 6 ? "reEnter" : "passcode";
        // debugger
        let pass = active == "passcode" ? [...passcode] : [...reEnterpasscode];
        if (pass.length < 7) {
            pass.push(v)
            if (pass.length > 6) return;
            active == "passcode" ? setpasscode(pass) : setReenterpasscode(pass)

            if (pass.length == 6) {
                if (status) {
                    if (screen== "security"){
                        if(pass.join("") == oldPasscode){
                            updateToggle();
                            AsyncStorage.removeItem("@passcode")
                            navigation.goBack();
                        }else{
                            setpasscode([])
                        }
                    }else{

                    }

                } else {
                    if (active === "reEnter") {
                        if (passcode.join("") == pass.join("")) {
                            AsyncStorage.setItem("@passcode", pass.join(""))
                            updateToggle();
                            navigation.goBack();
                        } else {
                            setReenterpasscode([])
                        }
                    }
                }
            }
        }
    }

    const removeItem = () => {
        let active = status ? "passcode" : passcode.length === 6 ? "reEnter" : "passcode";

        let pass = active == "passcode" ? [...passcode] : [...reEnterpasscode];

        pass.pop()
        active == "passcode" ? setpasscode(pass) : setReenterpasscode(pass)


    }

    let label = status ? translate("wallet.common.enterPasscode1") : passcode.length === 6 ? translate("wallet.common.enterPasscode2") : translate("wallet.common.enterPasscode")

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

            <View style={{ flex: 1 }} >

                <Text style={styles.label}>{label}</Text>
                <View style={styles.circleCont} >
                    {
                        [...Array(6).keys()].map((v, i) => {

                            let active = status ? passcode : passcode.length === 6 ? reEnterpasscode : passcode;

                            return (
                                <View style={[styles.circle, { backgroundColor: active[i] ? colors.themeR : colors.white }]} />
                            )
                        })
                    }
                </View>

            </View>
            <View style={{ flex: 1 }} >
                <View style={styles.sep} />

                <View style={{ ...styles.keypadCont }} >

                    {
                        numberArr.map(v => {
                            if (v === "") {
                                return (
                                    <TouchableOpacity onPress={() => removeItem()} style={styles.keypadItem} >
                                        <Icon name="backspace-outline" size={RF(2.5)} />
                                    </TouchableOpacity>
                                )
                            }
                            return (
                                <TouchableOpacity onPress={() => addItem(v)} style={styles.keypadItem} >
                                    <Text style={styles.keypadFont}>{v}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>

        </SafeAreaView>
    )
}

export default PasscodeScreen;