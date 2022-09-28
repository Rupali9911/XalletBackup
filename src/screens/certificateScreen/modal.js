import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import { GroupButton } from "../../components";
import Modal from "react-native-modal";
import Images from "../../constants/Images";
import cancelImg from "../../../assets/images/cancel.png"
import { translate } from '../../walletUtils';

const ShowModal = (props) => {
  const {
    title,
    description,
    isVisible,
    closeModal,
    leftButtonTitle,
    rightButtonTitle,
    onLeftPress,
    onRightPress,
    isTitleCapital
  } = props
  return (
    <View style={styles.modalContainer}>
      <Modal isVisible={isVisible}>
        <View style={styles.reClaimcontainer}>

          <TouchableOpacity
            style={styles.reClaimCancelBTNview}
            onPress={closeModal}>
            <Image
              source={cancelImg}
              style={styles.reClaimCancelButton}
            />
          </TouchableOpacity>

          <Image
            source={Images.confirm}
            style={styles.centerImg}
          />

          <View style={styles.reclaimView}>
            <Text style={styles.reclaimText}>
              {title}
            </Text>
          </View>

          <View style={styles.textView}>
            <Text style={styles.text}>
              {description}
            </Text>
          </View>

          <View style={styles.groupButtonView}>
            <GroupButton
              leftText={leftButtonTitle ? leftButtonTitle : translate('common.Cancel')}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => closeModal ? closeModal() : onLeftPress}
              leftStyle={styles.rightGroupButton}
              leftTextStyle={styles.rightGroupButtonText}

              rightText={rightButtonTitle ? rightButtonTitle : translate('common.Confirm')}
              rightDisabled={false}
              rightLoading={false}
              onRightPress={onRightPress}
              rightStyle={styles.reClaimRightGroupButton}
              rightTextStyle={styles.reClaimrightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}
export default ShowModal;