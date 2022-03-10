import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { colors, fonts } from '../res';
import { SIZE, responsiveFontSize as RF } from "../common/responsiveFunction";

const groupButton = ({
    leftText,
    rightText,
    onLeftPress,
    onRightPress,
    leftDisabled,
    rightDisabled,
    leftHide,
    rightHide,
    leftLoading,
    rightLoading
}) => {
    return (
        <View style={styles.mainContainer}>
            {leftHide ? null : <TouchableOpacity
                onPress={onLeftPress}
                style={styles.leftButton}
                disabled={leftDisabled}>
                {leftLoading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>
                    {leftText}
                </Text>}
            </TouchableOpacity>}
            {rightHide ? null : <TouchableOpacity
                onPress={onRightPress}
                style={styles.rightButton}
                disabled={rightDisabled}>
                <Text style={styles.buttonText}>
                    {rightText}
                </Text>
            </TouchableOpacity>}
        </View>
    )
}

export default groupButton;

const styles = {
    mainContainer: {
        width: '100%',
        height: SIZE(39),
        borderRadius: SIZE(3.5),
        flexDirection: 'row',
        overflow: 'hidden'
    },
    leftButton: {
        flex: 1,
        backgroundColor: colors.BLUE4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightButton: {
        flex: 1,
        backgroundColor: colors.BLUE3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white,
        fontSize: RF(1.6),
        fontFamily: fonts.ARIAL_BOLD
    }
};