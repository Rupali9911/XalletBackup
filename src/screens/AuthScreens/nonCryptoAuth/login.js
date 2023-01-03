import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import KeyboardAwareScrollView from '../../../components/keyboardAwareScrollView';

import {heightPercentageToDP as hp} from '../../../common/responsiveFunction';
import AppLogo from '../../../components/appLogo';
import {
  endLoading,
  endMagicLoading,
  loginExternalWallet,
  setBackupStatus,
  startLoading,
  startMagicLoading,
} from '../../../store/reducer/userReducer';
import {alertWithSingleBtn, maxLength50, validateEmail} from '../../../utils';
import {translate} from '../../../walletUtils';
import {InputFields} from './components';
import {getAddress, requestConnectToDApp, signMessage} from './magic-link';
import styles from './styles';
import {SIGN_MESSAGE} from '../../../common/constants';
import TextView from '../../../components/appText';
import AppButton from '../../../components/appButton';
import CommonStyles from '../../../constants/styles';

const LoginCrypto = () => {
  const dispatch = useDispatch();
  const {loading, magicLoading} = useSelector(state => state.UserReducer);

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [btnEnable, setBtnEnable] = useState(true);

  useEffect(() => {
    return () => {
      setEmail('');
      setError('');
    };
  }, []);

  const collectWallet = async myTimeout => {
    try {
      // console.log('🚀 ~ file: login.js ~ line 84 ~ collectWal ~ collectWallet');

      let token = await requestConnectToDApp(email);
      // console.log('🚀 ~ file: login.js ~ line 40 ~ collectWal ~ token', token);
      dispatch(startLoading());

      const address = await getAddress();
      const signature = await signMessage(SIGN_MESSAGE).catch(() => {});
      const account = {
        address,
        signature,
        email,
      };
      // console.log('🚀 ~ file: login.js ~ line 71 ~  ~ account', account);

      dispatch(loginExternalWallet(account, false))
        .then(() => {
          dispatch(setBackupStatus(true));
          dispatch(endMagicLoading());
          setBtnEnable(true);
        })
        .catch(err => {
          console.log('🚀 ~ file: login.js ~ line 86 ~  ~ err', err);
          dispatch(endMagicLoading());
          setBtnEnable(true);
          alertWithSingleBtn(translate('wallet.common.tryAgain'));
        });
    } catch (error) {
      console.log('🚀 ~ file: login.js ~ line 62 ~  ~ error', error);
      setBtnEnable(true);
      clearTimeout(myTimeout);
      dispatch(endMagicLoading());
      dispatch(endLoading());
    }
  };

  const login = () => {
    const validate = validateEmail(email);
    const emailLength = maxLength50(email);
    if (validate) {
      setError(validate);
    } else if (emailLength) {
      setError(emailLength);
    } else {
      setBtnEnable(false);
      const myTimeout = setTimeout(() => {
        dispatch(startMagicLoading());
      }, 10000);
      collectWallet(myTimeout);
    }
  };

  const buttonEnabled =
    !email || magicLoading || loading || error || !btnEnable;

  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.sectionCont}>
          <View style={styles.contentContainer}>
            <AppLogo />
            <TextView style={styles.title}>
              {translate('common.loginWithEmail')}
            </TextView>
          </View>

          <InputFields
            // label={translate('common.emailAddress')}
            inputProps={{
              value: email,
              onChangeText: v => {
                setEmail(v);
                setError('');
              },
              textContentType: 'username',
              autoCompleteType: 'username',
              importantForAutofill: 'yes',
              placeholder: translate('common.PLACEHOLDER_EMAIL'),
            }}
            error={error}
            inputMainStyle={{marginTop: hp(6)}}
            inputContStyle={{marginTop: hp(5)}}
          />
          <AppButton
            label={translate('wallet.common.logInSignUp')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => login()}
            view={buttonEnabled}
          />
        </View>
      </KeyboardAwareScrollView>
    </AppBackground>
  );
};

export default LoginCrypto;
