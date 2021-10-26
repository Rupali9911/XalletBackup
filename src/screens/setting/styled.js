import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
    centerProfileCont: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp("5%"),
    },
    backIcon: {
        flex: 0.4,
        paddingLeft: wp('3%'),
        justifyContent: 'center',
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%'),
        resizeMode: "contain"
    },
    header: {
        height: SIZE(50),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        width: "100%"
    },
    headerTitle: {
        fontSize: RF(2),
        height: SIZE(30),
        textAlignVertical: "center",
        textAlign: "center",
        fontFamily: fonts.PINGfANG_SBOLD
    },
    headerChild: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    separator: {
        backgroundColor: Colors.separatorThird,
        height: 1,
        alignSelf: "flex-end"
    },
    listLabel: {
        fontFamily: fonts.ARIAL,
        fontSize: RF(1.9),
        color: Colors.blackShadeOne,
    },
    section2: {
        backgroundColor: Colors.white,
        marginTop: hp('5%')
    },
    iconCont: {
        backgroundColor: Colors.GREY2,
        height: wp("10%"),
        width: wp("10%"),
        borderRadius: wp('2%'),
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp('5%')
    },
    icon: {
        width: wp('6%'),
        height: wp("6%"),
        resizeMode: "contain"
    },
    itemCont: {
        flexDirection: "row",
        paddingVertical: hp('1%'),
        alignItems: "center",
    },
    modalCont: {
        width: "100%",
        backgroundColor: Colors.white,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('3%')
    },
    modalTitle: {
        fontFamily: Fonts.ARIAL_BOLD,
        fontSize: RF(2.5),
        color: Colors.blackShadeOne,
        textAlign: "center"
    }
})

export default styles;