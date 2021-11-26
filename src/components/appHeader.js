import React from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from '../constants/Colors';
import CommonStyles from '../constants/styles';
import { hp, RF, wp } from '../constants/responsiveFunct';
import ImagesSrc from "../constants/Images";
import { FONTS, COLORS } from '../constants';

function AppHeader(props) {
    const navigation = useNavigation();

    let labelStyle = Platform.OS === "android" ? {
        flex: 1,
        textAlignVertical: "center",
    } : {}

    return (
        <View style={[styles.container, props.containerStyle]} >
            <View style={{ flex: 1, justifyContent: "center" }} >
                {
                    props.showBackButton ?
                        <TouchableOpacity style={styles.backContainer} onPress={() => props.onPressBack ? props.onPressBack() : navigation.goBack()} >
                            {
                                <Image style={[styles.backIcon, { tintColor: props.isWhite ? Colors.white : Colors.black }]} source={ImagesSrc.backArrow} />
                            }
                        </TouchableOpacity> : null
                }
            </View>
            <View style={{ height: "100%", justifyContent: "center" }} >
                {
                    props.titleComponent ?
                        props.titleComponent
                        :
                        <Text style={[styles.title, labelStyle, { color: props.isWhite ? Colors.white : Colors.black }, props.titleStyle]} >{props.title}</Text>
                }
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }} >
                {
                    props.showRightButton ?
                        <TouchableOpacity style={styles.backContainer} onPress={props.onPressRight} >
                            {
                                props.rightButtonComponent
                            }
                        </TouchableOpacity> :
                        props.showRightComponent ?
                            props.showRightComponent : null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp('7%'),
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: wp("3%"),
        alignItems: 'center'
    },
    title: {
        fontSize: RF(2.0),
        fontFamily: FONTS.PINGfANG_SBOLD,
        textAlign: "center",
        color: COLORS.BLACK1
    },
    backContainer: {
    },
    backIcon: {
        ...CommonStyles.imageStyles(5),
    }
})

export default AppHeader;