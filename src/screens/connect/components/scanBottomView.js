import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import CommonStyles from '../../../constants/styles';
import Colors from '../../../constants/Colors';
import { hp, RF } from '../../../constants/responsiveFunct';
import Fonts from '../../../constants/Fonts';

const ScanButtons = (props) => {
    return (
        <TouchableOpacity style={styles.scanContainer} onPress={props.onPress}>
            <Image source={props.image} style={[styles.imgScan, props.style]} />
            <Text style={[styles.txtScan, { color: props.active ? (props.activeColor ? props.activeColor : Colors.white) : (props.inactiveColor ? props.inactiveColor : Colors.unSelectedTxt) }]}>{props.label}</Text>
        </TouchableOpacity>
    )
}

const ScanBottomView = (props) => {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <ScanButtons
                onPress={props.onLeftPress}
                image={props.leftIcon}
                label={props.leftLabel}
                active={props.leftActive}
                style={props.leftIconStyle}
                activeColor={props.activeColor}
                inactiveColor={props.inactiveColor}
                />
            <View style={[styles.vwDivider, props.dividerStyle]} />
            <ScanButtons
                onPress={props.onRightPress}
                image={props.rightIcon}
                label={props.rightLabel}
                style={props.rightIconStyle}
                active={props.rightActive}
                activeColor={props.activeColor}
                inactiveColor={props.inactiveColor}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: hp("6%"),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scanContainer: {
        flex: 1,
        ...CommonStyles.center
    },
    imgScan: {
        ...CommonStyles.imageStyles(10)
    },
    vwDivider: {
        width: 1,
        height: hp('7%'),
        backgroundColor: Colors.white
    },
    txtScan: {
        marginTop: hp("1%"),
        fontSize: RF(1.5),
        fontFamily: Fonts.ARIAL
    },
})

export default ScanBottomView;