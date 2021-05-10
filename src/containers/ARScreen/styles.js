import { StyleSheet } from 'react-native';

import { colors } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../../common/responsiveFunction';

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
        height: (wp('100%') / 3) - wp('1%'),
        marginVertical: wp("0.3"),
        marginHorizontal: wp("0.3"),
        width: (wp('100%') / 3) - wp('1%'),
    },
    listImage: {
        height: '100%',
        position: "absolute",
        top: 0,
        width: "100%"
    },
})

export default styles;