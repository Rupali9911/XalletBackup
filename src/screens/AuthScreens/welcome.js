import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import LanguageSelector from '../../components/languageSelector';
import {RF} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {setI18nConfig, translate} from '../../walletUtils';

const Welcome = ({route, navigation}) => {
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);

  setI18nConfig(selectedLanguageItem.language_name);

  const [openPicker, setOpenPicker] = useState(false);
  const [isCheck, setCheck] = useState(false);

  return (
    <AppBackground>
      <LanguageSelector open={openPicker} />
      <View
        style={CommonStyles.screenContainer}
        onStartShouldSetResponder={() => {
          setOpenPicker(!openPicker);
          return true;
        }}>
        <View style={styles.contentContainer}>
          <AppLogo logoStyle={styles.logo} />
          <TextView style={styles.title}>
            {translate('wallet.common.welcomeTxt')}
          </TextView>
        </View>

        <View style={styles.bottomView}>
          <AppButton
            label={translate('wallet.common.createWallet')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              console.log('legal');
              navigation.navigate('legal');
            }}
          />
          <AppButton
            label={translate('wallet.common.haveWallet')}
            containerStyle={CommonStyles.outlineButton}
            labelStyle={CommonStyles.outlineButtonLabel}
            onPress={() => {
              navigation.navigate('recoveryPhrase', {recover: true});
            }}
          />
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomView: {},
  logo: {
    ...CommonStyles.imageStyles(25),
  },
  title: {
    alignSelf: 'center',
    fontSize: RF(2.7),
  },
});

export default Welcome;
