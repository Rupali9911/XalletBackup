import {StyleSheet} from 'react-native';
import {COLORS, SIZE} from 'src/constants';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    height: SIZE(190),
  },
  titleText: {
    alignSelf: 'center',
    fontSize: SIZE(20),
    fontFamily: 'Arial',
    color: COLORS.Black,
    marginTop: SIZE(30),
    lineHeight: 24,
  },
  descriptionText: {
    alignSelf: 'center',
    color: COLORS.modalHintText,
    fontFamily: 'Arial',
    marginHorizontal: '8%',
    marginTop: SIZE(20),
    textAlign: 'center',
    lineHeight: 20,
  },
  groupButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: SIZE(20),
    marginVertical: SIZE(30),
  },
  buttonView: {
    backgroundColor: Colors.BLUE2,
    flex: 1,
  },
});

export default styles;
