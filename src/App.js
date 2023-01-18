import {PortalProvider} from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {NativeBaseProvider} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Linking, LogBox, StyleSheet, View} from 'react-native';
import 'react-native-gesture-handler';
import {MenuProvider} from 'react-native-popup-menu';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import '../shim';
import {AppSplash} from './components';
import AlertPopup from './components/AlertModal/AlertModal';
import {default as Images} from './constants/Images';
import {getWallet} from './helpers/AxiosApiRequest';
import MagicLayer from './screens/AuthScreens/nonCryptoAuth/magicLayer';
import Store from './store';
import {setPasscodeAsync, updatePassStatus} from './store/reducer/userReducer';
import {setRequestAppId} from './store/reducer/walletReducer';
import RootStackScreen from './screens/RootStackNavigator/RootStackScreen';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigatorRef = useRef(null);

  const {mainLoader, showSplash} = useSelector(state => state.UserReducer);

  const [pass, setPass] = useState(null);
  const [renderPass, toggle] = useState(false);

  useEffect(async () => {
    LogBox.ignoreAllLogs();
    Linking.addEventListener('url', async ({url}) => {
      if (url && url.includes('xanaliaapp://connect')) {
        let id = url.substring(url.lastIndexOf('/') + 1);
        let wallet = await getWallet();
        if (wallet) {
          setTimeout(() => {
            navigatorRef.current?.navigate('Connect', {appId: id});
          }, 500);
        } else {
          dispatch(setRequestAppId(id));
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('@passcode').then(val => {
      setPass(val);
    });
  }, []);

  const linking = {
    prefixes: ['xanaliaapp://'],
    config: {
      screens: {
        Home: {
          path: '/connect',
          screens: {
            Connect: {
              path: '/:appId',
            },
          },
        },
      },
    },
    getStateFromPath: (path, options) => {
      let id = path.substring(path.lastIndexOf('/') + 1);
      dispatch(setRequestAppId(id));
      // Return a state object here
      // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
    },
    // getPathFromState(state, config) {
    //   // Return a path string here
    //   // You can also reuse the default logic by importing `getPathFromState` from `@react-navigation/native`
    // },
  };

  if (showSplash) return <AppSplash />;

  if (!showSplash) {
    SplashScreen.hide();
    if (!renderPass && pass) {
      dispatch(updatePassStatus(true));
      dispatch(setPasscodeAsync(pass));
      toggle(true);
    }
  }
  if (mainLoader) {
    return (
      <View style={styles.flexCenterAlign}>
        <Image source={Images.loadergif} />
      </View>
    );
  }
  return (
    <NavigationContainer ref={navigatorRef} linking={linking}>
      <RootStackScreen />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <PortalProvider>
        <Provider store={Store}>
          <MenuProvider>
            <AppRoutes />
            <AlertPopup />
            {<MagicLayer />}
          </MenuProvider>
        </Provider>
      </PortalProvider>
    </NativeBaseProvider>
  );
};
export default App;

const styles = StyleSheet.create({
  flexCenterAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
