
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import { languageArray, translate } from '../../walletUtils';
import styles from './style';
import { Portal } from '@gorhom/portal';
import Images from '../../constants/Images';
import { setAppLanguage } from '../../store/reducer/languageReducer';
import { CommonActions } from '@react-navigation/native';

const SelectionModal = props => {
  const {closeModal,navigation,isVisible,arrToRender} = props
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  const JapaneseLangTrans = {
    en: '英語（イギリス）',
    ko: '韓国語',
    tw: '中国語（繁体）',
    ch: '中国語（簡体）',
  };
  
  const updateLanguage = language => {
    if (selectedLanguageItem.language_name !== language.language_name) {
      dispatch(setAppLanguage(language));
      closeModal
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Me' }],
        }),
      );
    } else {
      closeModal
    }
  };

  return (
    <Portal>
      <Modal
        isVisible={isVisible}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        onBackdropPress={() =>{ closeModal}}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onRequestClose={() => {
          closeModal
        }}>
        <View style={styles.modalCont}>
          <Text style={styles.modalTitle}>
            {translate('wallet.common.selectLanguage')}
          </Text>
          <View style={{ marginTop: hp('2%') }}>
            {arrToRender.map((v, i) => {
              const selectedLanguage =
                selectedLanguageItem.language_name == v.language_name
                  ? { color: Colors.themeColor }
                  : {};
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    updateLanguage(v);
                  }}
                  style={styles.selectLanguageView}>
                  <View style={styles.titleView}>
                    <Image style={styles.iconStyle} source={v.icon} />
                    <Text style={{ ...styles.titleStyle, ...selectedLanguage }}>
                      {selectedLanguageItem.language_name === 'ja'
                        ? JapaneseLangTrans[v.language_name]
                          ? JapaneseLangTrans[v.language_name]
                          : v.language_display
                        : v.language_display}
                    </Text>
                  </View>
                  {selectedLanguageItem.language_name == v.language_name ? (
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