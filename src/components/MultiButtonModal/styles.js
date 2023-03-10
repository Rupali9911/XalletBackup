import { StyleSheet } from 'react-native';
import { COLORS, SIZE } from 'src/constants';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: SIZE(190)
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
    marginTop: SIZE(15),
    textAlign: 'center',
    lineHeight: 20,
  },
  groupButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: SIZE(20),
    marginVertical: SIZE(25),
  },
  buttonView: {
    backgroundColor: Colors.BLUE2,
    flex: 1,
  },
  amountInput: {
    width: "88%",
    height: "15%",
    color: Colors.black,
    borderWidth: 0.2,
    borderRadius: 5,
    textAlign: 'left',
    paddingLeft: 10,
    paddingBottom: 0,
    paddingTop: 0,
    fontSize: 18
  },

});

export default styles;
