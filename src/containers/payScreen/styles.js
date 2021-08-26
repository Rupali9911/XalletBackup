import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, SIZE, responsiveFontSize as RF } from "../../common/responsiveFunction";

const styles = StyleSheet.create({
    header: {
        height: SIZE(50),
        justifyContent: 'center',
        alignItems: 'center',
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
        color: colors.white
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
    cardContainer: {
        backgroundColor: colors.white,
        width: '90%',
        paddingVertical: SIZE(20),
        alignSelf: 'center',
        marginTop: SIZE(50),
        borderRadius: SIZE(5)
    },
    profileImage: {
        height: SIZE(80),
        width: SIZE(80),
        borderRadius: SIZE(40),
        overflow: 'hidden',
        alignSelf: 'center',
        top: -SIZE(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.white,
        borderWidth: SIZE(3),
        position: 'absolute',
        backgroundColor: colors.GREY2
    },
    cardTitle: {
        fontSize: RF(2.1),
        color: colors.BLACK4,
        textAlign: 'center',
        marginTop: SIZE(30),
        fontFamily: fonts.PINGfANG_SBOLD
    },
    cardData: {
        fontSize: RF(1.7),
        color: colors.GREY6,
        textAlign: 'center',
        marginTop: SIZE(15)
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZE(37)
    },
    price: {
        fontSize: RF(2.7),
        color: colors.black,
        fontFamily: fonts.ARIAL_BOLD,
        textAlign: 'center'
    },
    successButton: {
        backgroundColor: colors.SUCCESSBUTTON,
        width: SIZE(200),
        height: SIZE(50),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SIZE(30),
        marginTop: SIZE(82)
    },
    buttonText: {
        fontSize: RF(1.7),
        color: colors.white,
        fontFamily: fonts.PINGfANG_SBOLD
    }
})

export default styles;
