import {PortalProvider} from '@gorhom/portal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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
import WebView from './components/WebView';
import {default as Images} from './constants/Images';
import {screenWidth} from './constants/responsiveFunct';
import {getWallet} from './helpers/AxiosApiRequest';
import AuthStack from './navigations/authStack';
import ChatDetail from './screens/AiChat/ChatDetail';
import ArtistDetail from './screens/ArtistDetail';
import MagicLayer from './screens/AuthScreens/nonCryptoAuth/magicLayer';
import RecoveryPhrase from './screens/AuthScreens/recoveryPhrase';
import VerifyPhrase from './screens/AuthScreens/verifyPhrase';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import ChangePassword from './screens/changePassword';
import CollectionDetail from './screens/collectionDetail';
import ScanToConnect from './screens/connect/scanToConnect';
import CreateNFTScreen from './screens/createNFTScreen';
import DetailItemScreen from './screens/detailScreen';
import EditProfileScreen from './screens/edit_profile';
import MakeBidScreen from './screens/makeBidScreen';
import AddCard from './screens/PaymentScreen/addCard';
import Cards from './screens/PaymentScreen/cards';
import WalletPay from './screens/PaymentScreen/walletPay';
import PayScreen from './screens/payScreen';
import ProfileScreen from './screens/profile';
import SecurityScreen from './screens/security';
import PasscodeScreen from './screens/security/passcode';
import SellNFT from './screens/sellNft/index';
import Setting from './screens/setting';
import Receive from './screens/wallet/receive';
import Send from './screens/wallet/send';
import TokenDetail from './screens/wallet/tokenDetail';
import transactionsDetail from './screens/wallet/transactionsDetail';
import Store from './store';
import {setPasscodeAsync, updatePassStatus} from './store/reducer/userReducer';
import {setRequestAppId} from './store/reducer/walletReducer';
import TabComponent from './screens/RootStackNavigator/BottomTabNavigator';

const Stack = createStackNavigator();

const AppRoutes = () => {
  const dispatch = useDispatch();
  const navigatorRef = useRef(null);

  const {passcode, mainLoader, showSplash, userData} = useSelector(
    state => state.UserReducer,
  );

  const [pass, setPass] = useState(null);
  const [renderPass, toggle] = useState(false);

  let initialRoute = passcode ? 'PasscodeScreen' : 'Home';

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
      dispatch(setPasscodeAsync(JSON.parse(pass)));
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
      {userData ? (
        <Stack.Navigator
          initialRouteName={initialRoute}
          headerMode="none"
          screenOptions={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
            transitionSpec: {
              open: {
                animation: 'timing',
                duration: 1000,
              },
              close: {
                animation: 'timing',
                duration: 1000,
              },
            },
            gestureResponseDistance: {horizontal: (screenWidth * 70) / 100},
          }}>
          <Stack.Screen name="Home" component={TabComponent} />
          <Stack.Screen
            name="PasscodeScreen"
            initialParams={{screen: 'Auth'}}
            component={PasscodeScreen}
          />
          <Stack.Screen name="DetailItem" component={DetailItemScreen} />
          <Stack.Screen
            name="CertificateDetail"
            component={CertificateDetailScreen}
          />
          <Stack.Screen name="Pay" component={PayScreen} />
          <Stack.Screen name="MakeBid" component={MakeBidScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="tokenDetail" component={TokenDetail} />
          <Stack.Screen name="receive" component={Receive} />
          <Stack.Screen
            name="transactionsDetail"
            component={transactionsDetail}
          />
          <Stack.Screen name="send" component={Send} />
          <Stack.Screen name="scanToConnect" component={ScanToConnect} />
          <Stack.Screen name="Create" component={CreateNFTScreen} />
          <Stack.Screen name="Certificate" component={CertificateScreen} />
          <Stack.Screen name="ArtistDetail" component={ArtistDetail} />
          <Stack.Screen name="AddCard" component={AddCard} />
          <Stack.Screen name="Cards" component={Cards} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
          <Stack.Screen name="WalletPay" component={WalletPay} />
          <Stack.Screen name="recoveryPhrase" component={RecoveryPhrase} />
          <Stack.Screen name="verifyPhrase" component={VerifyPhrase} />
          <Stack.Screen name="sellNft" component={SellNFT} />
          <Stack.Screen name="CollectionDetail" component={CollectionDetail} />
          {/* <Stack.Screen name="AiChat" component={AiChat} /> */}
          <Stack.Screen name="ChatDetail" component={ChatDetail} />
          <Stack.Screen name="WebView" component={WebView} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Authentication" component={AuthStack} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

// export const Events = new Subject();

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
