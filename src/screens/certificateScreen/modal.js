import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
import { GroupButton } from "../../components";
import Modal from "react-native-modal";
import Images from "../../constants/Images";
import cancelImg from "../../../assets/images/cancel.png"
const ShowModal = (props) => {
  const {
    title,
    description,
    isVisible,
    closeModal,
    reClaimApi,
    leftButtonTitle,
    rightButtonTitle,
    topUpButton,
    cancelAuctionApi,
    reclaim,
    cancelAuction,
    cancel,
    cancelModalConfirm
  } = props
  return (
    <View style={styles.modalContainer}>
       <Modal isVisible={isVisible} >
        <View style={styles.reClaimcontainer}>
          <View style={styles.reClaimCancelBTNview}>
            <TouchableOpacity onPress={closeModal} >
              <Image source={cancelImg} style={styles.reClaimCancelButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerImgView}>
            <Image source={Images.confirm} style={styles.centerImg} />
          </View>
          <View style={styles.reclaimView}>
            {title === title ? <Text style={styles.reclaimText}>
              {title}
            </Text> : title === title ? <Text style={styles.reclaimText}>
              {title}
            </Text> : <Text style={styles.reclaimText}>
              {title}
            </Text>
            }
          </View>
          <View style={styles.textView}>
            {description === description ? <Text style={styles.text}>
              {description}
            </Text> : description === description ? <Text style={styles.text}>
              {description}
            </Text> : <Text style={styles.text}>
              {description}
            </Text>}
          </View>
          <View style={styles.groupButtonView}>
            <GroupButton
              leftText={leftButtonTitle}
              leftDisabled={false}
              leftLoading={false}
              onLeftPress={() => { closeModal()}}
              rightText={rightButtonTitle}
              rightDisabled={false}
              rightLoading={false}
              onRightPress={() => {reclaim ? reClaimApi():cancelAuction? cancelAuctionApi():cancel?cancelModalConfirm():null}}
              rightStyle={styles.reClaimRightGroupButton}
              rightTextStyle={styles.reClaimrightGroupButtonText}
              leftStyle={styles.rightGroupButton}
              leftTextStyle={styles.rightGroupButtonText}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}
export default ShowModal;