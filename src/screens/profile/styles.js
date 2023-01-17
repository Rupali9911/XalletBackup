import {StyleSheet, Dimensions} from 'react-native';
import {colors, fonts} from '../../res';

const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  sorryMessageCont: {
    // flex: 1,
    // marginTop: height / 6.5,

    // justifyContent: 'center',
    // alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    // margin: 0,
    // flex: 2,

    marginVertical: height / 6.5,
    // marginVertical: 100,
    // padding: 0,
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  saveBtnGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default styles;
