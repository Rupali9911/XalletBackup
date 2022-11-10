import '@ethersproject/shims';
import { hdkey } from 'ethereumjs-wallet';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import bip39 from 'react-native-bip39';
import 'react-native-get-random-values';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SIZE } from 'src/constants';
import { SIGN_MESSAGE } from '../../common/constants';
import { alertWithSingleBtn } from '../../common/function';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppHeader from '../../components/appHeader';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import Checkbox from '../../components/checkbox';
import HintText from '../../components/hintText';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import { hp, RF } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { loginExternalWallet } from '../../store/reducer/userReducer';
import { translate } from '../../walletUtils';
const Web3 = require('web3');

const Backup = ({ navigation }) => {
  const dispatch = useDispatch();
  // const { loading } = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(true);
  const [openPicker, setOpenPicker] = useState(false);
  const [isCheck, setCheck] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    getPhraseData();
  }, []);

  const getPhraseData = async () => {
    let randomSeed = await bip39.generateMnemonic();
    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(randomSeed));
    const path = "m/44'/60'/0'/0/0";
    const wallet = hdwallet.derivePath(path).getWallet();
    const address = `0x${wallet.getAddress().toString('hex')}`;
    const privateKey = `0x${wallet.getPrivateKey().toString('hex')}`;
    var web3 = new Web3(Web3.givenProvider);
    const signature = await web3.eth.accounts.sign(SIGN_MESSAGE, privateKey);
    const account = {
      mnemonic: randomSeed,
      address: address,
      privateKey: privateKey,
      signature: signature.signature,
    };
    setWallet(account);
    setLoading(false);
  };

  const saveWallet = () => {
    dispatch(loginExternalWallet(wallet, false, true))
      .then(() => { })
      .catch(err => {
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.tryAgain'),
        );
      });
  };

  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton title={translate('wallet.common.backup')} />
      <View
        style={CommonStyles.screenContainer}
        onStartShouldSetResponder={() => {
          setOpenPicker(!openPicker);
          return true;
        }}>
        <View style={styles.contentContainer}>
          <AppLogo />
          <TextView style={styles.title}>
            {translate('wallet.common.backupTxt')} !
          </TextView>
          <HintText>{translate('wallet.common.phraseHint')}</HintText>
          <View style={styles.imgContainer}>
            <ImageBackground style={styles.img} source={ImagesSrc.backupImg}>
              <Image
                source={ImagesSrc.backupLoaderImg}
                style={{
                  ...CommonStyles.imageStyles(16.8),
                  marginRight: SIZE(5),
                }}
              />
            </ImageBackground>
          </View>
        </View>

        <View>
          <Checkbox
            isCheck={isCheck}
            onChecked={setCheck}
            label={translate('wallet.common.phraseAlert')}
          />
          <AppButton
            label={translate('wallet.common.next')}
            view={!isCheck}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              navigation.navigate('recoveryPhrase', { hide: false, wallet });
            }}
          />
          <Button
            uppercase={false}
            color={Colors.themeColor}
            style={{ marginBottom: hp('1%') }}
            onPress={saveWallet}>
            {translate('wallet.common.doItLater')}
          </Button>
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
  imgContainer: {
    flex: 1,
    ...CommonStyles.center,
  },
  img: {
    ...CommonStyles.imageStyles(40),
    ...CommonStyles.center,
  },
});

export default Backup;
