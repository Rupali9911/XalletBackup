import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, screenHeight, screenWidth } from "../../common/responsiveFunction";

const styles = StyleSheet.create({
    modalCont: {
        flex: 1,
        backgroundColor: colors.white
    },
    bgImageCont: {
        position: 'absolute',
        top: 0,
        height: screenHeight,
        width: screenWidth
    },
    bgImage: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover"
    },
    header: {
        height: hp('6%'),
        width: '100%',
    },
    backIcon: {
        width: wp('10%'),
        height: "100%",
        paddingLeft: wp('3%'),
        justifyContent: 'center',
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%')
    },
    modalImage: {
        width: wp('100%'),
        height: wp('100%'),
        resizeMode: "cover",
        marginTop: hp('3%')
    },
    bottomModal: {
        width: '85%',
        alignSelf: "center",
        paddingVertical: hp('3%')
    },
    modalLabelCont: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalLabel: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: fonts.SegoeUIBold
    },
    heartIcon: {
        height: wp('7%'),
        width: wp('7%'),
        resizeMode: "contain"
    },
    modalSectCont: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: hp('1%')
    },
    modalIconLabel: {
        fontSize: 11,
        fontFamily: fonts.SegoeUIRegular,
        color: colors.white,
    },
    iconCont: {
        flexDirection: "row",
        marginTop: hp('1%'),
        marginBottom: hp('0.5%'),
        alignItems: "center"
    },
    iconsImage: {
        height: wp('6%'),
        width: wp('6%'),
        borderRadius: wp('6%') / 2
    },
    profileIcon: {
        height: wp('5%'),
        width: wp('5%'),
        borderRadius: wp('5%') / 2
    },
    iconLabel: {
        fontSize: 15,
        fontFamily: fonts.SegoeUIBold,
        fontWeight: "bold",
        color: colors.white,
        marginLeft: wp('1.5%')
    },
    separator: {
        width: '100%',
        height: 0.5,
        backgroundColor: colors.white
    },
    modalBtn: {
        width: '100%',
        height: hp('5%'),
        marginVertical: hp('2%'),
        borderRadius: wp('3%'),
        justifyContent: "center",
        alignItems: "center"
    },
    description: {
        fontSize: 10,
        fontFamily: fonts.SegoeUIRegular,
        color: colors.white,
        marginVertical: hp('1.5%')
    }
})

export default styles;