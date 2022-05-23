import {StyleSheet} from 'react-native';
import {SIZE} from '../../constants';
import Colors from '../../constants/Colors';
import {hp, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
const styles = StyleSheet.create({
  containerWrapper: {
    marginVertical: hp(0.5),
    width: wp(92.5),
    alignSelf: 'center',
  },
  container: {
    paddingHorizontal: SIZE(12),
    borderColor: Colors.GREY9,
    borderRadius: 5,
    borderWidth: 1,
    width: wp(92.5),
    height: hp(5),
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  childrenContainer:{
    paddingVertical: hp(1.5),
    borderColor: Colors.GREY9,
    borderWidth: 1,
    paddingHorizontal: SIZE(12),
  },
  icon: {
    ...CommonStyles.imageStyles(5),
  },
  downArrow: {
    ...CommonStyles.imageStyles(3),
  },
  titleText: {
    width: wp(70),
  },
});
export default styles;
