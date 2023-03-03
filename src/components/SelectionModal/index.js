
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import styles from './style';
import { Portal } from '@gorhom/portal';
import Images from '../../constants/Images';
import {
  heightPercentageToDP as hp,
} from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';

const SelectionModal = props => {
  const { showIcon, closeModal, isVisible, arrToRender, onSelect, title, selectedValue, compareParam, displayJaParam, displayParam } = props

  const getText = (v) => {
    let txt = displayJaParam ? selectedValue[compareParam] === 'ja'
      ? v[displayJaParam]
      : v[displayParam]
      : v[displayParam]
    return txt
  }

  return (
    <Portal>
      <Modal
        isVisible={isVisible}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        onBackdropPress={() => closeModal()}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onRequestClose={() => {
          closeModal()
        }}>
        <View style={styles.modalCont}>
          <Text style={styles.modalTitle}>
            {title}
          </Text>
          <View style={{ marginTop: hp('2%') }}>
            {arrToRender.map((v, i) => {
              const selectedStyle =
                selectedValue == v[compareParam]
                  ? { color: Colors.themeColor }
                  : {};
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    onSelect(v);
                  }}
                  style={styles.selectLanguageView}>
                  <View style={styles.titleView}>
                    {showIcon &&
                     <Image style={styles.iconStyle} source={v.icon} />
                    }
                    <Text style={{ ...styles.titleStyle, ...selectedStyle }}>
                      {getText(v)}
                    </Text>
                  </View>
                  {selectedValue == v[compareParam] ? (
                    <Image style={styles.tickIcon} source={Images.tick} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SelectionModal