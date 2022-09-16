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
    rightLoading,
    leftStyle = {},
    rightStyle = {},
    leftTextStyle = {},
    rightTextStyle = {},
    style = {}
}) => {
    return (
        <View style={[styles.mainContainer, style]}>
            {leftHide ? null : <TouchableOpacity
                onPress={onLeftPress}
                style={[styles.leftButton,
                leftDisabled ? { opacity: 0.8 } : null, leftStyle, rightText && { marginRight: 5 }
                ]}
                disabled={leftDisabled}>
                {leftLoading
                    ? <ActivityIndicator color={colors.white} />
                    : <Text style={[styles.buttonText, leftTextStyle]}>
                        {leftText}
                    </Text>
                }
            </TouchableOpacity>}
            {rightHide ? null : <TouchableOpacity
                onPress={onRightPress}
                style={[styles.rightButton, rightStyle]}
                disabled={rightDisabled}>
                {rightLoading
                    ? <ActivityIndicator color={colors.white} />
                    : <Text style={[styles.buttonText, rightTextStyle]}>
                        {rightText}
                    </Text>
                }
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
        borderRadius: SIZE(3.5)
    },
    rightButton: {
        flex: 1,
        backgroundColor: colors.BLUE3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZE(3.5),
        marginLeft: 5
    },
    buttonText: {
        color: colors.white,
        fontSize: RF(1.8),
        fontFamily: fonts.ARIAL_BOLD
    }
};
