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


    itemCont: {
        flexDirection: "row",
        paddingVertical: hp('1%'),
        alignItems: "center",
    },

    label: {
        fontSize: RF(2.5),
        textAlign: "center",
        marginTop: hp('15%')
    },
    listSubLabel: {
        fontFamily: fonts.ARIAL,
        fontSize: RF(1.4),
        color: Colors.blackShadeOne,
    },

})

export default styles;