import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import CommonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';

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
        flex: 1,
        fontSize: RF(2.0),
        fontFamily: fonts.PINGfANG_SBOLD,
        textAlign: 'center'
    },
    header: {
        height: SIZE(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCircle: {
        width: SIZE(57),
        height: SIZE(57),
        borderRadius: SIZE(57),
        marginHorizontal: SIZE(9),
        marginBottom: SIZE(8),
        overflow: 'hidden'
    },
    userText: {
        fontSize: RF(1.1),
        color: colors.BLACK1,
        textAlign: 'center',
        fontFamily: fonts.PINGfANG,
        marginBottom: SIZE(8),
        width: SIZE(57)
    },
    headerMenuContainer: {
        flex:0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerMenu: {
        ...CommonStyles.imageStyles(5),
        tintColor: Colors.black,
        marginHorizontal: wp("4%")
    }
})

export default styles;