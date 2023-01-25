import {Platform, StyleSheet} from 'react-native';
import {
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {COLORS} from '../../constants';
import Colors from '../../constants/Colors';
import {hp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {colors, fonts} from '../../res';

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
    position: 'relative',
    width: wp('100%'),
    height: wp('100%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoError: {
    color: Colors.WHITE1,
    fontSize: SIZE(20),
    fontWeight: 'bold',
  },
  nftTitle: {
    fontSize: RF(1.75),
    fontFamily: fonts.ARIAL_BOLD,
    marginTop: SIZE(15),
    width: wp('100%'),
    paddingHorizontal: SIZE(12),
    color: colors.PINK1,
  },
  nftName: {
    fontSize: RF(2.65),
    fontFamily: fonts.ARIAL_BOLD,
    marginBottom: SIZE(8),
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
    position: 'relative',
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
  },
  creatorImage: {
    width: SIZE(40),
    height: SIZE(40),
    borderRadius: SIZE(40),
    marginRight: SIZE(15),
  },
  userImage: {
    width: SIZE(40),
    height: SIZE(40),
    borderRadius: SIZE(40),
    // marginLeft: SIZE(28),
    // marginTop:SIZE(15),
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
    color: colors.themeR,
    lineHeight: SIZE(14.06),
    maxWidth: SIZE(70),
  },
  collectionName: {
    fontSize: RF(1.4),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.themeR,
    lineHeight: SIZE(14.06),
    maxWidth: SIZE(53),
    marginRight: 5,
  },
  verifyIcon: {
    width: SIZE(15),
    height: SIZE(15),
    borderRadius: SIZE(10),
  },
  creatorName: {
    fontSize: RF(2),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.themeR,
    // lineHeight: SIZE(14.06),
    maxWidth: SIZE(130),
    height: SIZE(20),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  description: {
    // fontSize: RF(1.4),
    fontFamily: fonts.ARIAL,
    // color: colors.black,
    // marginTop: SIZE(5),
    marginBottom: SIZE(15),
    paddingHorizontal: SIZE(15),
  },
  payIn: {
    fontSize: RF(1.6),
    fontFamily: fonts.ARIAL,
    textAlign: 'center',
    color: '#707a83',
    marginTop: 0,
    paddingHorizontal: 0,
    marginBottom: 0,
    fontWeight: 'bold',
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
    fontSize: RF(3.1),
    fontFamily: fonts.ARIAL_BOLD,
    color: colors.GREY4,
    marginLeft: wp(2),
  },
  dollarText: {
    fontSize: RF(1.8),
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
    marginTop: SIZE(5),
    // maxWidth: wp('55%'),
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
    marginTop: hp(1),
  },

  head: {height: SIZE(40)},
  // text: {
  //   margin: SIZE(10),
  //   fontSize: SIZE(12),
  //   backgroundColor: 'red',
  // },
  themeColor: {color: Colors.themeColor},
  emptyData: history => ({
    // alignSelf: 'center',
    // marginVertical: hp('1%'),
    height: history === 'trading' ? hp(12) : hp(8),
    alignItems: 'center',
  }),
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
    right: SIZE(10),
  },
  videoPlayIconChild: {
    width: SIZE(100),
    height: SIZE(100),
    backgroundColor: '#00000030',
    borderRadius: SIZE(100),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  videoPlayIconCont: {
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    // flex: 1,
    // width: wp('100%'),
    // height: wp('100%'),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  retry: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bidTimeContainer: {
    padding: SIZE(10),
    borderWidth: SIZE(1),
    borderColor: '#eeeeee',
    borderRadius: SIZE(4),
    marginHorizontal: SIZE(15),
    marginBottom: SIZE(10),
  },
  bidTitleView: {flexDirection: 'row'},
  bidTitleTxt: {fontSize: SIZE(14)},
  bidTimeTxt: {fontSize: SIZE(16), fontWeight: 'bold'},
  highestBidTxt: {
    fontSize: SIZE(13),
    top: SIZE(5),
  },
  socialLinksWrap: {
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 2,
  },
  networkIcon: {
    height: 26,
    width: 26,
    borderRadius: 13,
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  buybutton: {
    flexDirection: 'row',
    paddingTop: SIZE(10),
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 10,
  },
  countDownDigit: {
    borderWidth: 1,
    height: hp(5),
    backgroundColor: Colors.white,
    borderColor: Colors.themeColor,
  },
  countDownText: {color: Colors.black},
  cellBorderStyle: {
    borderWidth: 1,
    borderColor: Colors.GREY9,
  },
  labelText: {
    fontSize: RF(1.7),
    paddingBottom: 8,
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.GREY4,
  },
  priceView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2),
  },
  tokenIcon: {
    width: SIZE(33),
    height: SIZE(33),
    borderRadius: SIZE(60 / 2),
    marginRight: SIZE(7),
  },
  rightButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.white,
  },
  rightButtonText: {
    color: Colors.BLUE3,
  },
  viewAllBtn: {
    marginVertical: SIZE(12),
    width: wp(40),
    alignSelf: 'center',
  },
  viewAllBtnInner: {
    backgroundColor: 'transparent',
    borderColor: Colors.BLUE4,
    borderWidth: 2,
  },
  menuOption: {
    height: SIZE(35),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
  speedMenuOption: {
    height: SIZE(35),
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicPlayer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    height: SIZE(50),
    backgroundColor: '#f1f1f1',
    borderRadius: SIZE(80),
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: SIZE(10),
  },
  activity: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    width: SIZE(80),
    height: SIZE(80),
    borderRadius: SIZE(80),
    backgroundColor: Colors.BLACK4,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoFullScreen: {
    position: 'absolute',
    top: wp('6.2%'),
    left: wp('6%'),
  },
  timeView: {
    width: SIZE(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlView: {
    width: SIZE(40),
    height: SIZE(40),
    borderRadius: SIZE(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionView: {
    width: SIZE(40),
    height: SIZE(40),
    borderRadius: SIZE(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    width: SIZE(30),
    height: SIZE(30),
  },
  modalImg: {
    width: wp('100%'),
    minHeight: wp('100%'),
    resizeMode: 'contain',
  },
  mainview: {
    backgroundColor: Colors.WHITE1,
    // height: hp(65),
    paddingVertical: SIZE(20),
    width: wp(95),
    right: SIZE(10),
    borderRadius: SIZE(10),
    justifyContent: 'center',
    paddingHorizontal: SIZE(22),
  },
  headerview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: SIZE(22),
    alignItems: 'center',
  },
  bidtext: {
    fontWeight: 'bold',
    fontSize: SIZE(20),
  },
  userView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: 22,
    marginTop: 10,
  },
  headerCancelButton: {tintColor: Colors.GREY1},
  feeText: {
    paddingTop: SIZE(30),
    // paddingLeft: SIZE(20),
    fontWeight: 'bold',
  },
  footerText: {
    color: Colors.GREY1,
    fontWeight: '300',
  },
  feeErrorView: {
    paddingVertical: SIZE(23),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.DANGER,
    fontWeight: 'bold',
  },
  errorText1: {
    marginTop: SIZE(10),
    color: Colors.DANGER,
    fontWeight: 'bold',
  },
  checkboxImg: {tintColor: Colors.GREY1},
  royaltyFeeView: {
    flexDirection: 'row',
    marginTop: 18,
    // marginHorizontal: 22,
    justifyContent: 'space-between',
  },
  nftPrice: {
    color: Colors.BLUE2,
    fontWeight: 'bold',
  },
  termsText: {
    color: Colors.BLUE2,
    fontWeight: 'bold',
  },
  checkBoxView: {
    flexDirection: 'row',
    marginTop: 18,
    // marginHorizontal: 22,
    justifyContent: 'space-between',
  },
  willPayView: {
    flexDirection: 'row',
    marginTop: 18,
    // marginHorizontal: 22,
    justifyContent: 'space-between',
  },
  breakLine: {
    // marginHorizontal: 22,
    height: 0.7,
    backgroundColor: Colors.GREY1,
    marginTop: 15,
  },
  priceInPercent: {
    color: Colors.BLUE2,
    fontWeight: 'bold',
  },
  serviceFeeView: {
    flexDirection: 'row',
    marginTop: 18,
    // marginHorizontal: 22,
    justifyContent: 'space-between',
  },
  itemText: {
    paddingTop: SIZE(30),
    // paddingLeft: SIZE(20),
    fontWeight: 'bold',
  },
  amountText: {
    fontWeight: 'bold',
    paddingLeft: SIZE(10),
  },
  modalBody: {flex: 1},
  checkBoxLabel: {
    marginRight: 0,
    color: Colors.BLACK1,
  },
  groupButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: SIZE(10),
    marginVertical: SIZE(25),
  },
  rightGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE2,
    backgroundColor: Colors.white,
  },
  rightDeleteDisabled: {
    borderWidth: 1,
    borderColor: Colors.REDLIGHT,
    backgroundColor: Colors.REDLIGHT,
  },
  rightGroupButtonText: {
    color: Colors.BLUE3,
  },
  rightDeleteGroupButtonText: {
    color: Colors.WHITE1,
  },
  expirationText: {
    marginTop: SIZE(15),
    // marginLeft: 22,
    color: '#151e3d',
  },
  dateText: {
    padding: SIZE(8),
  },
  numberView: {
    // marginHorizontal: SIZE(20),
    marginTop: SIZE(10),
    borderColor: Colors.GREY1,
    borderWidth: 1,
    borderRadius: 4,
    // height: hp(4),
  },
  curancyInput: {
    // backgroundColor: Colors.WHITE1,
    // borderWidth: 1,
    // borderColor: Colors.GREY1,
    // height: hp(4.1),
    // width: wp(30),
    // borderBottomLeftRadius: 8,
    // borderTopLeftRadius: 8,
    // borderRightWidth: 0
    paddingLeft: 10,
  },
  curancyInputPrice: {
    // backgroundColor: Colors.WHITE1,
    // borderWidth: 1,
    // borderColor: Colors.GREY1,
    // height: hp(4.3),
    // marginTop:0.5,
    // width: wp(30),
    // borderBottomLeftRadius: 8,
    // borderTopLeftRadius: 8,
    // borderRightWidth: 0,
    paddingHorizontal: SIZE(10),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  curancyInputChange: {
    // backgroundColor: Colors.WHITE1,
    // // borderWidth: 1,
    // borderColor: Colors.GREY1,
    // height: hp(4.4),
    // width: wp(15),
    // borderBottomLeftRadius: 8,
    // borderTopLeftRadius: 8,
    flex: 1 / 2,
  },
  busdText: {
    borderWidth: 1,
    borderColor: Colors.GREY1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    right: SIZE(2),
  },
  busdTextView: {
    borderWidth: 1,
    borderColor: Colors.GREY1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    right: SIZE(2),
    borderLeftWidth: 0,
  },
  imageTextView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.GREY1,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    height: hp(5),
  },
  currencyView: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: wp(20),
    height: hp(5),
    justifyContent: 'center',
    flex: 1 / 2,
    borderLeftWidth: 1,
    borderColor: Colors.GREY1,
  },
  priceBoxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZE(25),
    marginBottom: SIZE(30),
  },
  modalContainer: {
    flex: 1,
  },
  reClaimcontainer: {
    backgroundColor: Colors.white,
    // height: hp(42),
    width: wp(95),
    paddingHorizontal: SIZE(20),
    paddingTop: SIZE(15),
    borderRadius: SIZE(18),
    right: SIZE(8),
  },
  deleteAccount: {
    // height: Platform.OS === 'ios' ? hp(57) : hp(62),
  },
  backupPhraseContainer: {
    // height: Platform.OS === 'ios' ? hp(65) : hp(70),
  },
  reClaimCancelBTNview: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reClaimCancelButton: {
    tintColor: Colors.GREY1,
  },
  centerImg: {
    height: hp(17),
    alignSelf: 'center',
  },
  deleteRedImg: {
    alignSelf: 'center',
  },
  dangerIconStyle:{
    height: hp(8),
    width: hp(8.8)
  },
  reclaimView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SIZE(15),
  },
  deleteAccountView: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: SIZE(35),
  },
  reclaimText: {
    fontWeight: 'bold',
    fontSize: SIZE(25),
  },
  deleteAccountText: {
    // fontWeight: 'bold',
    fontSize: SIZE(25),
    textAlign: 'center'
  },
  textView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZE(10),
  },
  text: {
    color: Colors.GREY1,
    margin: SIZE(10),
    fontSize: SIZE(12),
  },
  descriptionCenter: {
    textAlign: 'center',
    lineHeight: 16,
    color: Colors.BLACK1,
  },
  descriptionJustify:{
    textAlign: 'justify',
    lineHeight: 16,
    color: Colors.BLACK1,
  },
  tokenName: {
    fontWeight: 'bold',
  },
  makkeOfferGroupButtonView: {
    marginTop: SIZE(25),
    // paddingHorizontal: SIZE(20),
  },
  reClaimRightGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.BLUE4,
  },
  reClaimrightGroupButtonText: {
    color: Colors.white,
  },
  rightGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.white,
  },
  rightGroupButtonText: {
    color: Colors.BLUE3,
  },
  modalContainer: {
    flex: 1,
  },
  editPriceContainner: {
    backgroundColor: Colors.WHITE1,
    height: hp(27),
    width: wp(95),
    paddingTop: SIZE(15),
    borderRadius: SIZE(18),
    right: SIZE(8),
  },
  editPriceHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZE(25),
  },
  editPriceText: {
    fontWeight: 'bold',
    fontSize: SIZE(18),
  },
  cancelButton: {
    tintColor: Colors.GREY1,
  },
  inputWrapperView: {
    // flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    // paddingHorizontal: SIZE(39),
    margin: SIZE(35),
    marginTop: SIZE(0),
    // backgroundColor: 'red',
  },
  inputWrapperView1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  inputFieldView: {
    alignItems: 'center',
  },
  inputField: {
    backgroundColor: Colors.WHITE1,
    borderWidth: 1,
    borderColor: Colors.GREY1,
    height: hp(5.2),
    width: wp(60),
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    paddingLeft: SIZE(10),
  },
  tokenView: {
    borderWidth: 0.5,
    height: hp(5.2),
    width: wp(15),
    borderLeftWidth: 0,
    borderColor: Colors.GREY1,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenText: {
    // fontWeight: "bold"
  },
  editPriceGroupBButtonView: {
    // bottom: SIZE(10),
    // paddingHorizontal: SIZE(35),
  },
  editPriceGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.BLUE1,
  },
  editPriceGroupButtonText: {
    fontWeight: 'bold',
  },

  //===========>
  placeAbbidView: {
    backgroundColor: Colors.WHITE1,
    borderRadius: SIZE(10),
    justifyContent: 'center',
    paddingBottom: SIZE(20),
    paddingHorizontal: SIZE(35),
  },
  PlaceAbidHeaderview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZE(12),
    // paddingHorizontal: SIZE(35)
  },
  bidtext: {
    fontWeight: 'bold',
    fontSize: SIZE(20),
  },
  priceText: {
    paddingTop: SIZE(30),
    // paddingLeft: SIZE(35),
    fontWeight: 'bold',
  },
  placeAbidgroupButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    // paddingHorizontal: SIZE(35)
  },
  rightGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.white,
  },
  rightGroupButtonText: {
    color: Colors.BLUE3,
  },
  numberText: {
    padding: SIZE(10),
  },
  placeAbidNumberView: {
    width: wp(61),
    borderColor: Colors.GREY1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderRightWidth: 0,
  },
  busdView: {
    borderWidth: 1,
    borderColor: Colors.GREY1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    right: SIZE(3),
  },
  priceBoxView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZE(25),
    marginBottom: SIZE(30),
  },
  cancelimg: {
    tintColor: Colors.GREY1,
    marginTop: SIZE(5),
  },
  priceNFT: {
    padding: SIZE(10),
    fontWeight: 'bold',
  },

  //=========Sell NFT Modal
  sellModalView: {
    backgroundColor: Colors.WHITE1,
    // height: hp(43),
    width: wp(90),
    paddingTop: SIZE(10),
    borderRadius: SIZE(10),

    paddingHorizontal: SIZE(20),
    // backgroundColor:'red'
  },
  sellModalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: SIZE(20),
  },
  sellNftText: {
    fontWeight: 'bold',
    fontSize: SIZE(20),
  },
  saleTypeText: {
    paddingVertical: SIZE(20),
    paddingHorizontal: SIZE(8),
    fontWeight: 'bold',
  },
  sellRightGroupButtonText: {
    color: Colors.BLUE4,
    fontWeight: '100',
  },
  sellRightGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE4,
    backgroundColor: Colors.white,
  },
  sellInputFieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.GREY1,
    width: wp(75),
    // marginHorizontal: SIZE(28),
    borderRadius: 5,
  },
  sellGroupBButtonView: {
    paddingHorizontal: SIZE(8),
    paddingVertical: SIZE(45),
  },
  sellTokenPicker: {
    minHeight: 46,
    width: wp(30),
    borderColor: Colors.GREY1,
    borderWidth: 1,
    borderRadius: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginRight: 5,
  },
  auctionModalView: {
    backgroundColor: Colors.WHITE1,
    height: hp(57),
    width: wp(90),
    paddingVertical: SIZE(10),
    borderRadius: SIZE(10),
  },
  opneTimeView: {
    flexDirection: 'row',
    // width: "100%"
    // paddingHorizontal: SIZE(27),
  },
  openTimeText: {
    // flex: 0.5,
    color: '#3e4676',
    // paddingLeft: SIZE(28),
    paddingBottom: SIZE(10),
  },
  closeTimeText: {
    // flex: 0.5,
    color: '#3e4676',
    // paddingRight: SIZE(15),
  },
  dateFieldView: {
    flexDirection: 'row',
    // width: "100%",
    paddingHorizontal: SIZE(27),
  },
  openTimeField: {
    // flex: 0.5,
    borderWidth: 1,
    width: wp(36.5),
    height: hp(5),
    // margin: SIZE(10) ,
    borderRadius: 5,
    borderColor: Colors.GREY1,
    marginRight: SIZE(10),
  },
  minPriceText: {
    // paddingHorizontal: SIZE(29),
    color: '#3e4676',
    paddingVertical: SIZE(15),
  },
  sellLeftGroupButton: {
    borderWidth: 1,
    borderColor: Colors.BLUE3,
    backgroundColor: Colors.BLUE2,
  },
  sellLeftGroupButtonText: {
    color: Colors.WHITE2,
  },
  sellDropDownContainer: {
    backgroundColor: Colors.white,
  },
  showTime: {
    alignSelf: 'center',
    paddingVertical: SIZE(12),
    fontSize: SIZE(10),
    fontWeight: '700',
  },
  sellInputField: {
    width: '55%',
    paddingHorizontal: SIZE(10),
  },
  sellGroupButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: SIZE(8),
  },
  creatorMarkIcon: {
    position: 'absolute',
    left: 30,
    bottom: 12,
    zIndex: 10,
  },
  ownerMarkIcon: {
    position: 'absolute',
    right: 92,
    bottom: 12,
    zIndex: 10,
  },
  socialView:{
    height: 40,
    width: '15%',
    borderWidth: 0.3,
    borderColor: colors.GREY12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
