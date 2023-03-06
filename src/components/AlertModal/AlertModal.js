import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {COLORS, SIZE} from 'src/constants';
import Colors from '../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {alertAction} from '../../store/actions/alertAction';

const AlertPopup = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state?.AlertReducer?.alertData);
  return (
    <View>
      <Modal
        isVisible={state?.status}
        onBackdropPress={() => dispatch(alertAction({status: false}))}
        onBackButtonPress={() => dispatch(alertAction({status: false}))}
        useNativeDriver={true}
        hideModalContentWhileAnimating>
        <View style={styles.modalView}>
          <Text style={styles.title}>{state?.title}</Text>
          <Text style={styles.description}>{state?.description}</Text>
          <TouchableOpacity
            style={styles.okButtonView}
            onPress={() => {
              state.onPress
                ? state.onPress()
                : dispatch(alertAction({status: false}));
            }}>
            <Text style={styles.okButtonTitle}>{state?.text}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default AlertPopup;
export const styles = StyleSheet.create({
  description: {
    alignSelf: 'center',
    color: COLORS.modalHintText,
    fontFamily: 'Arial',
    marginHorizontal: '8%',
    marginTop: SIZE(20),
    textAlign: 'center',
    lineHeight: 20,
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
    lineHeight: 24,
  },
  okButtonTitle: {
    textAlign: 'center',
    color: Colors.white,
    fontFamily: 'PingFang SC',
    fontSize: SIZE(15),
  },
  okButtonView: {
    marginHorizontal: SIZE(20),
    height: SIZE(40),
    backgroundColor: Colors.BLUE2,
    marginTop: SIZE(25),
    borderRadius: 4,
    justifyContent: 'center',
  },
});
