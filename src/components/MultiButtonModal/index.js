import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';

const MultiButtonModal = props => {
  const {
    isVisible,
    closeModal,
    title,
    description,
    onLeftPress,
    onRightPress,
    leftButtonText,
    rightButtonText,
  } = props;

  return (
    <View>
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.modalView}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.okButtonView} onPress={onLeftPress}>
              <Text style={styles.okButtonTitle}>{leftButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.okButtonView}
              onPress={onRightPress}>
              <Text style={styles.okButtonTitle}>{rightButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MultiButtonModal;
