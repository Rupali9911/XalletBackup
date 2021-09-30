import React from 'react';
import { StyleSheet, Text, TextPropTypes } from 'react-native';
import Fonts from '../constants/Fonts';
import { RF, hp} from '../constants/responsiveFunct';
import Colors from '../constants/Colors';

const HintText = (props) => {
    const {style, ...other} = props;
    return (
        <Text
            style={[styles.default, style]}
            {...other}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        width: "95%",
        fontFamily: Fonts.ARIAL,
        fontSize: RF(1.6),
        marginVertical: hp("5%"),
        textAlign: 'center',
        alignSelf: 'center',
        color: Colors.hintText
    }
});

HintText.propTypes = {
    ...TextPropTypes
}

export default HintText;