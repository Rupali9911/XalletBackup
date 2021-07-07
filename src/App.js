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

import HomeScreen from './containers/homeScreen';
import MyNFTScreen from './containers/myNFTScreen';
import DiscoverScreen from './containers/discoverScreen';
import ARScreen from './containers/ARScreen';
import ConnectScreen from './containers/connectScreen';
import DetailItemScreen from './containers/detailScreen';
import ViroARScreen from './viro';
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
        } else if (route.name === langObj.common.myNFT) {
          iconName = focused ? images.icons.nftA : images.icons.nftD;
        } else if (route.name === langObj.common.Discover) {
          iconName = focused ? images.icons.discoverA : images.icons.discoverD;
        } else if (route.name === langObj.common.AR) {
          iconName = focused ? images.icons.ARA : images.icons.ARD;
        } else if (route.name === langObj.common.Connect) {
          iconName = focused ? images.icons.connectA : images.icons.connectD;
        }

        // You can return any component that you like here!
        return <Image source={iconName} resizeMode="contain" style={{ width: wp('4.5%'), height: wp('4.5%') }} />;
      },
    })} >
      <Tab.Screen name={langObj.common.home} component={HomeScreen} />
      <Tab.Screen name={langObj.common.Discover} component={DiscoverScreen} />
      <Tab.Screen name={langObj.common.myNFT} component={MyNFTScreen} />
      <Tab.Screen name={langObj.common.AR} component={ARScreen} />
      <Tab.Screen name={langObj.common.Connect} component={ConnectScreen} />
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
          < NavigationContainer >
            <Stack.Navigator mode="modal" headerMode="none" >
              <Stack.Screen name="Home" component={TabComponent} />
              <Stack.Screen name="DetailItem" component={DetailItemScreen} />
              <Stack.Screen name="ViroARScreen" component={ViroARScreen} />
            </Stack.Navigator>
          </NavigationContainer >

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


