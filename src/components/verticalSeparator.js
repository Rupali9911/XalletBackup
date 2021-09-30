import React from 'react';
import { View, StyleSheet } from 'react-native';

import Colors from "../constants/Colors";

function VerticalSeparator(props) {
    return (
        <View style={[styles.separator, props.style]} />
    )
}

const styles = StyleSheet.create({
    separator: {
        width: 1,
        height: "100%",
        backgroundColor: Colors.borderColorGrey,
        alignSelf: "center"
    }
})

export default VerticalSeparator;
