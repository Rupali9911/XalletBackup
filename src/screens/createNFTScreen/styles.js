import {StyleSheet} from 'react-native';

import {colors, fonts} from '../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.GREY8,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2%'),
  },
  title: {
    fontSize: RF(2.5),
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.black,
  },
  titleDes: {
    color: colors.GREY7,
    fontSize: RF(1.5),
    marginVertical: hp('1%'),
    fontFamily: fonts.PINGfANG,
  },
  childCont: {
    flex: 1,
    backgroundColor: colors.GREY8,
    paddingVertical: hp('2%'),
  },
  cardfieldCount: {
    fontSize: RF(1.5),
    fontFamily: fonts.SegoeUIRegular,
    color: colors.BLACK7,
    marginTop: hp('1%'),
  },
  imageMainCard: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  cardImageCont: {
    width: '100%',
    height: hp('30%'),
    backgroundColor: colors.GREY11,
  },
  completeImage: {
    flex: 1,
    backgroundColor: colors.GREY11,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
  bannerCardCont: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
  },
  bannerDes: {
    fontSize: RF(1.3),
    fontFamily: fonts.SegoeUIRegular,
    color: colors.BLACK2,
    marginVertical: hp('1%'),
  },
  changeBtn: {
    alignSelf: 'flex-end',
    width: wp('20%'),
  },
  saveBtnGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  groupField: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerFieldCont: {
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
  },
  leftToggle: {
    width: '30%',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightToggle: {
    width: '30%',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  imageStyles: size => ({
    height: wp(size),
    width: wp(size),
    resizeMode: 'contain',
  }),
  listMainCont: {
    marginVertical: hp(3),
    width: '100%',
  },
  listCont: {
    flexDirection: 'row',
    paddingVertical: hp(1),
    alignItems: 'center',
  },
  listLeft: {
    width: wp('10%'),
  },
  listCenter: {
    flex: 1,
    paddingHorizontal: wp(3),
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.GREY9,
    marginVertical: hp(1),
  },
  listTitle: {
    fontSize: RF(1.5),
    color: colors.BLUE5,
    fontFamily: fonts.PINGfANG_SBOLD,
  },
  listLabel: {
    fontSize: RF(1.5),
    color: colors.BLUE5,
    fontFamily: fonts.SegoeUIRegular,
  },
});

export default styles;
