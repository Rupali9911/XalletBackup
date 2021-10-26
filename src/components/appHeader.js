import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from '../constants/Colors';
import CommonStyles from '../constants/styles';
import { screenWidth, hp, RF, wp } from '../constants/responsiveFunct';
import ImagesSrc from "../constants/Images";
import TextView from "./appText";
import {
    FONT,
    FONTS,
    COLORS
} from '../constants';

function AppHeader(props) {
    const navigation = useNavigation();

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
            {
                props.titleComponent ?
                    props.titleComponent
                    :
                    <TextView style={[styles.title, { color: props.isWhite ? Colors.white : Colors.black }, props.titleStyle]} >{props.title}</TextView>
            }
            <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center"}} >
                {
                    props.showRightButton ?
                        <TouchableOpacity style={styles.backContainer} onPress={props.onPressRight} >
                            {
                                props.rightButtonComponent
                            }
                        </TouchableOpacity> : null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp('7%'),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5,
        marginHorizontal: wp("3%"),
    },
    title: {
        fontSize: FONT(16),
        lineHeight: FONT(17),
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
