import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white
    },
    trendCont: {
        backgroundColor: colors.white,
        paddingVertical: hp('1%'),
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
    }
})

export default styles;