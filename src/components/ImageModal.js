import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {SIZE, SVGS} from '../constants';
import {wp} from '../constants/responsiveFunct';
import Modal from 'react-native-modal';
import CloseIcon from 'react-native-vector-icons/SimpleLineIcons';
import C_Image from './customImage';
import {ImagekitType} from '../common/ImageConstant';
import {Portal} from '@gorhom/portal';

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
    <Portal>
      <Modal
        onBackdropPress={() => props?.setVisible(false)}
        isVisible={visible}
        style={[styles.modal, modalStyle]}>
        <View>
          <CloseIcon
            name="close"
            style={[styles.iconStyle, iconStyle]}
            size={iconSize}
            color={iconColor}
            onPress={() => setVisible(false)}
          />
          <C_Image
            uri={props?.uri}
            size={ImagekitType.FULLIMAGE}
            imageStyle={[styles.modalImg, imageStyle]}
          />
        </View>
      </Modal>
    </Portal>
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
