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
const RecoveryPhrase = ({route, navigation}) => {
  const dispatch = useDispatch();
  const keyboard = useKeyboard();
  const {loading} = useSelector(state => state.UserReducer);
  const {recover} = route.params;
  const [wallet, setWallet] = useState(route.params.wallet);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [phrase, setPhrase] = useState('');
//  const [phrase, setPhrase] = useState("deputy miss kitten kiss episode humor chunk surround know omit disease elder");
  // const [phrase, setPhrase] = useState("tongue grit volume hope rely weird run mixture identify charge then camp");
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
  const recoverWallet = () => {
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
          dispatch(setPasscode(''));
          dispatch(getAddressNonce(account, false, false))
            .then(() => {
              dispatch(setBackupStatus(true));
            })
            .catch(err => {
              alertWithSingleBtn(
                translate('wallet.common.alert'),
                translate('wallet.common.tryAgain'),
              );
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
  const pastePhrase = async () => {
    const text = await Clipboard.getString();
    setPhrase(text);
  };
  const getSuggestions = async val => {
    const response = await axios.get(`https://api.datamuse.com/sug?s=${val}`);
    setSuggestions(response.data);
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
      <AppHeader
        showBackButton
        title={translate('wallet.common.backup')}
        showRightButton
        rightButtonComponent={
          <IconButton
            icon={ImagesSrc.infoIcon}
            color={Colors.labelButtonColor}
            size={20}
          />
        }
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.padding}>
              <AppLogo/>
              <TextView style={styles.title}>
                {translate('wallet.common.yourPhrase')}
              </TextView>
              <HintText style={styles.hint}>
                {recover
                  ? translate('wallet.common.recoveryPhraseInfo')
                  : translate('wallet.common.phraseSaveInfo')}
              </HintText>
            </View>
            <View>
              {recover ? (
                <View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      multiline={true}
                      value={phrase}
                      autoCorrect={false}
                      keyboardType= {Platform.OS === 'ios' ? 'default' : 'visible-password'}
                      onChangeText={val => {
                        setPhrase(val);
                        const newWord = val.split(' ').splice(-1);
                        if (newWord != '') {
                          getSuggestions(newWord);
                          setShowSuggestions(true);
                          setUserTyping(true);
                        } else {
                          setShowSuggestions(false);
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
                      <Text style={{color: Colors.themeColor}}>
                        {translate('wallet.common.paste')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {keyboard.keyboardShown && showSuggestions && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: Platform.OS === 'ios' ? 0 : hp('1.25%'),
                        backgroundColor: Colors.inputBackground2,
                      }}>
                      <FlatList
                        data={suggestions}
                        horizontal
                        keyboardShouldPersistTaps="always"
                        renderItem={({item, index}) => (
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
              ) : (
                <View style={styles.phraseContainer}>
                  {wallet
                    ? wallet.mnemonic.phrase.split(' ').map((item, index) => {
                        return (
                          <WordView
                            word={item}
                            index={index + 1}
                            key={`_${index}`}
                          />
                        );
                      })
                    : null}
                </View>
              )}
            </View>
            <View style={styles.rowPadding}>
              {recover
                ? null
                : wallet && (
                    <Button
                      mode={'text'}
                      uppercase={false}
                      color={Colors.labelButtonColor}
                      onPress={() => {
                        copyToClipboard();
                      }}>
                      {translate('wallet.common.copy')}
                    </Button>
                  )}
              {recover ? null : (
                <View style={styles.alertContainer}>
                  <View style={styles.alert}>
                    <IconButton
                      icon={ImagesSrc.dangerIcon}
                      color={Colors.alertText}
                      size={20}
                    />
                    <TextView style={styles.alertTxt}>
                      {translate('wallet.common.phraseNote')}
                    </TextView>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.bottomView}>
            <AppButton
              label={
                recover
                  ? translate('wallet.common.import')
                  : translate('wallet.common.next')
              }
              view={recover ? !recover : !wallet}
              containerStyle={CommonStyles.button}
              labelStyle={CommonStyles.buttonLabel}
              onPress={() => {
                if (/\s\s+/g.test(phrase.trim())) {
                  alertWithSingleBtn(
                    translate('wallet.common.verification'),
                    translate('wallet.common.error.invalidPhrase'),
                  );
                } else {
                  if (recover) {
                    recoverWallet();
                  } else {
                    // dispatch(setUserAuthData(wallet, true));
                    navigation.replace('verifyPhrase', {wallet});
                  }
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
  title: {
    alignSelf: 'center',
    fontSize: RF(2.7),
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: wp('5%'),
    paddingBottom: 0,
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
    backgroundColor: Colors.inputBackground2,
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
    flexGrow: 1
  },
  keyboardShift: {
    flex: 1
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
export default RecoveryPhrase;
