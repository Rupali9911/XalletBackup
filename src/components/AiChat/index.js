import { View, SafeAreaView, StatusBar } from 'react-native';
import { AppHeader } from '../../components';
import React, { } from 'react';
import { translate } from '../../walletUtils';
import styles from './style';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NftCollections from './NftCollections';
import SearchInput from './searchNft';
import { COLORS } from '../../constants';

const Tab = createMaterialTopTabNavigator();

// ====================== Main return function ================================ 
const AiChat = () => {


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
      <AppHeader
        title={translate("common.AIChat")}
        showBackButton
      />

      <SearchInput />

      <View style={[styles.separator, { marginVertical: 10 }]} />
      <Tab.Navigator
        screenOptions={{
          lazy: true,
          tabBarActiveTintColor: COLORS.BLUE2,
          tabBarInactiveTintColor: COLORS.BLACK5,
          tabBarLabelStyle: {
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.BLUE4,
          }
        }}>
        <Tab.Screen name={translate("wallet.common.owned")} component={NftCollections} initialParams={{ Owned: true }} />
        <Tab.Screen name={translate("common.others")} component={NftCollections} initialParams={{ Owned: false }} />
      </Tab.Navigator>

    </SafeAreaView>

  )
}

export default AiChat;

