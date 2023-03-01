import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {translate} from '../../walletUtils';
import styles from './styles';

const MultiButtonModal = props => {
  const {onOkPress, isVisible, closeModal} = props;

  return (
    <View>
      <Modal isVisible={isVisible} onBackdropPress={closeModal}>
        <View style={styles.modalView}>
          <Text style={styles.title}>
            {translate('wallet.common.verification')}
          </Text>
          <Text style={styles.description}>
            {translate('wallet.common.logOutQ')}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.okButtonView} onPress={closeModal}>
              <Text style={styles.okButtonTitle}>
                {translate('common.Cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.okButtonView} onPress={onOkPress}>
              <Text style={styles.okButtonTitle}>{translate('common.OK')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MultiButtonModal;
