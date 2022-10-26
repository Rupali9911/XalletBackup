import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppBackground from '../../../components/appBackground';
import AppHeader from '../../../components/appHeader';
import KeyboardAwareScrollView from '../../../components/keyboardAwareScrollView';

import {heightPercentageToDP as hp} from '../../../common/responsiveFunction';
import AppLogo from '../../../components/appLogo';
import {colors} from '../../../res';
import {
  endLoading,
  loginExternalWallet,
  setBackupStatus,
  startLoading,
} from '../../../store/reducer/userReducer';
import {alertWithSingleBtn, maxLength50, validateEmail} from '../../../utils';
import {translate} from '../../../walletUtils';
import {FormButton, InputFields, Label} from './components';
import {getAddress, requestConnectToDApp, signMessage} from './magic-link';
import styles from './styles';
import {SIGN_MESSAGE} from '../../../common/constants';

const LoginCrypto = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.UserReducer);

  const [sessionStart, setSessionStart] = useState(false);

  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    return () => {
      setEmail('');
      setError('');
    };
  }, []);

  const collectWallet = async () => {
    try {
      console.log('🚀 ~ file: login.js ~ line 84 ~ collectWal ~ collectWallet');

      let token = await requestConnectToDApp(email);
      console.log('🚀 ~ file: login.js ~ line 40 ~ collectWal ~ token', token);
      dispatch(startLoading());

      const address = await getAddress();
      const signature = await signMessage(SIGN_MESSAGE).catch(() => {});
      const account = {
        address,
        signature,
        email,
      };
      console.log('🚀 ~ file: login.js ~ line 71 ~  ~ account', account);

      dispatch(loginExternalWallet(account, false))
        .then(() => {
          dispatch(setBackupStatus(true));
          setSessionStart(false);
        })
        .catch(err => {
          console.log('🚀 ~ file: login.js ~ line 86 ~  ~ err', err);
          setSessionStart(false);
          alertWithSingleBtn(translate('wallet.common.tryAgain'));
        });
    } catch (error) {
      console.log('🚀 ~ file: login.js ~ line 62 ~  ~ error', error);
      setSessionStart(false);
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
      setSessionStart(true);
      collectWallet();
    }
  };

  return (
    <AppBackground isBusy={loading}>
      <AppHeader
        showBackButton
        title={translate('wallet.common.loginWithAccount')}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        KeyboardShiftStyle={styles.keyboardShift}>
        <View style={styles.sectionCont}>
          <AppLogo />

          <Label
            label={translate('common.UserLogin')}
            containerStyle={{marginTop: hp(4)}}
          />

          <InputFields
            label={translate('common.emailAddress')}
            inputProps={{
              value: email,
              onChangeText: v => {
                setEmail(v);
                setError('');
              },
              textContentType: 'username',
              autoCompleteType: 'username',
              importantForAutofill: 'yes',
            }}
            error={error}
            inputMainStyle={{marginTop: hp(4)}}
            inputContStyle={{marginTop: hp(3)}}
          />
          <FormButton
            onPress={login}
            disable={!email || sessionStart || loading || error}
            gradient={[colors.themeL, colors.themeR]}
            label={translate('wallet.common.logInSignUp')}
          />
        </View>
      </KeyboardAwareScrollView>
    </AppBackground>
  );
};

export default LoginCrypto;
