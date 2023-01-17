import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useEffect, useState} from 'react';
import {Image, Keyboard} from 'react-native';
import {useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import Colors from '../../constants/Colors';
import {default as ImageSrc} from '../../constants/Images';
import {fonts, images} from '../../res';
import AiChat from '../AiChat';
import Discover from '../discover';
import HomeScreen from '../homeScreen';
import ProfileScreen from '../profile';
import Wallet from '../wallet';
import {translate} from '../../walletUtils';

const Tab = createBottomTabNavigator();

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
      detachInactiveScreens={false}
      lazy={true}
      optimizationsEnabled={true}
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

export default TabComponent;
