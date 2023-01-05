import React, {useEffect, useState} from 'react';
import {Platform, View, StyleSheet, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {SIZE} from '../../../constants';
import Colors from '../../../constants/Colors';
import {
  hp,
  wp,
  screenHeight,
  screenWidth,
} from '../../../constants/responsiveFunct';
import {getProxy} from './magic-link';
import CommonStyles from '../../../constants/styles';
import {Portal} from '@gorhom/portal';
import {translate} from '../../../walletUtils';

const MagicLayer = () => {
  const [magic, setMagic] = useState({});

  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  const {magicLoading} = useSelector(state => state.UserReducer);
  useEffect(() => {
    const magicLink = getProxy();
    setMagic(magicLink);
  }, [selectedLanguageItem]);

  const renderMessage = () => {
    return (
      <Portal>
        <View style={styles.container}>
          <View style={styles.messageView}>
            <Text style={styles.messageText}>
              {translate('common.EMAIL_AUTHORIZATION_MSG')}
            </Text>
          </View>
        </View>
      </Portal>
    );
  };

  return magic.Relayer ? (
    <>
      <magic.Relayer />
      {magicLoading && renderMessage()}
    </>
  ) : null;

  // return magicLoading ? (
  //   <View style={styles.container}>
  //     <View style={styles.magicRelayer}>
  //       <magic.Relayer />
  //     </View>

  //     <View style={styles.loader}>
  //       <Loader />
  //     </View>
  //   </View>
  // ) : null;
};

export default MagicLayer;

const styles = StyleSheet.create({
  // container: {
  //   backgroundColor: Colors.WHITE1,
  //   height: screenHeight,
  //   width: screenWidth,
  // },
  // magicRelayer: {
  //   flex: 1 / 2,
  // },
  // loader: {
  //   marginTop: Platform.OS === 'android' ? hp(5) : null,
  // },
  container: {
    ...CommonStyles.center,
    zIndex: 1,
    backgroundColor: Colors.white,
    width: screenWidth,
    height: hp(30),
  },
  messageView: {
    ...CommonStyles.center,
    borderRadius: wp('4%'),
    backgroundColor: Colors.GREY2,
  },
  messageText: {
    padding: SIZE(10),
    textAlign: 'center',
    fontSize: SIZE(13),
    fontFamily: 'Arial',
    color: Colors.GREY3,
    width: wp('85%'),
  },
});
