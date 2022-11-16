import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import styles from './styles';
import {GroupButton} from '../../components';
import Modal from 'react-native-modal';
import Images from '../../constants/Images';
import cancelImg from '../../../assets/images/cancel.png';
import {translate} from '../../walletUtils';
import {SIZE} from '../../constants';
import Checkbox from '../../components/checkbox';
import {hp, wp} from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';

const ShowModal = props => {
  const {
    title,
    description,
    isVisible,
    closeModal,
    leftButtonTitle,
    rightButtonTitle,
    onLeftPress,
    onBackUpNowPress,
    onRightPress,
    isDelete,
    backupPhrase,
    onBackdrop,
    rightLoading,
    rightDisabled,
    leftDisabled,
    checkBoxDescription,
    isCheck,
    onChecked,
  } = props;

  return (
    <View style={styles.modalContainer}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdrop ? null : closeModal}>
        <View
          style={[styles.reClaimcontainer, isDelete && styles.deleteAccount, backupPhrase && styles.backupPhraseContainer]}>
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
              <Image source={backupPhrase ? Images.dangerIcon : Images.deleteRed} style={[styles.deleteRedImg, backupPhrase && styles.dangerIconStyle]} />
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
            <Text style={[styles.text, isDelete && styles.descriptionCenter, backupPhrase && styles.descriptionJustify]}>
              {description}
            </Text>
          </View>

          {checkBoxDescription ? (
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: SIZE(10),
                alignItems: 'center',
              }}>
              <Checkbox
                isCheck={isCheck}
                iconSize={wp('6%')}
                onChecked={onChecked}
                checkboxColor={Colors.BLACK1}
                label={checkBoxDescription}
                labelStyle={styles.checkBoxLabel}
                containerStyle={{
                  marginRight: 0,
                }}
              />
            </View>
          ) : null}

          <View style={styles.groupButtonView}>
            <GroupButton
              leftText={
                leftButtonTitle ? leftButtonTitle : translate('common.Cancel')
              }
              leftDisabled={leftDisabled ? leftDisabled : false}
              leftLoading={false}
              onLeftPress={() => (backupPhrase ? onBackUpNowPress() : closeModal ? closeModal() : onLeftPress())}
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
              rightDisabled={
                checkBoxDescription
                  ? isCheck
                    ? rightDisabled
                      ? rightDisabled
                      : false
                    : true
                  : rightDisabled
                  ? rightDisabled
                  : false
              }
              rightLoading={rightLoading ? rightLoading : false}
              onRightPress={onRightPress}
              rightStyle={
                checkBoxDescription
                  ? isCheck
                    ? {backgroundColor: Colors.RED3}
                    : styles.rightDeleteDisabled
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
