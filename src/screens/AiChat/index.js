import {SafeAreaView, StatusBar, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppHeader} from '../../components';
import React, {useEffect} from 'react';
import {translate} from '../../walletUtils';
import styles from './style';
import ChatNftsList from './ChatNftsList';
import SearchInput from './searchNft';
import {COLORS} from '../../constants';
import {TabBar, TabView} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {
  otherNftListReset,
  ownedNftListReset,
  remainWordCountData,
} from '../../store/actions/chatAction';
import sendRequest from '../../helpers/AxiosApiRequest';

// ====================== Main return function ================================
const AiChat = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Owner', title: translate('wallet.common.owned')},
    {key: 'Others', title: translate('common.others')},
  ]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {userData} = useSelector(state => state.UserReducer);
  let address = userData.userWallet.address;

  //=========================Use-Effect Call====================
  useEffect(() => {
    getRemainingWords();
  }, []);

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

      return () => {
        backHandler.remove();
      };
    }
  }, [index]);

  //=========================Remaining Words Api Call===========================
  const getRemainingWords = () => {
    let url = `https://prod-backend.xanalia.com/xana-genesis-chat/get-user-word-limit`;
    let data = {
      cursor: '',
      owner: address,
      limit: 0,
      page: 1,
    };
    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(res => {
        dispatch(remainWordCountData(res?.userWordLimit));
      })
      .catch(err => console.log(err));
  };

  //====================render-Tab-Bar=======================
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

  //=================render-Scene==========================
  const renderScene = ({route}) => {
    switch (route.key) {
      case 'Owner':
        return <ChatNftsList tabTitle={'Owned'} />;
      case 'Others':
        return <ChatNftsList tabTitle={'Other'} />;
      default:
        return null;
    }
  };

  //=================Index-Change============================
  const handleIndexChange = index => {
    setIndex(index);
  };

  //======================Main-Return========================
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
      <AppHeader
        title={translate('common.AIChat')}
        showBackButton
        onPressBack={() => {
          dispatch(ownedNftListReset());
          dispatch(otherNftListReset());
          navigation.goBack();
        }}
      />
      <SearchInput />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        scrollEnabled={true}
        lazy={true}
      />
    </SafeAreaView>
  );
};

export default AiChat;
