import React from "react";
import { StyleSheet, View, Text } from "react-native";
import NumberFormat from 'react-number-format';

import CommonStyles from "../constants/styles";
import Fonts from "../constants/Fonts";
import Colors from "../constants/Colors";
import { hp, RF, wp } from "../constants/responsiveFunct";

const PriceText = (props) => {
    let textColor = { color: props.isWhite ? Colors.white : Colors.black };
    return (
        <View style={[styles.paymentCont, props.containerStyle]} >
            <Text style={[styles.paymentTxt, textColor]} >$</Text>
            <NumberFormat
                value={props.price || '0.00'}
                displayType={'text'}
                decimalScale={4}
                thousandSeparator={true}
                renderText={formattedValue => <Text numberOfLines={1} style={[styles.paymentTxt, textColor]} >{formattedValue}</Text>} // <--- Don't forget this!
            />
            
        </View>
    )
}

const styles = StyleSheet.create({
    paymentCont: {
        flexDirection: "row",
        ...CommonStyles.center,
        marginVertical: hp("1%")
    },
    paymentTxt: {
        fontSize: RF(4),
        fontFamily: Fonts.ARIAL,
        fontWeight: 'bold',
        // marginLeft: wp('2%'),
    },
    unitTxt: {
        fontSize: RF(3),
        fontFamily: Fonts.ARIAL,
        marginTop: hp("1.5%")
    },
})

export default PriceText;
