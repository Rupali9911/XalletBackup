import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

import { wp, screenHeight, screenWidth } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import CommonStyles from '../constants/styles';

const FetchingIndicator = () => {

    return (
        <Modal
            visible={true}
            transparent
            onRequestClose={()=>console.log('close')}>
            <View style={styles.loaderCont} >
                <View style={styles.cardLoader} >
                    <ActivityIndicator size="large" color={Colors.themeColor} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    loaderCont: {
        ...CommonStyles.center,
        position: "absolute",
        top: 0,
        zIndex: 1,
        backgroundColor: Colors.blackOpacity(0.3),
        width: screenWidth, 
        height: screenHeight 
    },
    cardLoader: {
        ...CommonStyles.center,
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('2%'),
        backgroundColor: Colors.white
    }
})

export default FetchingIndicator;