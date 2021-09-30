import React from 'react';
import { View, StyleSheet } from 'react-native';

import Colors from "../constants/Colors";

function Separator(props) {
    return (
        <View style={[styles.separator, props.style]} />
    )
}

const styles = StyleSheet.create({
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: Colors.borderColorGrey,
        alignSelf: "center"
    }
})

export default Separator;
