import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './styles';
import { GroupButton } from '../../components';
import Modal from 'react-native-modal';
import Images from '../../constants/Images';
import cancelImg from '../../../assets/images/cancel.png';
import { translate } from '../../walletUtils';
import { SIZE } from '../../constants';
import Checkbox from '../../components/checkbox';
import Colors from '../../constants/Colors';
import { Portal } from '@gorhom/portal';
import { RF, wp } from '../../constants/responsiveFunct';
import AppButton from '../../components/appButton';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';

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
    onLaterPress,
    backupPhraseWithLater,
  } = props;

  return (
<<<<<<< HEAD
    <View style={styles.modalContainer}>
      <Portal>
        <Modal
          isVisible={isVisible}
          onBackdropPress={onBackdrop ? null : closeModal}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}>
          <View
            style={[
              styles.reClaimcontainer,
              isDelete && styles.deleteAccount,
              backupPhrase && styles.backupPhraseContainer,
            ]}>
            <TouchableOpacity
              style={styles.reClaimCancelBTNview}
              onPress={closeModal}>
=======
    <Portal>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdrop ? null : closeModal}
        useNativeDriver={true}
        hideModalContentWhileAnimating>
        <View
          style={[
            styles.reClaimcontainer,
            isDelete && styles.deleteAccount,
            backupPhrase && styles.backupPhraseContainer,
          ]}>
          <TouchableOpacity
            style={styles.reClaimCancelBTNview}
            onPress={closeModal}>
            <Image
              source={isDelete ? Images.closeIcon : cancelImg}
              style={isDelete ? {} : styles.reClaimCancelButton}
            />
          </TouchableOpacity>
          {isDelete ? (
            <View style={{ paddingTop: SIZE(25) }}>
>>>>>>> cee221783f732de3ba7f73cb9d0eb0f6584965b7
              <Image
                source={backupPhrase ? Images.dangerIcon : Images.deleteRed}
                style={[
                  styles.deleteRedImg,
                  backupPhrase && styles.dangerIconStyle,
                ]}
              />
            </View>
          ) : (
            <Image source={Images.confirm} style={styles.centerImg} />
          )}
          <View
            style={{
              paddingTop: isDelete ? SIZE(15) : {},
            }}>
            <View
              style={
                isDelete ? styles.deleteAccountView : styles.reclaimView
              }>
              <Text
                style={
                  isDelete ? styles.deleteAccountText : styles.reclaimText
                }>
                {title}
              </Text>
            </View>
          </View>

          <View style={styles.textView}>
            <Text
              style={[
                styles.text,
                isDelete && styles.descriptionCenter,
                backupPhrase && styles.descriptionJustify,
              ]}>
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

          {backupPhraseWithLater ? (
            <View style={styles.rowContainer}>
              <AppButton
                label={translate('wallet.common.later')}
                containerStyle={styles.outlinedButton}
                labelStyle={[
                  CommonStyles.outlineButtonLabel,
                  CommonStyles.text(
                    Fonts.ARIAL,
                    Colors.greyButtonLabel,
                    RF(1.55),
                  ),
                ]}
                onPress={() => onLaterPress()}
              />
              <AppButton
                label={translate('wallet.common.backupNow')}
                containerStyle={styles.button}
                labelStyle={[
                  CommonStyles.buttonLabel,
                  CommonStyles.text(Fonts.ARIAL, Colors.white, RF(1.55)),
                ]}
                onPress={() => onBackUpNowPress()}
              />
            </View>
          ) : (
            <View style={styles.groupButtonView}>
              <GroupButton
                leftText={
                  leftButtonTitle
                    ? leftButtonTitle
                    : translate('common.Cancel')
                }
                leftDisabled={leftDisabled ? leftDisabled : false}
                leftLoading={false}
                onLeftPress={() =>
                  backupPhrase
                    ? onBackUpNowPress()
                    : closeModal
                      ? closeModal()
                      : onLeftPress()
                }
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
                      ? { backgroundColor: Colors.RED3 }
                      : styles.rightDeleteDisabled
                    : styles.reClaimRightGroupButton
                }
                rightTextStyle={styles.reClaimrightGroupButtonText}
              />
            </View>
          )}
        </View>
      </Modal>
    </Portal>
  );
};
export default ShowModal;
