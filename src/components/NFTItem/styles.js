import {StyleSheet} from 'react-native';
import { COLORS } from '../../constants';
import {hp, wp} from '../../constants/responsiveFunct';
const styles = StyleSheet.create({
  listItem: {
    height: wp('100%') / 3 - wp('0.5%'),
    marginVertical: wp('0.3'),
    marginHorizontal: wp('0.3'),
    width: wp('100%') / 3 - wp('0.5%'),
  },
  listImage: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  bottomContainer:{
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingVertical: hp(0.30),
    backgroundColor: COLORS.BLACKRGBA(0.5)
  }
});
export default styles;
