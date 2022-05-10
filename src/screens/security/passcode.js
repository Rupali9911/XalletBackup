import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Loader, AppHeader } from '../../components';
import styles from './styled';
import { translate } from '../../walletUtils';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../common/responsiveFunction';
import { colors } from '../../res';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setPasscode as SPasscode,
  endMainLoading,
  startMainLoading,
  updateAsyncPasscodeAction,
} from '../../store/reducer/userReducer';
import Toast from 'react-native-toast-message';

const toastConfig = {
  my_custom_type: ({ text1, props, ...rest }) => (
    <View
      style={{
        paddingHorizontal: wp('20%'),
        borderRadius: wp('10%'),
        paddingVertical: hp('2%'),
        backgroundColor: colors.GREY5,
      }}>
      <Text
        style={{ color: colors.white, fontWeight: 'bold', textAlign: 'center' }}>
        {text1}
      </Text>
    </View>
  ),
};

const toastConfigSetting = label => ({
  type: 'my_custom_type',
  text1: label,
  topOffset: hp('10%'),
  visibilityTime: 500,
  autoHide: true,
});

function PasscodeScreen({ route, navigation }) {
  const { screen } = route.params;
  const { passcodeAsync } = useSelector(state => state.UserReducer);

  const [loading, setLoading] = useState(true);
  const [passcode, setpasscode] = useState([]);
  const [reEnterpasscode, setReenterpasscode] = useState([]);
  const [status, setStatus] = useState(false);

  const [oldPasscode, setoldPasscode] = useState('');
  const toastRef = useRef(null);

  const dispatch = useDispatch();
  let numberArr = Array.from({ length: 9 }, (_, i) => i + 1);
  numberArr.push(0);
  numberArr.push('');

  const goBackFunc = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (screen == 'active' && passcodeAsync) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    } else {
      BackHandler.removeEventListener('hardwareBackPress', () => {
        return false;
      });
    }

    if (screen == 'security') {
      BackHandler.addEventListener('hardwareBackPress', goBackFunc);
    }

    if (passcodeAsync) {
      setStatus(true);
      setoldPasscode(passcodeAsync);
    }
    setLoading(false);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => {
        return true;
      });
      BackHandler.removeEventListener('hardwareBackPress', goBackFunc);
    };
  }, []);

  useEffect(() => {
    if (screen == 'active' && passcodeAsync) {
      navigation.setOptions({
        gestureEnabled: false
      })
    }
  }, [passcode])

  const addItem = v => {
    let active = status
      ? 'passcode'
      : passcode.length === 6
        ? 'reEnter'
        : 'passcode';
    let pass = active == 'passcode' ? [...passcode] : [...reEnterpasscode];
    if (pass.length < 7) {
      pass.push(String(v));
      if (pass.length > 6) return;
      active == 'passcode' ? setpasscode(pass) : setReenterpasscode(pass);

      if (pass.length == 6) {
        if (status) {
          if (screen == 'security') {
            if (pass.join('') == oldPasscode) {
              dispatch(updateAsyncPasscodeAction(''));
              AsyncStorage.removeItem('@passcode');
              navigation.goBack();
            } else {
              toastRef.current.show(
                toastConfigSetting(
                  `${translate(
                    'wallet.common.error.passcodeError2',
                  )}${'\n'}${translate('wallet.common.error.passcodeError3')}`,
                ),
              );
              setpasscode([]);
            }
          } else if (screen === 'active') {
            // this will run when application close and reOpen

            if (pass.join('') == oldPasscode) {
              navigation.goBack()
            } else {
              toastRef.current.show(
                toastConfigSetting(
                  `${translate(
                    'wallet.common.error.passcodeError2',
                  )}${'\n'}${translate('wallet.common.error.passcodeError3')}`,
                ),
              );
              setpasscode([]);
            }
          } else {
            // this will run when application kill and restart
            if (pass.join('') == oldPasscode) {
              dispatch(startMainLoading());
              dispatch(SPasscode(''));

              setTimeout(() => {
                dispatch(endMainLoading());
              }, 1000);
            } else {
              toastRef.current.show(
                toastConfigSetting(
                  `${translate(
                    'wallet.common.error.passcodeError2',
                  )}${'\n'}${translate('wallet.common.error.passcodeError3')}`,
                ),
              );
              setpasscode([]);
            }
          }
        } else {
          if (active === 'reEnter') {
            if (passcode.join('') == pass.join('')) {
              AsyncStorage.setItem('@passcode', pass.join(''));
              dispatch(updateAsyncPasscodeAction(pass.join('')));
              dispatch(SPasscode(''));
              navigation.goBack();
            } else {
              toastRef.current.show(
                toastConfigSetting(
                  translate('wallet.common.error.passcodeError1'),
                ),
              );
              setReenterpasscode([]);
            }
          }
        }
      }
    }
  };

  const removeItem = () => {
    let active = status
      ? 'passcode'
      : passcode.length === 6
        ? 'reEnter'
        : 'passcode';

    let pass = active == 'passcode' ? [...passcode] : [...reEnterpasscode];

    pass.pop();
    active == 'passcode' ? setpasscode(pass) : setReenterpasscode(pass);
  };

  let label = status
    ? translate('wallet.common.enterPasscode1')
    : passcode.length === 6
      ? translate('wallet.common.enterPasscode2')
      : translate('wallet.common.enterPasscode');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <AppHeader
            title={''}
            showBackButton={screen == 'security' ? true : false}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.circleCont}>
              {[...Array(6).keys()].map((v, i) => {
                let active = status
                  ? passcode
                  : passcode.length === 6
                    ? reEnterpasscode
                    : passcode;

                return (
                  <View
                    key={i}
                    style={[
                      styles.circle,
                      {
                        backgroundColor: active[i]
                          ? colors.themeR
                          : colors.white,
                      },
                    ]}
                  />
                );
              })}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.sep} />

            <View style={{ ...styles.keypadCont }}>
              {numberArr.map((v, i) => {
                if (v === '') {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => removeItem()}
                      style={styles.keypadItem}>
                      <Icon name="backspace-outline" size={RF(2.5)} />
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => addItem(v)}
                    style={styles.keypadItem}>
                    <Text style={styles.keypadFont}>{v}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}
      <Toast config={toastConfig} ref={toastRef} />
    </SafeAreaView>
  );
}

export default PasscodeScreen;
