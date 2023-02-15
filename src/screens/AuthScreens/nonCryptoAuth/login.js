import React, {useEffect, useState} from 'react';
import {BackHandler, Keyboard, View} from 'react-native';
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
import {maxLength50, validateEmail} from '../../../utils';
import {modalAlert} from '../../../common/function';
import {translate} from '../../../walletUtils';
import {InputFields} from './components';
import {getAddress, requestConnectToDApp, signMessage, requestDisconnectDApp}  from './magic-link';
import styles from './styles';
import {SIGN_MESSAGE} from '../../../common/constants';
import TextView from '../../../components/appText';
import AppButton from '../../../components/appButton';
import CommonStyles from '../../../constants/styles';

const LoginCrypto = ({navigation}) => {
  const dispatch = useDispatch();
  const {loading, magicLoading} = useSelector(state => state.UserReducer);

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [loginBtnEnable, setLoginBtnEnable] = useState(true);

  useEffect(() => {
    return () => {
      setEmail('');
      setError('');
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (loginBtnEnable) {
        return false;
      } else {
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [loginBtnEnable]);

  const collectWallet = async timeout => {
    try {
      Keyboard.dismiss();
      await requestDisconnectDApp();
      let token = await requestConnectToDApp(email);
      if (token) {
        dispatch(startLoading());
      }

      const address = await getAddress();
      const signature = await signMessage(SIGN_MESSAGE).catch(() => {});
      const account = {
        address,
        signature,
        email,
      };

      dispatch(loginExternalWallet(account, false))
        .then(() => {
          dispatch(setBackupStatus(true));
          dispatch(endMagicLoading());
          setLoginBtnEnable(true);
        })
        .catch(err => {
          dispatch(endMagicLoading());
          setLoginBtnEnable(true);
          modalAlert(translate('wallet.common.tryAgain'));
        });
    } catch (error) {
      setLoginBtnEnable(true);
      clearTimeout(timeout);
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
      setLoginBtnEnable(false);
      const magicTimeout = setTimeout(() => {
        dispatch(startMagicLoading());
      }, 10000);
      collectWallet(magicTimeout);
    }
  };

  const loginButtonEnabled =
    !email || magicLoading || loading || error || !loginBtnEnable;

  return (
    <AppBackground isBusy={loading}>
      <AppHeader showBackButton />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.sectionCont}>
          <View style={styles.contentContainer}>
          <View style={styles.padding}>
            <AppLogo />
            <TextView style={styles.title}>
              {translate('common.loginWithEmail')}
            </TextView>
            </View>
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
            view={loginButtonEnabled}
          />
        </View>
      </KeyboardAwareScrollView>
    </AppBackground>
  );
};

export default LoginCrypto;
