import {StyleSheet} from 'react-native';
import {COLORS, SIZE} from 'src/constants';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  description: {
    alignSelf: 'center',
    color: COLORS.modalHintText,
    fontFamily: 'Arial',
    marginHorizontal: '8%',
    marginTop: SIZE(20),
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    height: SIZE(190),
  },
  title: {
    alignSelf: 'center',
    fontSize: SIZE(20),
    fontFamily: 'Arial',
    color: COLORS.Black,
    marginTop: SIZE(25),
  },
  okButtonTitle: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'PingFang SC',
    fontSize: SIZE(15),
  },
  okButtonView: {
    flex: 1,
    marginHorizontal: SIZE(20),
    height: SIZE(40),
    backgroundColor: Colors.BLUE2,
    marginTop: SIZE(25),
    borderRadius: 4,
    justifyContent: 'center',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZE(15),
  },
});

export default styles;
