import { StyleSheet } from 'react-native';

import { colors, fonts } from '../../res';
import { heightPercentageToDP as hp, widthPercentageToDP as wp, responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import CommonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import {COLORS} from "../../constants";

const styles = StyleSheet.create({
    container: {

        backgroundColor: colors.white,

    },
    trendCont: {
        backgroundColor: colors.WHITE1,
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
    headerView:{
        maxWidth: wp('20%')
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
        margin: 2
    },
    headerMenuContainer: {
        flex:1,
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
        backgroundColor: Colors.WHITE1
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

    collectionListItem: {
        marginVertical: wp("2"),
        marginHorizontal: wp("1"),
        width: (wp('100%') / 2) - wp('2%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        borderRadius:wp("5"),
        elevation: 5,
    },
    nftListItem: {
        marginVertical: wp("2"),
        marginHorizontal: wp("1"),
        width: (wp('100%') / 3) - wp('3%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,

        elevation: 5,
    },
    listItemContainer: {

        width: "100%",
        borderRadius: SIZE(20),
        overflow: 'hidden',

    },
    collectionListImage: {
        width: '100%',
        height: (wp('100%') / 3) - wp('1%'),
        resizeMode: 'stretch',

        backgroundColor:Colors.WHITE1,

        borderTopRightRadius: SIZE(12),
        borderTopLeftRadius: SIZE(12),
    },
    collectionListVideo: {
        width: '100%',
        height: (wp('100%') / 3) - wp('1%'),
        borderTopRightRadius: SIZE(12),
        borderTopLeftRadius: SIZE(12),
    },
    iconImage: {
        width: SIZE(46),
        height: SIZE(46),
        borderRadius: SIZE(23),
        marginTop: SIZE(-33),
        backgroundColor: '#d8d8d8',
    },
    collectionWrapper: {
        padding: SIZE(10),
        backgroundColor: 'white',
        borderBottomRightRadius: SIZE(12),
        borderBottomLeftRadius: SIZE(12),
        height: (wp('100%') / 3) - wp('1%'),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomWrap: {
        //flexDirection: 'row',
        marginTop:'1%',
        height:"35%",
        //backgroundColor:'red',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    chainitem:{

        backgroundColor:Colors.WHITE1

    },
    renderchainstyle:{
        flexDirection:'row',
        width:"50%",
         justifyContent:'center',

    },
    chaintypeflatlist:{
        width:"100%",
       justifyContent:"center",
        alignItems:'center'
    },
    bottomCenterWrap: {

        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    byUser: {
        color: '#4b5fff',
        fontSize: SIZE(12),
        marginBottom: SIZE(25),
    },
    collectionName: {
        color: '#23262f',
        fontSize: SIZE(14),
        marginBottom: SIZE(6),

    },
    soldOutText:{
        color: COLORS.greenLight,
        fontSize: SIZE(12),
        marginVertical: SIZE(10),
    },
})

export default styles;
