import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, View, Alert, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import EntypoIcon from "react-native-vector-icons/Entypo";
import ToggleSwitch from 'toggle-switch-react-native';
import DeviceInfo from "react-native-device-info";
import styles from "./styled";
import { translate, languageArray } from '../../walletUtils';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import { images, colors } from '../../res';
import Modal from "react-native-modal";
import { setAppLanguage } from '../../store/reducer/languageReducer';
import { CommonActions } from '@react-navigation/native';

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
                                <EntypoIcon size={RF(2.5)} color={colors.GREY8} name="chevron-right" />
                            </View>
                            :
                            props.rightComponent ?
                                props.rightComponent :
                                <EntypoIcon size={RF(2.5)} color={colors.GREY8} name="chevron-right" />
                }
            </View>
        </TouchableOpacity>
    )
}

function Setting({
    navigation
}) {

    const dispatch = useDispatch();
    const [ toggle, setToggle ] = useState(false);
    const [showLanguage, setShowLanguage] = useState(false);
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <View style={styles.header}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon} >
                    <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                </TouchableOpacity>
                <View style={{ flex: 2, justifyContent: "center"}}>
                    <Text style={styles.headerTitle}>{translate("wallet.common.setting")}</Text>
                </View>
                <View style={styles.headerChild} />

            </View>

            <ScrollView>

                <View style={[styles.section2, { marginTop: 0 }]} >
                    <ListItem
                        onPress={() => navigation.navigate("ChangePassword")}
                        label={translate("common.changePassword")}
                    />
                    <View style={{ ...styles.separator, width: wp("81%") }} />
                    <ListItem
                        onPress={() => null}
                        label={translate("wallet.common.AECredit")}
                    />
                    <View style={{ ...styles.separator, width: wp("81%") }} />
                    <ListItem
                        disableView={true}
                        onPress={() => null}
                        label={translate("wallet.common.security")}
                        rightComponent={<ToggleSwitch
                            isOn={toggle}
                            onColor={colors.LIGHT_BLUE}
                            offColor={colors.GREY4}
                            onToggle={isOn => setToggle(!toggle)}
                          />}
                    />
                    <View style={{ ...styles.separator, width: wp("81%") }} />
                    <ListItem
                        onPress={() => null}
                        label={translate("wallet.common.notifications")}
                    />
                    <View style={{ ...styles.separator, width: wp("81%") }} />
                    <ListItem
                        onPress={() => setShowLanguage(true)}
                        label={translate("wallet.common.language")}
                    />
                    <View style={{ ...styles.separator, width: wp("81%") }} />
                    <ListItem
                        onPress={() => null}
                        rightText={`${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber()}`}
                        label={translate("wallet.common.version")}
                    />
                </View>

            </ScrollView>
            <Modal
                isVisible={showLanguage}
                backdropColor="#B4B3DB"
                backdropOpacity={0.8}
                onBackdropPress={() => setShowLanguage(false)}
                animationIn="zoomInDown"
                animationOut="zoomOutUp"
                animationInTiming={600}
                animationOutTiming={600}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
            >

                <View style={styles.modalCont} >
                    <Text style={styles.modalTitle} >{translate("wallet.common.selectLanguage")}</Text>
                    <View style={{ marginTop: hp('3%') }} >
                        {
                            languageArray.map((v, i) => {

                                return (
                                    <TouchableOpacity key={i} onPress={() => {
                                        dispatch(setAppLanguage(v));
                                        setShowLanguage(false)
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    { name: 'Home' },
                                                ],
                                            })
                                        );
                                    }} style={{ ...styles.centerProfileCont, flex: null }} >
                                        <Text style={styles.listLabel} >{v.language_display}</Text>
                                        {
                                            selectedLanguageItem.language_name == v.language_name ?
                                                <EntypoIcon size={RF(2.5)} color={colors.DFDFDF} name="check" />
                                                : null
                                        }
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}

export default Setting;