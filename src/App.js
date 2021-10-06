import 'react-native-gesture-handler';
import '../shim';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Image, LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject } from 'rxjs';
import * as RNLocalize from "react-native-localize";

import Store from './store';
import { loadAccountKeyFail, loadAccountKeySuccess } from './store/actions/authAction';
import { loadFromAsync } from "./store/reducer/userReducer";

import { Loader } from './components';
import HomeScreen from './screens/homeScreen';
import MyNFTScreen from './screens/myNFTScreen';
import DiscoverScreen from './screens/discoverScreen';
import DetailItemScreen from './screens/detailScreen';
import NewPostScreen from './screens/newPostScreen';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import PayScreen from './screens/payScreen';
import MakeBidScreen from './screens/makeBidScreen';
import ProfileScreen from './screens/profile';
import EditProfileScreen from './screens/edit_profile';
import SettingScreen from './screens/setting';
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
import { setI18nConfig, languageArray } from "./walletUtils";
import { getAllLanguages, setAppLanguage } from "./store/reducer/languageReducer";

import ImageSrc from './constants/Images';
import { images, fonts } from './res';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './common/responsiveFunction';
import AuthStack from './navigations/authStack';
import Colors from './constants/Colors';

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
      <Tab.Screen name={langObj.common.home} component={HomeScreen} />
      {/* <Tab.Screen name={langObj.common.Discover} component={DiscoverScreen} /> */}
      <Tab.Screen name={'Explore'} component={ExploreScreen} />
      {/* <Tab.Screen name={langObj.common.myNFT} component={MyNFTScreen} /> */}
      {/* <Tab.Screen name={'Create'} component={NewPostScreen} /> */}
      <Tab.Screen name={'Wallet'} component={Wallet} />
      {/* <Tab.Screen name={langObj.common.AR} component={ARScreen} /> */}
      {/* <Tab.Screen name={'Certificate'} component={CertificateScreen} /> */}
      <Tab.Screen name={'Connect'} component={Connect} />
      {/* <Tab.Screen name={langObj.common.Connect} component={ConnectScreen} /> */}
      <Tab.Screen name={'Me'} component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {

  const { wallet, loading } = useSelector(state => state.UserReducer);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  const dispatch = useDispatch();

  setI18nConfig(selectedLanguageItem.language_name);

  React.useEffect(async () => {
    LogBox.ignoreAllLogs();
    AsyncStorage.removeItem('@wallet');
    dispatch(getAllLanguages())
    const languageData = await AsyncStorage.getItem('@language', (err) => console.log(err));
    if (languageData) {
      console.log('languageData', languageData);
      dispatch(setAppLanguage(JSON.parse(languageData)));
    } else {
      let item = languageArray.find(item => item.language_name == regionLanguage);
      dispatch(setAppLanguage(item));
    }

    dispatch(loadFromAsync());

  }, []);

  return (
    <>
      {
        loading ?
          <Loader /> :
          <NavigationContainer>
            {wallet ?
              <Stack.Navigator headerMode="none" >
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
      <AppRoutes />
    </Provider>
  )
}

export default App;


