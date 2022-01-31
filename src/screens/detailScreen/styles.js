import {StyleSheet} from 'react-native';
import {FONTS, SIZE} from 'src/constants';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {colors, fonts} from '../../res';

const styles = StyleSheet.create({
  modalCont: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bgImageCont: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  bgImage: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'cover',
  },
  header: {
    height: SIZE(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  topHeaderText: {
    fontSize: RF(1.3),
    fontFamily: fonts.ARIAL,
    color: colors.GREY1,
  },
  bottomHeaderText: {
    fontSize: RF(1.8),
    fontFamily: fonts.PINGfANG_SBOLD,
    color: colors.BLACK1,
  },
  backIcon: {
    width: wp('10%'),
    height: '100%',
    paddingLeft: wp('3%'),
    justifyContent: 'center',
  },
  headerIcon: {
    height: wp('4%'),
    width: wp('4%'),
  },
  modalImage: {
    width: wp('100%'),
    height: wp('100%'),
    resizeMode: 'cover',
    // marginTop: hp('3%')
  },
  bottomModal: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: hp('3%'),
    paddingHorizontal: SIZE(14),
  },
  modalLabelCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLabel: {
    color: colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.SegoeUIBold,
  },
  heartIcon: {
    height: wp('7%'),
    width: wp('7%'),
    resizeMode: 'contain',
  },
  modalSectCont: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: hp('1%'),
    paddingBottom: SIZE(8.5),
    paddingHorizontal: hp('2%'),
  },
  modalIconLabel: {
    fontSize: SIZE(11),
    lineHeight: SIZE(12.89),
    fontFamily: fonts.SegoeUIRegular,
    color: colors.black,
    marginLeft: SIZE(9.5),
  },
  iconCont: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsImage: {
    height: wp('6%'),
    width: wp('6%'),
    borderRadius: wp('6%') / 2,
  },
  profileIcon: {
    width: SIZE(29),
    height: SIZE(29),
    borderRadius: SIZE(15),
    borderColor: '#979797',
    borderWidth: 1,
  },
  iconLabel: {
    fontSize: SIZE(12),
    lineHeight: SIZE(14.06),
    fontFamily: FONTS.ARIAL,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: SIZE(9.5),
  },
  separator: {
    width: '100%',
    height: 0.5,
    backgroundColor: colors.white,
  },
  modalBtn: {
    width: '100%',
    height: hp('5%'),
    marginVertical: hp('2%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 10,
    fontFamily: fonts.PINGfANG,
    color: '#909090',
    marginVertical: hp('1.5%'),
  },
  headerTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
