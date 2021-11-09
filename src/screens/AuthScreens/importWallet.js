import Clipboard from '@react-native-clipboard/clipboard';
import {useKeyboard} from '@react-native-community/hooks';
import axios from 'axios';
import React, {useRef, useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppHeader from '../../components/appHeader';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import HintText from '../../components/hintText';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import SelectButtongroup from '../../components/selectButtonGroup';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import {hp, RF, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {colors} from '../../res';
import {
  endLoader,
  getAddressNonce,
  setBackupStatus,
  setPasscode,
  startLoader,
} from '../../store/reducer/userReducer';
import {alertWithSingleBtn} from '../../utils';
import {translate} from '../../walletUtils';

const ethers = require('ethers');

const toastConfig = {
  my_custom_type: ({text1, props, ...rest}) => (
    <View
      style={{
        paddingHorizontal: wp('20%'),
        borderRadius: wp('10%'),
        paddingVertical: hp('2%'),
        backgroundColor: colors.GREY5,
      }}>
      <Text style={{color: colors.white, fontWeight: 'bold'}}>{text1}</Text>
    </View>
  ),
};

const ImportWallet = ({route, navigation}) => {
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const {loading} = useSelector(state => state.UserReducer);
  const [wallet, setWallet] = useState(null);
  const [phrase, setPhrase] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [inputType, setInputType] = useState(0);

  const toastRef = useRef(null);

  const copyToClipboard = () => {
    toastRef.current.show({
      type: 'my_custom_type',
      text1: translate('wallet.common.phraseCopy'),
      topOffset: hp('10%'),
      visibilityTime: 500,
      autoHide: true,
    });
    Clipboard.setString(wallet.mnemonic.phrase);
  };
  const recoverWalletByPhrase = () => {
    if (phrase !== '') {
      dispatch(startLoader())
        .then(async () => {
          let mnemonic = phrase.trim();
          let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
          const account = {
            mnemonic: mnemonicWallet.mnemonic,
            address: mnemonicWallet.address,
            privateKey: mnemonicWallet.privateKey,
          };
          console.log(mnemonicWallet.mnemonic);
          console.log(mnemonicWallet.address);
          console.log(mnemonicWallet.privateKey);
          setWallet(account);
          // dispatch(setUserAuthData(account));
          dispatch(setPasscode(''));
          dispatch(getAddressNonce(account, false))
            .then(() => {
              dispatch(setBackupStatus(true));
            })
            .catch(err => {
              alertWithSingleBtn(translate('wallet.common.tryAgain'));
            });
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
    if (phrase !== '') {
      dispatch(startLoader())
        .then(async () => {
          let private_key = phrase.trim();
          let mnemonicWallet = new ethers.Wallet(private_key);
          console.log('mnemonicWallet',mnemonicWallet);
          const account = {
            mnemonic: mnemonicWallet.mnemonic,
            address: mnemonicWallet.address,
            privateKey: mnemonicWallet.privateKey,
          };
          console.log(mnemonicWallet.mnemonic);
          console.log(mnemonicWallet.address);
          console.log(mnemonicWallet.privateKey);
          setWallet(account);
          // dispatch(setUserAuthData(account));
          dispatch(setPasscode(''));
          dispatch(getAddressNonce(account, false))
            .then(() => {
              dispatch(setBackupStatus(true));
            })
            .catch(err => {
              alertWithSingleBtn(translate('wallet.common.tryAgain'));
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
  }

  const pastePhrase = async () => {
    const text = await Clipboard.getString();
    setPhrase(text);
  };
  const getSuggestions = async val => {
    setTimeout(async () => {
      const response = await axios.get(`https://api.datamuse.com/sug?s=${val}`);
      setSuggestions(response.data);
    }, 100);
  };
  const setPhraseText = val => {
    if (userTyping) {
      var myString = phrase;
      myString = myString.substring(0, myString.lastIndexOf(' '));
      if (myString.lastIndexOf(' ') == -1 && myString.length < 1) {
        const newPhrase = `${val} `;
        setPhrase(newPhrase);
      } else {
        const newPhrase = myString + ` ${val} `;
        setPhrase(newPhrase);
      }
    } else {
      const newPhrase = phrase.trim() + ` ${val} `;
      setPhrase(newPhrase);
    }
    setUserTyping(false);
    setShowSuggestions(false);
  };
  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton/>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.padding}>
              <AppLogo logoStyle={styles.logo} />
              <TextView style={styles.title}>
                {translate('wallet.common.importWallet')}
              </TextView>
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <SelectButtongroup buttons={['Phrase','Private Key']} onButtonPress={(item, index) => {
                  setInputType(index);
                }}/>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  multiline={true}
                  value={phrase}
                  onChangeText={val => {
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
              {keyboard.keyboardShown && showSuggestions && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 0 : hp('1.25%'),
                  }}>
                  <FlatList
                    data={suggestions}
                    horizontal
                    keyboardShouldPersistTaps="always"
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={styles.suggestionContainer}
                        onPress={() => setPhraseText(item.word)}>
                        <Text style={styles.suggestionText}>
                          {item.word}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => `_${index}`}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.bottomView}>
            <AppButton
              label={translate("wallet.common.next")}
              view={!phrase}
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
        <Text style={{color: Colors.townTxt}}>{props.index} </Text>
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
  },
  logo: {
    ...CommonStyles.imageStyles(25),
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
    marginHorizontal: hp("2%"),
    borderRadius: 5,
    borderColor: Colors.borderLightColor3,
    borderWidth: 0.5
  },
  input: {
    fontSize: RF(2),
    color: Colors.black,
    minHeight: hp('20%'),
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
});

export default ImportWallet;
