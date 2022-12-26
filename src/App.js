import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useState, useEffect, useRef} from 'react';
import {Image, Keyboard, Linking, LogBox, StyleSheet, View} from 'react-native';
import 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import SplashScreen from 'react-native-splash-screen';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {Subject} from 'rxjs';
import '../shim';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from './common/responsiveFunction';
import {AppSplash} from './components';
import Colors from './constants/Colors';
import ImageSrc from './constants/Images';
import {screenWidth} from './constants/responsiveFunct';
import AuthStack from './navigations/authStack';
import {fonts, images} from './res';
import ArtistDetail from './screens/ArtistDetail';
import RecoveryPhrase from './screens/AuthScreens/recoveryPhrase';
import VerifyPhrase from './screens/AuthScreens/verifyPhrase';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import ChangePassword from './screens/changePassword';
import Connect from './screens/connect';
import ScanToConnect from './screens/connect/scanToConnect';
import CreateNFTScreen from './screens/createNFTScreen';
import DetailItemScreen from './screens/detailScreen';
import EditProfileScreen from './screens/edit_profile';
import Discover from './screens/discover';
import HomeScreen from './screens/homeScreen';
import MakeBidScreen from './screens/makeBidScreen';
import AddCard from './screens/PaymentScreen/addCard';
import Cards from './screens/PaymentScreen/cards';
import WalletPay from './screens/PaymentScreen/walletPay';
import PayScreen from './screens/payScreen';
import ProfileScreen from './screens/profile';
import SecurityScreen from './screens/security';
import PasscodeScreen from './screens/security/passcode';
import Setting from './screens/setting';
import Wallet from './screens/wallet';
import Receive from './screens/wallet/receive';
import Send from './screens/wallet/send';
import TokenDetail from './screens/wallet/tokenDetail';
import transactionsDetail from './screens/wallet/transactionsDetail';
import SellNFT from './screens/sellNft/index';
import CollectionDetail from './screens/collectionDetail';
import Store from './store';
import {setRequestAppId} from './store/reducer/walletReducer';
import {environment, translate} from './walletUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getWallet} from './helpers/AxiosApiRequest';
import {setPasscodeAsync, updatePassStatus} from './store/reducer/userReducer';
import {MenuProvider} from 'react-native-popup-menu';
import {NativeBaseProvider} from 'native-base';
import Images from './constants/Images';
import AiChat from './screens/AiChat';
import ChatDetail from './screens/AiChat/ChatDetail';
import WebView from './components/WebView';
import MagicLayer from './screens/AuthScreens/nonCryptoAuth/magicLayer';
import AlertPopup from './components/AlertModal/AlertModal';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const deepLinkData = {
  url: 'xanalia://',
  param: '0165782121489',
};

const TabComponent = () => {
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const {showSuccess, isCreate, connectModalState} = useSelector(
    state => state.UserReducer,
  );
  const [isBottomTabVisible, setIsBottomTabVisible] = useState(true);

  useEffect(() => {
    if (showSuccess || isCreate || connectModalState) {
      setIsBottomTabVisible(false);
    } else {
      setIsBottomTabVisible(true);
    }
  }, [showSuccess, isCreate, connectModalState]);

  useEffect(() => {}, [selectedLanguageItem.language_name]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsBottomTabVisible(false); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsBottomTabVisible(true); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 12,
          fontFamily: fonts.SegoeUIRegular,
          paddingTop: hp('0.75%'),
        },
        tabStyle: {
          paddingVertical: hp('1%'),
        },
        activeTintColor: Colors.themeColor,
      }}
      screenOptions={({route}) => ({
        tabBarVisible: isBottomTabVisible,
        tabBarIcon: ({focused, color}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? images.icons.homeA : images.icons.homeD;
          } else if (route.name === 'Create') {
            iconName = focused ? images.icons.createA : images.icons.createD;
          } else if (route.name === 'Discover') {
            iconName = focused ? images.icons.exploreA : images.icons.exploreD;
          } else if (route.name === 'Certificate') {
            iconName = focused
              ? images.icons.certificateA
              : images.icons.certificateD;
          } else if (route.name === 'Me') {
            iconName = focused ? images.icons.meA : images.icons.meD;
          } else if (route.name === 'Wallet') {
            iconName = focused ? ImageSrc.walletActive : ImageSrc.wallet;
          } else if (route.name === 'AiChat') {
            iconName = focused ? ImageSrc.chatActive : ImageSrc.chat;
          } else if (route.name === 'Connect') {
            iconName = focused ? ImageSrc.connectA : ImageSrc.connect;
          }

          // You can return any component that you like here!
          return (
            <Image
              source={iconName}
              resizeMode="contain"
              style={{width: wp('6.5%'), height: wp('4.5%')}}
            />
          );
        },
      })}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={{tabBarLabel: translate('common.home')}}
      />
      <Tab.Screen
        name={'Discover'}
        component={Discover}
        options={{tabBarLabel: translate('wallet.common.explore')}}
      />
      {userData.isNonCrypto === 0 && (
        <Tab.Screen
          name={'Wallet'}
          options={{tabBarLabel: translate('wallet.common.wallet')}}
          component={Wallet}
        />
      )}
      {/* <Tab.Screen
        name={'Connect'}
        options={{tabBarLabel: translate('wallet.common.connect')}}
        component={Connect}
        initialParams={{}}
      /> */}
      <Tab.Screen
        name={'AiChat'}
        component={AiChat}
        options={{tabBarLabel: translate('common.chat')}}
      />
      <Tab.Screen
        options={{tabBarLabel: translate('wallet.common.me')}}
        name={'Me'}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const AppRoutes = () => {
  const {passcode, mainLoader, showSplash, userData} = useSelector(
    state => state.UserReducer,
  );
  const dispatch = useDispatch();
  const navigatorRef = useRef(null);
  let initialRoute = passcode ? 'PasscodeScreen' : 'Home';
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
      console.log('path', path);
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

export const Events = new Subject();

const App = () => {
  return (
    <NativeBaseProvider>
      <Provider store={Store}>
        <MenuProvider>
          <AppRoutes />
          <AlertPopup />
          {<MagicLayer />}
        </MenuProvider>
      </Provider>
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
