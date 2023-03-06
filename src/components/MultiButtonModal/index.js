import React from 'react';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import GroupButton from '../groupButton';

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
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        useNativeDriver={true}
        hideModalContentWhileAnimating>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descriptionText}>{description}</Text>

          <View style={styles.groupButtonView}>
            <GroupButton
              onLeftPress={onLeftPress}
              leftText={leftButtonText}
              leftStyle={styles.buttonView}
              leftTextStyle={styles.reClaimrightGroupButtonText}
              onRightPress={onRightPress}
              rightText={rightButtonText}
              rightStyle={styles.buttonView}
              rightTextStyle={styles.reClaimrightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MultiButtonModal;
