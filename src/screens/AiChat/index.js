import { SafeAreaView, StatusBar, BackHandler } from 'react-native';
import { AppHeader } from '../../components';
import React, {useEffect } from 'react';
import { translate } from '../../walletUtils';
import styles from './style';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatNftsList from './ChatNftsList';
import SearchInput from './searchNft';
import { COLORS } from '../../constants';
import { TabBar, TabView } from 'react-native-tab-view';

const Tab = createMaterialTopTabNavigator();

 // ====================== Main return function ================================ 
const AiChat = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Owner', title: translate("wallet.common.owned") },
    { key: 'Others', title: translate("common.others") },
  ]);

  useEffect(() => {
    if (index) {
      const backAction = () => {
        if (index !== 0) {
          setIndex(0);
        } else {
          BackHandler.exitApp();
        }
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }
  }, [index]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      bounces={false}
      scrollEnabled={true}
      indicatorStyle={styles.indicator}
      activeColor={COLORS.BLUE2}
      inactiveColor={COLORS.BLACK5}
      style={styles.tabbar}
      labelStyle={styles.label}
      tabStyle={styles.tabStyle}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'Owner':
        return (
          <ChatNftsList
            tabTitle={'Owned'}
          />
        );
      case 'Others':
        return (
          <ChatNftsList
            tabTitle={'Other'}
          />
        );
      default:
        return null;
    }
  }

  const handleIndexChange = index => {
    setIndex(index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
      <AppHeader
        title={translate("common.AIChat")}
        showBackButton
      />
      <SearchInput />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        scrollEnabled={true}
        lazy={true}
      />
    </SafeAreaView>
  )
}

export default AiChat;
