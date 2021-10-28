import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
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
    iconCont: {
        backgroundColor: Colors.GREY2,
        height: wp("10%"),
        width: wp("10%"),
        borderRadius: wp('2%'),
        justifyContent: "center",
        alignItems: "center",
        marginLeft: wp('5%')
    },
    itemCont: {
        flexDirection: "row",
        paddingVertical: hp('1%'),
        alignItems: "center",
    },
    keypadItem: {
        width: wp("33%"),
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: hp("2%"),
        marginVertical: '1%'
    },
    keypadFont: {
        fontSize: RF(2),
        fontWeight: "bold",
        color: "#000",
        textAlign: "center"
    },
    keypadCont: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        paddingTop: hp("5%"),
    },
    circle: {
        width: wp("5%"),
        height: wp("5%"),
        borderRadius: wp("10%") / 2,
        marginHorizontal: wp("2%"),
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.themeR
    },
    circleCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        flexDirection: "row",
        paddingBottom: hp('5%')
    },
    sep: {
        width: wp("70%"),
        height: 1,
        alignSelf: "center",
        backgroundColor: "#eee"
    },
    label: {
        fontSize: RF(2.2),
        textAlign: "center",
        marginTop: hp('15%')
    },
    listSubLabel: {
        fontFamily: fonts.ARIAL,
        fontSize: RF(1.6),
        color: Colors.blackShadeOne,
    }
})

export default styles;