import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import LanguageSelector from '../../components/languageSelector';
import { RF } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';
import FastImage from 'react-native-fast-image';
import AppHeader from '../../components/appHeader';

const WalletBTNS = ({ navigation }) => {
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

  useEffect(() => {
    FastImage.clearMemoryCache();
    FastImage.clearDiskCache();
  }, [selectedLanguageItem.language_name]);

  const [openPicker, setOpenPicker] = useState(false);

  return (
    <AppBackground>
      <AppHeader showBackButton title={"Log in with Wallet"} />

      <View
        style={CommonStyles.screenContainer}
        onStartShouldSetResponder={() => {
          setOpenPicker(!openPicker);
          return true;
        }}>
        <View style={styles.contentContainer}>
          <AppLogo />

        </View>

        <View>
          <AppButton
            label={translate('wallet.common.createWallet')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              navigation.navigate('welcome');
            }}
          />
          <AppButton
            label={translate('wallet.common.haveWallet')}
            containerStyle={CommonStyles.outlineButton}
            labelStyle={CommonStyles.outlineButtonLabel}
            onPress={() => navigation.navigate('chooseWallet')}
          />
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    fontSize: RF(2.7),
  },
});

export default WalletBTNS;
