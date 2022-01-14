import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../../res';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
    responsiveFontSize as RF,
} from '../../../common/responsiveFunction';

const styles = StyleSheet.create({
    bottomLogin: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        marginVertical: hp(4)
    },
    sectionCont: {
        width: wp(85),
        alignSelf: "center",
        paddingVertical: hp(2)
    },
    loginBTxt: {
        fontSize: RF(1.6),
        fontFamily: fonts.ARIAL,
        color: colors.tabbar
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

export default styles;