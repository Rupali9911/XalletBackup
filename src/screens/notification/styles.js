import { StyleSheet } from 'react-native';

import { fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({

    listLabel: {
        fontFamily: fonts.ARIAL,
        fontSize: RF(1.9),
        color: Colors.blackShadeOne,
    },
    centerProfileCont: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp("5%"),
    },
    section2: {
        backgroundColor: Colors.white,
        marginTop: hp('5%')
    },

})

export default styles;