import 'react-native-gesture-handler';
import '../shim';

import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Image, LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject } from 'rxjs';
import * as RNLocalize from "react-native-localize";
import { StripeProvider } from '@stripe/stripe-react-native';

import Store from './store';
import { loadAccountKeyFail, loadAccountKeySuccess } from './store/actions/authAction';
import { loadFromAsync, setPasscode, startLoading } from "./store/reducer/userReducer";
import { Loader } from './components';
import HomeScreen from './screens/homeScreen';
import SecurityScreen from './screens/security';
import PasscodeScreen from './screens/security/passcode';
import MyNFTScreen from './screens/myNFTScreen';
import DiscoverScreen from './screens/discoverScreen';
import DetailItemScreen from './screens/detailScreen';
import NewPostScreen from './screens/newPostScreen';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import ChangePassword from './screens/changePassword';
import PayScreen from './screens/payScreen';
import MakeBidScreen from './screens/makeBidScreen';
import ProfileScreen from './screens/profile';
import EditProfileScreen from './screens/edit_profile';
import Setting from './screens/setting';
import ArtistDetail from './screens/ArtistDetail';
import ExploreScreen from './screens/explore';
import Wallet from './screens/wallet';
import TokenDetail from './screens/wallet/tokenDetail';
import Receive from './screens/wallet/receive';
import Send from './screens/wallet/send';
import Connect from './screens/connect';
import ScanToConnect from './screens/connect/scanToConnect';
import getLanguage from './utils/languageSupport';
const langObj = getLanguage();
import { setI18nConfig, languageArray, environment } from "./walletUtils";
import { getAllLanguages, setAppLanguage } from "./store/reducer/languageReducer";

import ImageSrc from './constants/Images';
import { images, fonts } from './res';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './common/responsiveFunction';
import AuthStack from './navigations/authStack';
import Colors from './constants/Colors';
import AddCard from './screens/PaymentScreen/addCard';
import Cards from './screens/PaymentScreen/cards';
import BuyGold from './screens/PaymentScreen/buyGold';
import { translate } from './walletUtils';
import { screenWidth } from './constants/responsiveFunct';
import WalletPay from './screens/PaymentScreen/walletPay';

export const regionLanguage = RNLocalize.getLocales()
  .map((a) => a.languageCode)
  .values()
  .next().value;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabComponent = () => {
  return (
    <Tab.Navigator tabBarOptions={{
      labelStyle: {
        fontSize: 12,
        fontFamily: fonts.SegoeUIRegular,
      },
      tabStyle: {
        paddingVertical: hp('0.6%')
      },
      activeTintColor: Colors.themeColor
    }} screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === langObj.common.home) {
          iconName = focused ? images.icons.homeA : images.icons.homeD;
        } else if (route.name === 'Create') {
          iconName = focused ? images.icons.createA : images.icons.createD;
        } else if (route.name === 'Explore') {
          iconName = focused ? images.icons.exploreA : images.icons.exploreD;
        } else if (route.name === 'Certificate') {
          iconName = focused ? images.icons.certificateA : images.icons.certificateD;
        } else if (route.name === 'Me') {
          iconName = focused ? images.icons.meA : images.icons.meD;
        } else if (route.name === 'Wallet') {
          iconName = focused ? ImageSrc.walletActive : ImageSrc.wallet;
        } else if (route.name === 'Connect') {
          iconName = ImageSrc.connect;
        }

        // You can return any component that you like here!
        return <Image source={iconName} resizeMode="contain" style={{ width: wp('6.5%'), height: wp('4.5%'), tintColor: color }} />;
      },
    })} >
      <Tab.Screen
        name={langObj.common.home}
        component={HomeScreen}
        options={{ tabBarLabel: translate("common.collected") }}
      />
      {/* <Tab.Screen name={langObj.common.Discover} component={DiscoverScreen} /> */}
      <Tab.Screen
        name={'Explore'}
        component={ExploreScreen}
        options={{ tabBarLabel: translate("wallet.common.explore") }}
      />
      {/* <Tab.Screen name={langObj.common.myNFT} component={MyNFTScreen} /> */}
      {/* <Tab.Screen name={'Create'} component={NewPostScreen} /> */}
      <Tab.Screen
        name={'Wallet'}
        options={{ tabBarLabel: translate("wallet.common.wallet") }}
        component={Wallet}
      />
      {/* <Tab.Screen name={langObj.common.AR} component={ARScreen} /> */}
      {/* <Tab.Screen name={'Certificate'} component={CertificateScreen} /> */}
      <Tab.Screen
        name={'Connect'}
        options={{ tabBarLabel: translate("wallet.common.connect") }}
        component={Connect}
      />
      {/* <Tab.Screen name={langObj.common.Connect} component={ConnectScreen} /> */}
      <Tab.Screen
        options={{ tabBarLabel: translate("wallet.common.me") }}
        name={'Me'}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {

  const { wallet, passcode, loading } = useSelector(state => state.UserReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  const dispatch = useDispatch();


  setI18nConfig(selectedLanguageItem.language_name);

  React.useEffect(async () => {
    LogBox.ignoreAllLogs();
    dispatch(startLoading());

    dispatch(getAllLanguages())
    // AsyncStorage.removeItem('@wallet')
    let pass = await AsyncStorage.getItem("@passcode");
    const languageData = await AsyncStorage.getItem('@language', (err) => console.log(err));
    if (pass) {
      dispatch(setPasscode(pass))
      dispatch(loadFromAsync())
    } else {
      dispatch(loadFromAsync())
    }
    if (languageData) {
      console.log('languageData', languageData);
      dispatch(setAppLanguage(JSON.parse(languageData)));
    } else {
      console.log('regionLanguage', regionLanguage)
      let item = languageArray.find(item => item.language_name == regionLanguage);
      dispatch(setAppLanguage(item));
    }

  }, []);


  let initialRoute = passcode ? "PasscodeScreen" : "Home"

  console.log(loading, "initialRoute", initialRoute)
  return (
    <>
      {
        loading ?
          <Loader /> :
          <NavigationContainer>
            {
              wallet ?
                  <Stack.Navigator initialRouteName={initialRoute} headerMode="none" screenOptions={{ gestureResponseDistance: { horizontal: screenWidth * 70 / 100 } }}>
                    <Stack.Screen name='PasscodeScreen' initialParams={{ updateToggle: null, screen: "Auth" }} component={PasscodeScreen} />
                    <Stack.Screen name="Home" component={TabComponent} />
                    <Stack.Screen name="DetailItem" component={DetailItemScreen} />
                    <Stack.Screen name="CertificateDetail" component={CertificateDetailScreen} />
                    <Stack.Screen name="Pay" component={PayScreen} />
                    <Stack.Screen name="MakeBid" component={MakeBidScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    <Stack.Screen name="tokenDetail" component={TokenDetail} />
                    <Stack.Screen name="receive" component={Receive} />
                    <Stack.Screen name="send" component={Send} />
                    <Stack.Screen name="scanToConnect" component={ScanToConnect} />
                    <Stack.Screen name='Create' component={NewPostScreen} />
                    <Stack.Screen name='Certificate' component={CertificateScreen} />
                    <Stack.Screen name='ArtistDetail' component={ArtistDetail} />
                    <Stack.Screen name='AddCard' component={AddCard} />
                    <Stack.Screen name='Cards' component={Cards} />
                    <Stack.Screen name='BuyGold' component={BuyGold} />
                    <Stack.Screen name='Setting' component={Setting} />
                    <Stack.Screen name='ChangePassword' component={ChangePassword} />
                    <Stack.Screen name='SecurityScreen' component={SecurityScreen} />
                    <Stack.Screen name='WalletPay' component={WalletPay} />
                  </Stack.Navigator>
                  :
                  <Stack.Navigator headerMode="none">
                    <Stack.Screen name="Authentication" component={AuthStack} />
                  </Stack.Navigator>
            }
          </NavigationContainer>

      }
    </>
  );
}

export const Events = new Subject();

const App = () => {
  return (
    <Provider store={Store}>
      <StripeProvider
        publishableKey={environment.stripeKey.p_key}
        urlScheme="xanalia" // required for 3D Secure and bank redirects
        merchantIdentifier="merchant.com.xanalia" // required for Apple Pay
      >
        <AppRoutes />
      </StripeProvider>
    </Provider>
  )
}

export default App;
