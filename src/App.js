import 'react-native-gesture-handler';
import '../shim';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Image, LogBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Store from './store';
import { loadAccountKeyFail, loadAccountKeySuccess } from './store/actions/authAction';
import { Loader } from './components';

import HomeScreen from './screens/homeScreen';
import MyNFTScreen from './screens/myNFTScreen';
import DiscoverScreen from './screens/discoverScreen';
import ARScreen from './screens/ARScreen';
import ConnectScreen from './screens/connectScreen';
import DetailItemScreen from './screens/detailScreen';
import NewPostScreen from './screens/newPostScreen';
import CertificateScreen from './screens/certificateScreen';
import CertificateDetailScreen from './screens/certificateScreen/detail';
import PayScreen from './screens/payScreen';
import MakeBidScreen from './screens/makeBidScreen';
import ProfileScreen from './screens/profile';
import EditProfileScreen from './screens/edit_profile';
import SettingScreen from './screens/setting';
import WalletConnectScreen from './screens/walletconnect';
import ViroARScreen from './viro';
import ExploreScreen from './screens/explore';
import getLanguage from './utils/languageSupport';
const langObj = getLanguage();

import { images, fonts } from './res';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './common/responsiveFunction';

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
      }
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
        }

        // You can return any component that you like here!
        return <Image source={iconName} resizeMode="contain" style={{ width: wp('6.5%'), height: wp('4.5%') }} />;
      },
    })} >
      <Tab.Screen name={langObj.common.home} component={HomeScreen} />
      {/* <Tab.Screen name={langObj.common.Discover} component={DiscoverScreen} /> */}
      <Tab.Screen name={'Explore'} component={ExploreScreen} />
      {/* <Tab.Screen name={langObj.common.myNFT} component={MyNFTScreen} /> */}
      <Tab.Screen name={'Create'} component={NewPostScreen} />
      {/* <Tab.Screen name={langObj.common.AR} component={ARScreen} /> */}
      <Tab.Screen name={'Certificate'} component={CertificateScreen} />
      {/* <Tab.Screen name={langObj.common.Connect} component={ConnectScreen} /> */}
      <Tab.Screen name={'Me'} component={WalletConnectScreen} />
    </Tab.Navigator>
  )
}

const AppRoutes = () => {

  const { AuthReducer } = useSelector(state => state);
  const dispatch = useDispatch();

  React.useEffect(() => {
    LogBox.ignoreAllLogs();

    AsyncStorage.getItem("account_id@")
      .then(accountKey => {
        if (accountKey !== null) {
          let account_key_parse = JSON.parse(accountKey)
          dispatch(loadAccountKeySuccess(account_key_parse.account));
        } else {
          dispatch(loadAccountKeyFail());
        }
      })
      .catch(() => {
        dispatch(loadAccountKeyFail());
      })

  }, []);

  return (
    <>
      {
        AuthReducer.accountLoading ?
          <Loader /> :
          <NavigationContainer>
            <Stack.Navigator headerMode="none" >
              <Stack.Screen name="Home" component={TabComponent} />
              <Stack.Screen name="DetailItem" component={DetailItemScreen} />
              <Stack.Screen name="ViroARScreen" component={ViroARScreen} />
              <Stack.Screen name="CertificateDetail" component={CertificateDetailScreen} />
              <Stack.Screen name="Pay" component={PayScreen} />
              <Stack.Screen name="MakeBid" component={MakeBidScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="Setting" component={SettingScreen} />
              <Stack.Screen name="WalletConnect" component={WalletConnectScreen} />
            </Stack.Navigator>
          </NavigationContainer>

      }
    </>
  );
}

const App = () => {
  return (
    <Provider store={Store}>
      <AppRoutes />
    </Provider>
  )
}

export default App;


