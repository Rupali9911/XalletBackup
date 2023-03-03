import {StyleSheet} from 'react-native';

import {colors, fonts} from '../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
  SIZE,
} from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const styles = StyleSheet.create({
  modalCont: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
  },
  modalTitle: {
    fontFamily: Fonts.ARIAL_BOLD,
    fontSize: RF(2.5),
    color: Colors.blackShadeOne,
    textAlign: 'center',
  },
  tickIcon: {
    width: SIZE(14),
    height: SIZE(14),
  },
  iconStyle: {
    width: SIZE(18),
    height: SIZE(18),
  },
  selectLanguageView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    width: '100%',
    justifyContent: 'space-between',
     paddingHorizontal: wp('3%'),
  },
  titleView: {
    flexDirection: 'row',
  },
  titleStyle: {
    fontFamily: fonts.ARIAL,
    fontSize: RF(1.9),
    color: Colors.blackShadeOne,
    marginHorizontal: 10,
  },
});

export default styles;
