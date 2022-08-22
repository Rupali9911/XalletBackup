import { Platform, StyleSheet } from 'react-native';
import {
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp
} from '../../common/responsiveFunction';
import { hp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { colors, fonts } from '../../res';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
    flexDirection: 'row',
  },
  headerIcon: {
    height: wp('4%'),
    width: wp('4%'),
  },
  headerText: {
    fontSize: SIZE(16),
    lineHeight: Platform.OS === 'android' ? SIZE(19) : null,
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.black,
  },
  headerRight: {
    position: 'absolute',
    top: 0,
    right: wp('4%'),
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerRightText: {
    fontSize: RF(1.6),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.BLUE2,
  },
  scanText: {
    color: colors.black,
    fontSize: RF(2.8),
    fontFamily: fonts.ARIAL,
  },
  mainContent: {
    paddingTop: wp('30%'),
    alignItems: 'center',
  },
  scanImage: {
    width: wp('100%'),
    marginTop: wp('4%'),
  },
  objectText: {
    fontSize: RF(2.0),
    fontFamily: fonts.ARIAL,
    color: colors.BLACK3,
  },
  modalImage: {
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'contain',
    backgroundColor: colors.BLACK1,
  },
  nftTitle: {
    fontSize: RF(1.5),
    fontFamily: fonts.ARIAL_BOLD,
    marginTop: SIZE(15),
    width: wp('100%'),
    paddingHorizontal: SIZE(12),
    color: colors.PINK1,
    textTransform: 'uppercase',
  },
  nftName: {
    fontSize: RF(2.75),
    fontFamily: fonts.ARIAL_BOLD,
    marginBottom: SIZE(15),
    paddingHorizontal: SIZE(12),
    textTransform: 'uppercase',
  },
  listItem: {
    height: wp('87.5%') / 3 - wp('0.5%'),
    margin: wp('0.4'),
    width: wp('87.5%') / 3 - wp('0.5%'),
  },
  listImage: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  button: {
    width: '47.5%',
    ...CommonStyles.button,
    marginVertical: hp('2%'),
  },
  person: {
    flexDirection: 'row',
    paddingHorizontal: SIZE(5),
    borderTopWidth: SIZE(4),
    borderBottomWidth: SIZE(4),
    borderBottomColor: '#ffffff',
    borderTopColor: '#ffffff',
    paddingVertical: SIZE(13),
    justifyContent: 'space-between',
  },
  personType: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZE(7),
  },
  iconsImage: {
    width: SIZE(30),
    height: SIZE(30),
    borderRadius: SIZE(30),
    marginRight: SIZE(10),
    borderColor: '#979797',
    borderWidth: 1,
  },
  creatorImage: {
    width: SIZE(40),
    height: SIZE(40),
    borderRadius: SIZE(40),
    marginRight: SIZE(15),
    borderColor: '#979797',
    borderWidth: 1,
  },
  personTypeText: {
    fontSize: RF(1.3),
    fontFamily: fonts.ARIAL,
    color: colors.GREY1,
    lineHeight: SIZE(12.89),
  },
  personName: {
    fontSize: RF(1.4),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.black,
    lineHeight: SIZE(14.06),
    maxWidth: SIZE(70),
  },
  collectionName: {
    fontSize: RF(1.4),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.black,
    lineHeight: SIZE(14.06),
    maxWidth: SIZE(53),
    marginRight: 5
  },
  verifyIcon: {
    width: SIZE(15),
    height: SIZE(15),
    borderRadius: SIZE(10)
  },
  creatorName: {
    fontSize: RF(2),
    fontFamily: fonts.ARIAL,
    color: colors.themeR,
    // lineHeight: SIZE(14.06),
    maxWidth: SIZE(130),
    height: SIZE(20),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  description: {
    fontSize: RF(1.4),
    fontFamily: fonts.PINGfANG,
    color: colors.GREY1,
    marginTop: SIZE(30),
    marginBottom: SIZE(20),
    paddingHorizontal: SIZE(12),
  },
  payIn: {
    fontSize: RF(1.6),
    fontFamily: fonts.ARIAL,
    textAlign: "center",
    color: "#707a83",
    marginTop: 0,
    paddingHorizontal: 0,
    marginBottom: 0,
    fontWeight: "bold"
  },
  moreView: {
    marginTop: SIZE(13),
    borderTopColor: '#F9FAF9',
    borderTopWidth: SIZE(4),
  },
  moreTitle: {
    fontSize: RF(1.6),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.black,
    padding: SIZE(15),
  },
  moreItem: {
    width: wp('49.5%'),
    height: wp('49.5%'),
    backgroundColor: colors.GREY2,
    marginBottom: wp('1%'),
  },
  bottomView: {
    alignItems: 'stretch',
    paddingHorizontal: SIZE(14),
    marginBottom: SIZE(10),
  },
  count: {
    fontSize: RF(1.4),
    fontFamily: fonts.ARIAL,
    color: '#717171',
    textAlign: 'right',
  },
  priceUnit: {
    fontSize: RF(2.3),
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.GREY4,
    marginLeft: wp(2),
  },
  dollarText: {
    fontSize: RF(1.7)
  },
  price: {
    fontSize: RF(3.1),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.BLACK1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: SIZE(12),
    marginBottom: SIZE(10),
    marginTop: SIZE(20),
  },
  tokenPicker: {
    borderColor: colors.themeR,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderColor: colors.themeR,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  rowText: {
    color: colors.black,
    fontSize: RF(1.65),
    maxWidth: wp('35%'),
  },
  rowTextcontractaddress: {
    color: colors.black,
    fontSize: RF(1.65),
    maxWidth: wp('40%'),
  },

  containerChildStyles: {
    paddingHorizontal: 0,
    borderRadius: 10,
    paddingVertical: 0,
    marginTop: hp(1)
  },

  head: { height: SIZE(40) },
  text: { margin: SIZE(10), fontSize: SIZE(12) },
  emptyData: {
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  likeButton: {
    position: 'absolute',
    zIndex: 1,
    top: SIZE(10),
    right: SIZE(10)
  },
  videoPlayIconChild: {
    width: SIZE(100),
    height: SIZE(100),
    backgroundColor: '#00000030',
    borderRadius: SIZE(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayIconCont: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  retry: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  bidTimeContainer: {
    padding: SIZE(10),
    borderWidth: SIZE(1),
    borderColor: '#eeeeee',
    borderRadius: SIZE(4),
    marginHorizontal: SIZE(15),
    marginBottom: SIZE(10),
  },
  bidTitleView: { flexDirection: 'row' },
  bidTitleTxt: { fontSize: SIZE(14) },
  bidTimeTxt: { fontSize: SIZE(16), fontWeight: 'bold' },
  highestBidTxt: {
    fontSize: SIZE(13),
    top: SIZE(5)
  },
  socialLinksWrap: {
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
});

export default styles;
