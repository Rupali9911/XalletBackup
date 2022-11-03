import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import AppHeader from '../../components/appHeader';
import AppLogo from '../../components/appLogo';
import TextView from '../../components/appText';
import FetchingIndicator from '../../components/fetchingIndicator';
import HintText from '../../components/hintText';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {
  loginExternalWallet,
  setBackupStatus,
} from '../../store/reducer/userReducer';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';

const VerifyPhrase = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { wallet } = route.params;
  const { userData } = useSelector(state => state.UserReducer);
  const [loading, setLoading] = useState(false);
  const [phrase, setPhrase] = useState([]);
  const [covertWallet, setConvertWallet] = useState([]);
  const [message, setMessage] = useState({ status: '', message: '' });

  useEffect(() => {
    setLoading(true);
    let convertStringToArray = wallet?.mnemonic.split(' ');
    for (let i = convertStringToArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [convertStringToArray[i], convertStringToArray[j]] = [
        convertStringToArray[j],
        convertStringToArray[i],
      ];
    }
    setConvertWallet(convertStringToArray);
    setLoading(false);
  }, []);

  const addSelectedPhrase = (item, index) => {
    let phraseArr = [...phrase, item];
    setPhrase(phraseArr);
    setConvertWallet(covertWallet.filter((value, i) => i != index));
    checkingOrder(phraseArr);
  };

  const removeSelectedPhrase = (item, index) => {
    let phraseArr = phrase.filter((value, i) => i != index);
    setPhrase(phraseArr);
    setConvertWallet([...covertWallet, item]);
    checkingOrder(phraseArr);
  };

  const checkingOrder = phraseArr => {
    let convertStringToArray = wallet?.mnemonic.split(' ');
    let walletListConvert = convertStringToArray.slice(0, phraseArr.length);

    if (phraseArr.length == 0) {
      setMessage({ status: '', message: '' });
      return;
    } else if (walletListConvert.join(' ') !== phraseArr.join(' ')) {
      setMessage({
        status: 'error',
        message: translate('wallet.common.invalidOrder'),
      });
      return;
    }
    if (
      JSON.stringify(walletListConvert) === JSON.stringify(phraseArr) &&
      phraseArr.length === convertStringToArray.length
    ) {
      setMessage({ status: 'success' });
      return;
    } else {
      setMessage({ status: '', message: '' });
      return;
    }
  };

  return (
    <AppBackground>
      {loading && <FetchingIndicator />}
      <AppHeader
        title={translate('wallet.common.backup')}
        showBackButton
        // showRightButton
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
              <AppLogo />
              <TextView style={styles.title}>
                {translate('wallet.common.verifyPhrase')}
              </TextView>
              <HintText style={styles.hint}>
                {translate('wallet.common.verifyHint1') +
                  '\n' +
                  translate('wallet.common.verifyHint2')}
              </HintText>
            </View>

            <View style={styles.phraseMainCont}>
              <View style={styles.selectedPhraseCont}>
                {phrase
                  ? phrase.map((item, index) => {
                    return (
                      <WordView
                        onPress={() => removeSelectedPhrase(item, index)}
                        word={item}
                        index={index + 1}
                        key={`_${index}`}
                      />
                    );
                  })
                  : null}
              </View>
              <View style={styles.bottomMessageCont}>
                <Text
                  style={{
                    marginTop: hp('1%'),
                    textAlign: 'center',
                    color: Colors.danger,
                  }}>
                  {message.message}
                </Text>
              </View>
            </View>

            <View>
              <View style={styles.phraseContainer}>
                {covertWallet
                  ? covertWallet.map((item, index) => {
                    return (
                      <WordView
                        onPress={() => addSelectedPhrase(item, index)}
                        hideNumber={true}
                        word={item}
                        index={index + 1}
                        key={`_${index}`}
                      />
                    );
                  })
                  : null}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.bottomView}>
        <AppButton
          label={translate('wallet.common.next')}
          view={message.status === 'success' ? false : true}
          containerStyle={CommonStyles.button}
          labelStyle={CommonStyles.buttonLabel}
          onPress={() => {
            if (userData) {
              dispatch(setBackupStatus(true));
              navigation.goBack();
            } else {
              if (wallet) {
                setLoading(true);
                dispatch(loginExternalWallet(wallet, true, false))
                  .then(() => {
                    setLoading(false);
                    dispatch(setBackupStatus(true));
                  })
                  .catch(err => {
                    setLoading(false);
                    alertWithSingleBtn(
                      translate('wallet.common.alert'),
                      translate('wallet.common.tryAgain'),
                    );
                  });
              }
            }
          }}
        />
      </View>
    </AppBackground>
  );
};

const WordView = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        styles.word,
        { backgroundColor: !props.hideNumber ? Colors.white : 'transparent' },
      ]}>
      <TextView style={styles.wordTxt}>
        {!props.hideNumber ? (
          <Text style={{ color: Colors.townTxt }}>{props.index} </Text>
        ) : null}
        {props.word}
      </TextView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  hint: {
    marginVertical: hp('2%'),
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
  padding: {
    padding: wp('5%'),
    paddingBottom: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardShift: {
    flex: 1,
  },
  phraseMainCont: {
    backgroundColor: Colors.inputBackground2,
    width: '100%',
    minHeight: hp('22%'),
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedPhraseCont: {
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottomMessageCont: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default VerifyPhrase;
