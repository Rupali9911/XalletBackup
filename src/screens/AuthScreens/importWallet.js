import Clipboard from '@react-native-clipboard/clipboard';
import { useKeyboard } from '@react-native-community/hooks';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { SIGN_MESSAGE } from '../../common/constants';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppHeader from '../../components/appHeader';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import HintText from '../../components/hintText';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import SelectButtongroup from '../../components/selectButtonGroup';
import Colors from '../../constants/Colors';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { colors } from '../../res';
import {
  endLoader,
  loginExternalWallet,
  setBackupStatus,
  setPasscode,
  startLoader,
} from '../../store/reducer/userReducer';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
//================= =================
import '@ethersproject/shims';
import { hdkey } from 'ethereumjs-wallet';
import { ethers, utils } from 'ethers';
import bip39 from 'react-native-bip39';
import 'react-native-get-random-values';
const Web3 = require('web3');
//================= =================

const toastConfig = {
  my_custom_type: ({ text1, props, ...rest }) => (
    <View style={styles.toastView}>
      <Text style={styles.toastTxt}>{text1}</Text>
    </View>
  ),
};

const ImportWallet = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const { loading } = useSelector(state => state.UserReducer);
  const [wallet, setWallet] = useState(null);
  const [phrase, setPhrase] = useState('');
  const [pvtKey, setPvtKey] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [inputType, setInputType] = useState(0);

  const toastRef = useRef(null);
  let regPhrase = /^[A-Za-z\s]*$/;
  let regPvtKey = /^[0-9a-zA-Z]+$/;

  const copyToClipboard = () => {
    toastRef.current.show({
      type: 'my_custom_type',
      text1: translate('wallet.common.phraseCopy'),
      topOffset: hp('10%'),
      visibilityTime: 500,
      autoHide: true,
    });
    Clipboard.setString(wallet?.mnemonic);
  };

  const recoverWalletByPhrase = () => {
    if (phrase?.trim()?.length !== 0) {
      dispatch(startLoader())
        .then(async () => {
          let mnemonic = phrase.trim();
          let isValidPhrase = utils.isValidMnemonic(mnemonic);
          if (isValidPhrase) {
            const hdwallet = hdkey.fromMasterSeed(
              bip39.mnemonicToSeed(mnemonic),
            );
            const path = "m/44'/60'/0'/0/0";
            const wallet = hdwallet.derivePath(path).getWallet();
            const address = `0x${wallet.getAddress().toString('hex')}`;
            const privateKey = `0x${wallet.getPrivateKey().toString('hex')}`;
            var web3 = new Web3(Web3.givenProvider);

            const signature = await web3.eth.accounts.sign(
              SIGN_MESSAGE,
              privateKey,
            );
            const account = {
              mnemonic: mnemonic,
              address: address,
              privateKey: privateKey,
              signature: signature.signature,
            };
            setWallet(account);
            dispatch(setPasscode(''));
            dispatch(loginExternalWallet(account, false))
              .then(() => {
                dispatch(setBackupStatus(true));
              })
              .catch(err => {
                if (err.data.messageCode === 'AUTH.DELETED') {
                  alertWithSingleBtn(
                    translate('wallet.common.alert'),
                    translate('common.ACCOUNT_DELETED'),
                  );
                }
              });
          } else {
            alertWithSingleBtn(
              translate('wallet.common.verification'),
              translate('wallet.common.error.invalidPhrase'),
            );
            dispatch(endLoader());
          }
        })
        .catch(err => {
          console.log('err', err.toString());
          if (
            err.toString() == 'Error: invalid mnemonic' ||
            err.toString() == 'Error: invalid checksum'
          ) {
            alertWithSingleBtn(
              translate('wallet.common.verification'),
              translate('wallet.common.error.invalidPhrase'),
            );
          }
          dispatch(endLoader());
        });
    } else {
      alertWithSingleBtn(
        translate('common.error'),
        translate('wallet.common.requirePhrase'),
      );
    }
  };

  const recoverWalletByPrivateKey = () => {
    if (pvtKey !== '') {
      dispatch(startLoader())
        .then(async () => {
          let private_key = pvtKey.trim();
          let mnemonicWallet = new ethers.Wallet(private_key);
          var web3 = new Web3(Web3.givenProvider);
          const signature = await web3.eth.accounts.sign(
            SIGN_MESSAGE,
            mnemonicWallet.privateKey,
          );
          const account = {
            mnemonic: mnemonicWallet.mnemonic,
            address: mnemonicWallet.address,
            privateKey: mnemonicWallet.privateKey,
            signature: signature.signature,
          };
          setWallet(account);
          dispatch(setPasscode(''));
          dispatch(loginExternalWallet(account, false))
            .then(() => {
              dispatch(setBackupStatus(true));
            })
            .catch(err => {
              if (err.data.messageCode === 'AUTH.DELETED') {
                alertWithSingleBtn(
                  translate('wallet.common.alert'),
                  translate('common.ACCOUNT_DELETED'),
                );
              }
            });
        })
        .catch(err => {
          console.log('recoverWalletByPrivateKey err', err.toString());
          alertWithSingleBtn(
            translate('wallet.common.verification'),
            translate('wallet.common.error.invalidPrivateKey'),
          );
          dispatch(endLoader());
        });
    } else {
      // alertWithSingleBtn(
      //   translate('common.error'),
      //   translate('wallet.common.requirePhrase'),
      // );
    }
  };

  const pastePhrase = async () => {
    const text = await Clipboard.getString();
    if (inputType !== 1) {
      let newArray = text.split(' ');
      newArray.splice(12, newArray.length);
      let finalPhrase = newArray.join(' ');
      setPhrase(finalPhrase);
    } else {
      setPvtKey(text);
    }
  };
  const getSuggestions = async val => {
    setTimeout(async () => {
      const response = await axios.get(`https://api.datamuse.com/sug?s=${val}`);
      setSuggestions(response.data);
    }, 100);
  };
  const setPhraseText = val => {
    if (userTyping) {
      var myString = inputType == 0 ? phrase : pvtKey;
      myString = myString.substring(0, myString.lastIndexOf(' '));
      if (myString.lastIndexOf(' ') == -1 && myString.length < 1) {
        const newPhrase = `${val} `;
        inputType == 0 ? setPhrase(newPhrase) : setPvtKey(newPhrase);
      } else {
        const newPhrase = myString + ` ${val} `;
        inputType == 0 ? setPhrase(newPhrase) : setPvtKey(newPhrase);
      }
    } else {
      const newPhrase = myString.trim() + ` ${val} `;
      inputType == 0 ? setPhrase(newPhrase) : setPvtKey(newPhrase);
    }
    setUserTyping(false);
    setShowSuggestions(false);
  };

  const handleFlatListRenderItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.suggestionContainer}
      onPress={() => setPhraseText(item.word)}>
      <Text style={styles.suggestionText}>{item.word}</Text>
    </TouchableOpacity>
  );

  const keyExtractor = (item, index) => {
    return `_${index}`;
  };

  const phraseValidation = val => {
    let strArr = val.split(' ').filter(function (str) {
      return /\S/.test(str);
    });
    return strArr;
  };

  const phraseAlert = phraseValidation(phrase).length <= 12 ? false : true;
  const phraseWarning = regPhrase.test(phrase);

  const privateKeyAlert = pvtKey !== '' ? !regPvtKey.test(pvtKey) : false;

  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.padding}>
              <AppLogo />
              <TextView style={styles.title}>
                {translate('wallet.common.importWallet')}
              </TextView>
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <SelectButtongroup
                  buttons={[
                    translate('common.recoveryPhrase'),
                    translate('wallet.common.privateKey'),
                  ]}
                  onButtonPress={(item, index) => {
                    setInputType(index);
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  placeholder={
                    inputType == 1
                      ? translate('common.EXAMPLE_PLACEHOLDER_TEXT')
                      : ' '
                  }
                  value={inputType !== 1 ? phrase : pvtKey}
                  autoCorrect={false}
                  keyboardType={
                    Platform.OS === 'ios' ? 'default' : 'visible-password'
                  }
                  onChangeText={val => {
                    if (val.trim() !== '') {
                      if (inputType !== 1) {
                        setPhrase(val);
                        setTimeout(() => {
                          const newWord = val.split(' ').splice(-1);
                          if (newWord != '') {
                            getSuggestions(newWord);
                            setShowSuggestions(true);
                            setUserTyping(true);
                          } else {
                            setShowSuggestions(false);
                          }
                        }, 100);
                      } else {
                        setPvtKey(val);
                        setTimeout(() => {
                          const newWord = val.split(' ').splice(-1);
                          if (newWord != '') {
                            getSuggestions(newWord);
                            setShowSuggestions(true);
                            setUserTyping(true);
                          } else {
                            setShowSuggestions(false);
                          }
                        }, 100);
                      }
                    } else if (val.length === 0) {
                      if (inputType !== 1) {
                        setPhrase('');
                      } else {
                        setPvtKey('');
                      }
                    }
                  }}
                  underlineColorAndroid={Colors.transparent}
                  onBlur={() => setShowSuggestions(false)}
                />
                <TouchableOpacity
                  onPress={() => pastePhrase()}
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    paddingHorizontal: wp('3%'),
                    paddingVertical: hp('1%'),
                  }}>
                  <Text style={{ color: Colors.themeColor }}>
                    {translate('wallet.common.paste')}
                  </Text>
                </TouchableOpacity>
              </View>
              {(phraseAlert || !phraseWarning) && inputType === 0 && (
                <View style={{ alignSelf: 'center', marginTop: hp('1%') }}>
                  <Text style={{ color: 'red' }}>
                    {translate('wallet.common.error.invalidPhrase')}
                  </Text>
                </View>
              )}
              {(privateKeyAlert && inputType === 1) && (
                <View style={{ alignSelf: 'center', marginTop: hp('1%') }}>
                  <Text style={{ color: 'red' }}>
                    {translate('wallet.common.error.invalidPrivateKey')}
                  </Text>
                </View>
              )}
              {keyboard.keyboardShown && showSuggestions && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 0 : hp('-1.45%'),
                    backgroundColor: Colors.inputBackground,
                  }}>
                  <FlatList
                    data={suggestions}
                    horizontal
                    keyboardShouldPersistTaps="always"
                    renderItem={handleFlatListRenderItem}
                    keyExtractor={keyExtractor}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              <HintText style={{ bottom: hp('2%') }}>
                {inputType == 0
                  ? translate('wallet.common.recoveryPhraseInfo')
                  : translate('common.PASTE_PRIVATE_KEY')}
              </HintText>
            </View>
          </View>
          <View style={styles.bottomView}>
            <AppButton
              label={translate('wallet.common.next')}
              view={inputType !== 1 ? (!phrase || (phraseValidation(phrase).length === 12 ? false : true)) : !pvtKey}
              containerStyle={CommonStyles.button}
              labelStyle={CommonStyles.buttonLabel}
              onPress={() => {
                if (inputType == 0) {
                  recoverWalletByPhrase();
                } else if (inputType == 1) {
                  recoverWalletByPrivateKey();
                }
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Toast config={toastConfig} ref={toastRef} />
    </AppBackground>
  );
};

const WordView = props => {
  return (
    <View style={styles.word}>
      <TextView style={styles.wordTxt}>
        <Text style={{ color: Colors.townTxt }}>{props.index} </Text>
        {props.word}
      </TextView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  bottomView: {
    paddingHorizontal: wp('5%'),
    marginTop: hp('1%'),
  },
  title: {
    alignSelf: 'center',
    fontSize: RF(2.7),
  },
  phraseContainer: {
    // height: hp("20%"),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: wp('5%'),
    paddingBottom: 0,
  },
  img: {
    ...CommonStyles.imageStyles(40),
    ...CommonStyles.center,
  },
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  alert: {
    flexDirection: 'row',
    backgroundColor: Colors.alertBg,
    padding: wp('4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  alertTxt: {
    color: Colors.alertText,
    flex: 1,
    fontSize: RF(1.5),
  },
  word: {
    flexDirection: 'row',
    borderColor: Colors.borderLightColor,
    borderWidth: 1,
    borderRadius: 5,
    padding: wp('2%'),
    paddingHorizontal: wp('3%'),
    margin: wp('1%'),
  },
  wordTxt: {
    fontSize: RF(1.8),
    color: Colors.black,
  },
  inputContainer: {
    padding: wp('3.5%'),
    backgroundColor: Colors.inputBackground,
    marginHorizontal: hp('2%'),
    borderRadius: 5,
    borderColor: Colors.borderLightColor3,
    borderWidth: 0.5,
  },
  input: {
    fontSize: RF(2),
    color: Colors.black,
    minHeight: hp('20%'),
    maxHeight: hp('20%'),
    marginBottom: Platform.OS !== 'ios' ? hp('0.7%') : hp('2%'),
    textAlignVertical: 'top',
  },
  padding: {
    padding: wp('5%'),
    paddingBottom: 0,
  },
  rowPadding: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardShift: {
    flex: 1,
  },
  suggestionText: {
    fontSize: RF(1.8),
    color: Colors.themeColor,
  },
  suggestionContainer: {
    backgroundColor: Colors.WHITE2,
    borderRadius: 5,
    padding: wp('1.5%'),
    paddingHorizontal: wp('3.5%'),
    margin: wp('1%'),
  },
  toastView: {
    paddingHorizontal: wp('20%'),
    borderRadius: wp('10%'),
    paddingVertical: hp('2%'),
    backgroundColor: colors.GREY5,
  },
  toastTxt: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default ImportWallet;
