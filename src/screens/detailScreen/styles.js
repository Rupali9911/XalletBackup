import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, SIZE, responsiveFontSize as RF } from "../../common/responsiveFunction";

const styles = StyleSheet.create({
    modalCont: {
        flex: 1,
        backgroundColor: colors.white
    },
    bgImageCont: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    bgImage: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: "cover"
    },
    header: {
        height: SIZE(50),
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row'
    },
    topHeaderText: {
        fontSize: RF(1.3),
        fontFamily: fonts.ARIAL,
        color: colors.GREY1
    },
    bottomHeaderText: {
        fontSize: RF(1.8),
        fontFamily: fonts.PINGfANG_SBOLD,
        color: colors.BLACK1
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
        // marginTop: hp('3%')
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
        color: colors.black,
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
        color: colors.black,
    },
    iconCont: {
        flexDirection: "row",
        marginTop: hp('0.5%'),
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
        color: colors.black,
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
        color: colors.black,
        marginVertical: hp('1.5%')
    },
    headerTextView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default styles;
