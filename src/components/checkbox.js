import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ImagesSrc from '../constants/Images';
import { screenWidth, hp, wp, RF} from '../constants/responsiveFunct';
import TextView from './appText';
import Colors from '../constants/Colors';

function Checkbox(props) {
    const [isCheck, setCheck] = useState(props.isCheck);
    const iconsize = props.iconSize || wp("7.5%")

    useEffect(()=>{
        setCheck(props.isCheck);
    },[props.isCheck]);

    return (
        <View style={[styles.container, props.containerStyle]}>
            <TouchableOpacity onPress={() => {
                // setCheck(!isCheck)
                props.onChecked && props.onChecked(!isCheck);
            }}>
                <Image style={[{width: iconsize, height: iconsize},props.logoStyle]} resizeMode="contain" source={isCheck ? ImagesSrc.checkIcon : ImagesSrc.unCheckIcon} />
            </TouchableOpacity>
            {props.label && <TextView style={[styles.label, props.labelStyle]}>{props.label}</TextView>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        // alignSelf: 'baseline',
        marginRight: 5
    },
    label: {
        flex: 1,
        fontSize: RF(1.6),
        marginVertical: hp("1%"),
        marginHorizontal: hp("1%"),
        color: Colors.themeColor,
    },
    logoSize: {
        width: wp("7.5%"),
        height: wp("7.5%"),
    }
})

export default Checkbox;