import React from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Colors from '../constants/Colors';
import CommonStyles from '../constants/styles';
import { screenWidth, hp, RF } from '../constants/responsiveFunct';
import Fonts from "../constants/Fonts";
import ImagesSrc from "../constants/Images";
import TextView from "./appText";

function AppHeader(props) {
    const navigation = useNavigation();

    return (
        <View style={[styles.container, props.containerStyle]} >
            <View style={{ flex: 0.2 }} >
                {
                    props.showBackButton &&
                    <TouchableOpacity style={styles.backContainer} onPress={() => props.onPressBack ? props.onPressBack() : navigation.goBack()} >
                        {
                            <Image style={[styles.backIcon,{tintColor: props.isWhite ? Colors.white : null}]} source={ImagesSrc.backArrow} />
                        }
                    </TouchableOpacity>
                }
            </View>
            <View style={{ flex: 1, ...CommonStyles.center }} >
                {
                    props.titleComponent ?
                        props.titleComponent
                        :
                        <TextView style={[styles.title, { color: props.isWhite ? Colors.white : Colors.black }, props.titleStyle]} >{props.title}</TextView>
                }
            </View>
            <View style={{ flex: 0.2 }} >
                {
                    props.showRightButton &&
                    <TouchableOpacity style={styles.backContainer} onPress={props.onPressRight} >
                        {
                            props.rightButtonComponent
                        }
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: hp('7%'),
        width: screenWidth,
        flexDirection: "row",
        zIndex: 5,
    },
    title: {
        fontSize: RF(2),
        fontFamily: Fonts.ARIAL,
        fontWeight: 'bold'
    },
    backContainer: {
        ...CommonStyles.center,
        flex: 1,
    },
    backIcon: {
        ...CommonStyles.imageStyles(5)
    }
})

export default AppHeader;
