import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {SIZE, SVGS} from '../constants';
import {wp} from '../constants/responsiveFunct';
import Modal from 'react-native-modal';
import CloseIcon from 'react-native-vector-icons/SimpleLineIcons';

const {CircleCloseIcon} = SVGS;

const ImageModal = props => {
  const {
    iconSize,
    iconColor,
    modalStyle = {},
    iconStyle = {},
    imageStyle = {},
    visible,
    setVisible,
  } = props;
  return (
    <Modal
      onBackdropPress={() => props?.setVisible(false)}
      isVisible={visible}
      style={[styles.modal, modalStyle]}>
      <View>
        <CloseIcon
          name="close"
          style={[styles.iconStyle,iconStyle]}
          size={iconSize}
          color={iconColor}
          onPress={() => setVisible(false)}
        />
        <Image
          source={{uri: props?.uri}}
          style={[styles.modalImg, imageStyle]}
        />
      </View>
    </Modal>
  );
};

export default ImageModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
  },
  iconStyle: {
    alignSelf: 'flex-end',
  },
  modalImg: {
    width: wp('100%'),
    minHeight: wp('100%'),
    resizeMode: 'contain',
  },
});
