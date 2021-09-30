import React from 'react';
import { StyleSheet, Text, TextPropTypes } from 'react-native';
import Fonts from '../constants/Fonts';

const TextView = (props) => {
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
        fontFamily: Fonts.ARIAL
    }
});

TextView.propTypes = {
    ...TextPropTypes
}

export default TextView;