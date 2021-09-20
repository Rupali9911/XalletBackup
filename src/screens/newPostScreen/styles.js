import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, SIZE, responsiveFontSize as RF } from "../../common/responsiveFunction";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.white
    },
    header: {
        height: SIZE(50),
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: colors.GREY2,
        borderBottomWidth: 0.8,
    },
    headerLeft: {
        position: 'absolute',
        top: 0,
        left: wp('4%'),
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerIcon: {
        height: wp('4%'),
        width: wp('4%')
    },
    headerText: {
        fontSize: RF(2.0),
        fontFamily: fonts.PINGfANG_SBOLD,
        color: colors.black
    },
    headerRight: {
        position: 'absolute',
        top: 0,
        right: wp('4%'),
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerRightText: {
        fontSize: RF(1.6),
        fontFamily: fonts.ARIAL_BOLD,
        color: colors.BLUE2
    },
    listItem: {
        borderBottomColor: colors.GREY2,
        borderBottomWidth: 0.8,
        padding: wp('4%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    betweenView: {
        paddingHorizontal: wp('4%'),
        paddingVertical: SIZE(7),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    captionView: {
        width: SIZE(60),
        height: SIZE(60),
        backgroundColor: colors.GREY2
    },
    rowWrap: {
        flexDirection: 'row'
    },
    captionTitle: {
        marginLeft: SIZE(10),
        height: SIZE(20),
        marginTop: SIZE(10),
        fontSize: RF(1.6)
    },
    itemText: {
        color: colors.black,
        fontSize: RF(1.6),
        fontFamily: fonts.SegoeUIRegular
    },
    advancedText: {
        color: '#c2c2c2',
        fontSize: RF(1.3),
        fontFamily: fonts.ARIAL
    }
})

export default styles;
