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
    artistLoader: {
        width: '100%',
        height: hp('10%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    artistLoader1: {
        top: hp('3%'),
        left: wp('2%'),
        width: '100%',
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
        alignItems: "center",
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
    headerList:{
        // margin: SIZE(10)
    },
    headerView: {
         padding: 2,
         paddingBottom: SIZE(10)
    },
    userCircle: {
        width: SIZE(105),
        height: SIZE(60),
        borderRadius: 3,
        overflow: 'hidden'
    },
    userText: {
        fontSize: RF(1.3),
        color: colors.BLACK1,
        textAlign: 'center',
        fontFamily: fonts.PINGfANG,
        top: 5
    },
    headerMenuContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerMenu: {
        ...CommonStyles.imageStyles(5),
        tintColor: Colors.black,
        marginHorizontal: wp("3%")
    },
    filterfab: {
        backgroundColor: Colors.black,
        alignSelf: 'baseline'
    },
    fabItemStyle: {
        backgroundColor: Colors.WHITE4,
    },
    fabItemStyle1: {
        backgroundColor: Colors.themeColor,
    },
    fabLabelStyle: {
        backgroundColor: Colors.WHITE4
    },
    fabLabelStyle1: {
        backgroundColor: Colors.themeColor,
    },
    collectionTab: {
        width: '100%',
        height: SIZE(40),
        borderColor: '#eee',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
    },
    collectionTabItem: {
        height: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: SIZE(1),
    },
    collectionTabItemLabel: {
        fontSize: SIZE(12),
        color: colors.GREY1,
    },
    tabbar: {
        elevation: 0,
        borderTopColor: '#EFEFEF',
        borderTopWidth: 1,
        shadowOpacity: 0,
        backgroundColor: 'white',
    },
    indicator: {
        borderBottomColor: colors.BLUE4,
        height: 1,
        marginBottom: SIZE(39),
        backgroundColor: colors.BLUE4
    },
    label: {
        fontSize: RF(1.4),
        fontFamily: 'Arial',
        textTransform: 'none',
    },
    tabStyle: {
        height: SIZE(40),
        width: wp('30%'),
        paddingHorizontal: wp('1%'),
        justifyContent: 'center',
    },
})

export default styles;
