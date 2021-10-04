import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

import ImagesSrc from '../constants/Images';
import CommonStyles from '../constants/styles';
import { hp } from '../constants/responsiveFunct';

function AppLogo(props) {
    return (
        <View style={[styles.logoContainer, props.containerStyle]} >
            <Image style={[styles.logoSize, props.logoStyle]} resizeMode="contain" source={ImagesSrc.alia} />
            <Text style={[styles.appTitle, props.labelStyle]} >{props.label}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        ...CommonStyles.center
    },
    appTitle: {
        fontWeight: "500",
        textAlign: "center",
    },
    logoSize: {
        ...CommonStyles.imageStyles(45)
    }
})

export default AppLogo;