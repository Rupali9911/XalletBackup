import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
} from 'react-native';
import { colors, fonts } from '../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, SIZE, responsiveFontSize as RF } from "../common/responsiveFunction";

const groupButton = ({
    leftText,
    rightText,
    onLeftPress,
    onRightPress
}) => {
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity
                onPress={onLeftPress}
                style={styles.leftButton}>
                <Text style={styles.buttonText}>
                    {leftText}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onRightPress}
                style={styles.rightButton}>
                <Text style={styles.buttonText}>
                    {rightText}
                </Text>
            </TouchableOpacity>
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
        fontSize: RF(1.4),
        fontFamily: fonts.ARIAL_BOLD
    }
};