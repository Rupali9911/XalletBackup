import {Platform, StyleSheet} from 'react-native';
import {
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {hp} from '../../constants/responsiveFunct';
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
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'contain',
    backgroundColor: colors.GREY2,
    // marginTop: hp('3%')
  },
  nftTitle: {
    fontSize: RF(1.5),
    fontFamily: fonts.ARIAL_BOLD,
    marginTop: SIZE(15),
    paddingHorizontal: SIZE(12),
    color: colors.PINK1,
  },
  nftName: {
    fontSize: RF(2.75),
    fontFamily: fonts.ARIAL_BOLD,
    marginBottom: SIZE(15),
    paddingHorizontal: SIZE(12),
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
  creatorName: {
    fontSize: RF(2),
    fontFamily: fonts.ARIAL,
    color: colors.themeR,
    lineHeight: SIZE(14.06),
    maxWidth: SIZE(130),
  },
  description: {
    fontSize: RF(1.4),
    fontFamily: fonts.PINGfANG,
    color: colors.GREY1,
    marginTop: SIZE(40),
    marginBottom: SIZE(20),
    paddingHorizontal: SIZE(12),
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
    fontSize: RF(1.9),
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.RED1,
    paddingBottom: Platform.OS === 'android' ? RF(0.4) : null,
  },
  price: {
    fontSize: RF(2.8),
    fontFamily: fonts.ARIAL,
    color: colors.RED1,
    textAlign: 'right',
    lineHeight: RF(2.8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: SIZE(6),
    marginBottom: SIZE(10),
  },
  tokenPicker: {
    borderColor: colors.themeR,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderColor: colors.themeR,
    borderRadius: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  rowText: {
    color: colors.black,
    fontSize: RF(1.75),
    maxWidth: wp('30%'),
  },
  head: {height: 35},
  text: {margin: 6},
});

export default styles;
