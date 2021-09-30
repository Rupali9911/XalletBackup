import React, { useState, useEffect } from 'react';
import {
    View, StyleSheet, Image
} from 'react-native';
import {IconButton} from 'react-native-paper';
import AppModal from './appModal';
import Colors from '../constants/Colors';
import { wp, hp, RF } from '../constants/responsiveFunct';
import ImagesSrc from '../constants/Images';
import CommonStyles from '../constants/styles';
import TextView from './appText';
import AppButton from './appButton';
import { translate } from '../utils';

const NotificationActionModalContent = (props) => {

    return(
        <View style={styles.container}>
            <IconButton icon={'close'} color={Colors.headerIcon2} size={20} style={styles.closeIcon}  onPress={()=>{
                props.onClose && props.onClose();
            }}/>
            <Image style={styles.img} source={ImagesSrc.notificationAction} />
            <TextView style={styles.title}>{translate("common.yourPhrase")}</TextView>
            <TextView style={styles.hint}>{translate("common.notificationHint")}</TextView>
            <AppButton label={translate("common.enable")} containerStyle={styles.button} labelStyle={CommonStyles.buttonLabel} 
                onPress={()=>{
                    props.onDonePress && props.onDonePress();
                }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingHorizontal: wp("2%"),
        borderRadius: 15,
        alignItems: 'center'
    },
    closeIcon: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.iconBg
    },
    img: {
        ...CommonStyles.imageStyles(25),
        marginVertical: hp("4%")
    },
    title: {
        fontSize: RF(3),
        marginTop: hp("5%")
    },
    hint: {
        color: Colors.modalHintText,
        marginTop: "4.7%",
        marginBottom: hp("5%"),
        textAlign: 'center',
        fontSize: RF(1.7)
    },
    button: {
        width: '90%',
        ...CommonStyles.button,
        marginVertical: hp("3%")
    }
});

export default NotificationActionModalContent;