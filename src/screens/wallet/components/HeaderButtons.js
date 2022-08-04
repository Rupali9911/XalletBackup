import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    View
} from 'react-native';
import CommonStyles from '../../../constants/styles';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import { RF, hp, wp } from '../../../constants/responsiveFunct';

export const HeaderBtns = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.buttonContHeader} >
            <View style={[styles.iconContainer,props.bgColor && {backgroundColor: props.bgColor}]}>
                <Image source={props.image} style={[styles.headerBottomIcons,props.iconColor && {tintColor: props.iconColor}]} />
            </View>
            <Text style={[styles.headerBtnsText, styles.headerBottomText, props.labelColor && {color: props.labelColor}, props.labelStyle]} >{props.label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    headerBtns: {
        flexDirection: "row"
    },
    headerBtnsIcon: {
        ...CommonStyles.imageStyles(12)
    },
    headerBtnsText: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.black, RF(1.5)),
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonContHeader: {
        alignItems: 'center',
        flex: 1,
    },
    headerBottomIcons: {
        ...CommonStyles.imageStyles(6),
    },
    headerBottomText: {
        color: Colors.white,
        marginTop: hp('1%')
    },
    iconContainer: {
        backgroundColor: Colors.headerIconBg,
        padding: wp("3%"),
        borderRadius: wp("7%")
    }
});
