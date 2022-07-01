import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { colors } from '../res';

const Loader = (props) => {
    return (
        <View style={props.style ? props.style : styles.loaderCont} >
            <ActivityIndicator size="large" color={colors.themeR} />
        </View>
    )
}

const styles = StyleSheet.create({
    loaderCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default Loader;