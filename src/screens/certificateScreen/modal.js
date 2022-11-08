import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './styles';
import {GroupButton} from '../../components';
import Modal from 'react-native-modal';
import Images from '../../constants/Images';
import cancelImg from '../../../assets/images/cancel.png';
import {translate} from '../../walletUtils';
import {SIZE} from '../../constants';

const ShowModal = props => {
  const {
    title,
    description,
    isVisible,
    closeModal,
    leftButtonTitle,
    rightButtonTitle,
    onLeftPress,
    onRightPress,
    isDelete,
    onBackdrop,
  } = props;
  return (
    <View style={styles.modalContainer}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdrop ? closeModal : null}>
        <View
          style={[styles.reClaimcontainer, isDelete && styles.deleteAccount]}>
          <TouchableOpacity
            style={styles.reClaimCancelBTNview}
            onPress={closeModal}>
            <Image
              source={isDelete ? Images.closeIcon : cancelImg}
              style={isDelete ? {} : styles.reClaimCancelButton}
            />
          </TouchableOpacity>
          {isDelete ? (
            <View style={{paddingTop: SIZE(25)}}>
              <Image source={Images.deleteRed} style={styles.deleteRedImg} />
            </View>
          ) : (
            <Image source={Images.confirm} style={styles.centerImg} />
          )}
          <View
            style={{
              paddingTop: isDelete ? SIZE(15) : {},
            }}>
            <View
              style={isDelete ? styles.deleteAccountView : styles.reclaimView}>
              <Text
                style={
                  isDelete ? styles.deleteAccountText : styles.reclaimText
                }>
                {title}
              </Text>
            </View>
          </View>

          <View style={styles.textView}>
            <Text style={[styles.text, isDelete && styles.descriptionCenter]}>
              {description}
            </Text>
          </View>

          <View style={styles.groupButtonView}>
            <GroupButton
              leftText={
                leftButtonTitle ? leftButtonTitle : translate('common.Cancel')
              }
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => (closeModal ? closeModal() : onLeftPress)}
              leftStyle={
                isDelete
                  ? styles.reClaimRightGroupButton
                  : styles.rightGroupButton
              }
              leftTextStyle={
                isDelete
                  ? styles.reClaimrightGroupButtonText
                  : styles.rightGroupButtonText
              }
              rightText={
                rightButtonTitle
                  ? rightButtonTitle
                  : translate('common.Confirm')
              }
              rightDisabled={false}
              rightLoading={false}
              onRightPress={onRightPress}
              rightStyle={
                isDelete
                  ? styles.rightDeleteGroupButton
                  : styles.reClaimRightGroupButton
              }
              rightTextStyle={styles.reClaimrightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ShowModal;
