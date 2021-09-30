import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { wp, hp } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";

const ButtonInputContainer = (props) => {

    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.view} style={[styles.container, { backgroundColor: props.isGreyBg ? Colors.inputBackground : Colors.white }, props.containerStyle]} >
            {
                props.children
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: hp('5%'),
        borderWidth: 1,
        borderColor: Colors.themeColor,
        paddingHorizontal: wp('4%'),
        borderRadius: 5,
        alignItems: "center",
        alignSelf: "center",
        marginVertical: hp('1%'),
        flexDirection: "row",
    }
})

export default ButtonInputContainer;
