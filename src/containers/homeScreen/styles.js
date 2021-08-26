import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white
    },
    trendCont: {
        backgroundColor: colors.white,
        flex: 1
    },
    imageListCont: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    listItem: {
        height: (wp('100%') / 3) - wp('0.5%'),
        marginVertical: wp("0.3"),
        marginHorizontal: wp("0.3"),
        width: (wp('100%') / 3) - wp('0.5%'),
    },
    listImage: {
        height: '100%',
        position: "absolute",
        top: 0,
        width: "100%"
    },
    sorryMessageCont: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    sorryMessage: {
        fontSize: 15,
        fontFamily: fonts.SegoeUIRegular,
    },
    headerTitle: {
        fontSize: RF(2.0),
        fontFamily: fonts.PINGfANG_SBOLD,
    },
    header: {
        height: SIZE(50),
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCircle: {
        width: SIZE(57),
        height: SIZE(57),
        backgroundColor: colors.GREY1,
        borderRadius: SIZE(57),
        marginHorizontal: SIZE(9),
        marginBottom: SIZE(8),
    },
    userText: {
        fontSize: RF(1.1),
        color: colors.BLACK1,
        textAlign: 'center',
        fontFamily: fonts.PINGfANG,
        marginBottom: SIZE(8),
    }
})

export default styles;