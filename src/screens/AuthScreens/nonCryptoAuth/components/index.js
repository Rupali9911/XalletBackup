import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';

import { colors, fonts } from '../../../../res';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF,
} from '../../../../common/responsiveFunction';
import LinearGradient from 'react-native-linear-gradient';

export const Label = (props) => {
    return (
        <View style={[styles.labelCont, props.containerStyle]} >
            <Text style={[styles.label, props.labelStyle]} >{props.label}</Text>
        </View>
    )
}

export const InputFields = props => {

    return (
        <View style={[styles.inputMain, props.inputMainStyle]} >
            <Text style={styles.inputLabel} >{props.label}</Text>
            <View
                style={[
                    styles.fieldCont,
                    props.inputContStyle,
                ]}>
                <TextInput
                    {...props.inputProps}
                    style={styles.field}
                />
            </View>
            {
                props.error ?
                    <Text style={styles.error}>{props.error}</Text> : null
            }
        </View>
    );
};

export const FormButton = props => {

    let checkGradient = props.gradient ? props.gradient : [colors.BLUE6];

    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disable}
            style={[
                styles.buttonCont,
                { backgroundColor: props.gradient ? "transparent" : colors.BLUE6, opacity: props.disable ? 0.6: 1 },
                props.buttonCont,
            ]}>
            <LinearGradient colors={checkGradient} style={[styles.buttonCont, props.buttonCont]}>
                <Text style={[styles.buttonLabel, { color: colors.white }, props.buttonLabel]}>
                    {props.label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    labelCont: {
        width: "100%",
        marginVertical: hp(2),
    },
    label: {
        fontSize: RF(2.4),
        color: colors.tabbar,
        fontWeight: "bold",
        fontFamily: fonts.ARIAL,
        textAlign: "center"
    },
    fieldCont: {
        height: hp('6%'),
        width: '100%',
        borderRadius: wp('1%'),
        borderWidth: 1,
        borderColor: colors.GREY12,
        marginVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        overflow: 'hidden',
    },
    field: {
        color: colors.BLACK6,
        fontFamily: fonts.SegoeUIRegular,
        fontSize: RF(1.6),
        flex: 1,
    },
    buttonCont: {
        height: hp('6%'),
        borderRadius: wp('8%'),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: hp('2%'),
    },
    buttonLabel: {
        fontFamily: fonts.ARIAL_BOLD,
        fontSize: RF(2),
    },
    inputLabel: {
        fontSize: RF(1.6),
        fontFamily: fonts.ARIAL,
        color: colors.GREY13,
        marginTop: hp(1)
    },
    error: {
        fontSize: RF(1.4),
        fontFamily: fonts.ARIAL,
        color: "red",
        textAlign: "center",
        width: "90%",
        alignSelf: "center",
        marginTop: hp(1)
    }
}) 
