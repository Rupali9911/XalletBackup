import { useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FAB } from 'react-native-paper';
import {
  checkNotifications,
  openSettings,
  requestNotifications,
} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { AppHeader, C_Image } from '../../components';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import SuccessModal from '../../components/successModal';
import Colors from '../../constants/Colors';
import ImageSrc from '../../constants/Images';
import { colors, fonts } from '../../res';
import { getAllArtist, setSortBy } from '../../store/actions/nftTrendList';
import { setCameraPermission } from '../../store/reducer/cameraPermission';
import { updateCreateState } from '../../store/reducer/userReducer';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { translate } from '../../walletUtils';
import AwardsNFT from './awardsNFT';
import PhotoNFT from './photoNFT';
import GifNFT from './gifNFT';
import HotNFT from './hotNFT';
import MovieNFT from './movieNFT';
import ArtNFT from './artNFT';
import HotCollection from './hotCollection';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();
const HomeScreen = ({ navigation }) => {
  const { artistList, artistLoading, sort } = useSelector(
    state => state.ListReducer,
  );
  const { showSuccess } = useSelector(state => state.UserReducer);
  const { requestAppId } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();
  const { passcodeAsync, data } = useSelector(state => state.UserReducer);

  const [modalVisible, setModalVisible] = useState(showSuccess);
  const [isSuccessVisible, setSuccessVisible] = useState(showSuccess);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [online, setOnline] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const onStateChange = ({ open }) => setOpenState(open);

  const appStateChange = async nextAppState => {
    const languageCheck = await AsyncStorage.getItem('languageCheck');
    const asyncPassCalled = await AsyncStorage.getItem('@asyncPassCalled');
    const asyncPassCalledParse = JSON.parse(asyncPassCalled);
    let parseLanguageCheck = JSON.parse(languageCheck);
    var pass = passcodeAsync;
    if (nextAppState === 'active') {
      if (parseLanguageCheck) {
        if (parseLanguageCheck.cameraPermission) {
          const granted = await Permission.checkPermission(
            PERMISSION_TYPE.camera,
          );
          dispatch(setCameraPermission(granted));
          AsyncStorage.removeItem('languageCheck');
          return;
        }
      }

      if (pass && !asyncPassCalledParse) {
        navigation.navigate('PasscodeScreen', { screen: 'active' });
      } else {
        AsyncStorage.setItem('@asyncPassCalled', JSON.stringify(false));
      }
    }
  };

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !state.isConnected;
      if (state.isInternetReachable) {
        if (offline) {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('wallet.common.error.networkError'),
          );
        } else {
          setOnline(true);
          dispatch(getAllArtist());
        }
      }
    });

    AppState.addEventListener('change', appStateChange);

    if (requestAppId) {
      navigation.navigate('Connect', { appId: requestAppId });
    }

    return () => {
      removeNetInfoSubscription();
    };
  }, [requestAppId]);

  const checkPermissions = async () => {
    PushNotification.checkPermissions(async ({ alert }) => {
      if (!alert) {
        setNotificationVisible(true);
      } else {
        setModalVisible(false);
      }
    });
  };

  const fabActions = useMemo(() => {
    if (currentTab === 1) {
      return [
        {
          icon: 'sort-variant',
          label: translate('common.mostFavourite'),
          style: styles.fabItemStyle,
          onPress: () => dispatch(setSortBy(null)),
        },
        {
          icon: 'sort-variant',
          label: translate('common.recentlyCreated'),
          style: styles.fabItemStyle,
          onPress: () => dispatch(setSortBy('mint')),
        },
        {
          icon: 'sort-variant',
          label: translate('common.onAuction'),
          style: styles.fabItemStyle,
          onPress: () => dispatch(setSortBy('onAuction')),
        },
      ];
    }
    return [
      {
        icon: 'sort-variant',
        label: translate('common.mostFavourite'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy(null)),
      },
      {
        icon: 'sort-variant',
        label: translate('common.recentlyListed'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy('sell')),
      },
      {
        icon: 'sort-variant',
        label: translate('common.recentlyCreated'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy('mint')),
      },
      {
        icon: 'sort-variant',
        label: translate('common.priceLowToHigh'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy('pricelow')),
      },
      {
        icon: 'sort-variant',
        label: translate('common.priceHighToLow'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy('pricehigh')),
      },
      {
        icon: 'sort-variant',
        label: translate('common.onAuction'),
        style: styles.fabItemStyle,
        onPress: () => dispatch(setSortBy('onAuction')),
      },
    ];
  }, [currentTab]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <AppHeader
          title={translate('common.home')}
          showRightComponent={
            <View style={styles.headerMenuContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Certificate')}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Create')}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.addIcon} style={styles.headerMenu} />
              </TouchableOpacity>
            </View>
          }
        />

        <View>
          {artistLoading ? (
            <View
              style={{
                width: '100%',
                height: hp('12%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color={colors.themeR} />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {artistList && artistList.length !== 0
                ? artistList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={styles.headerView}
                      onPress={() => {
                        const id =
                          item.role === 'crypto' ? item.username : item._id;
                        navigation.navigate('ArtistDetail', { id: id });
                      }}
                      key={`_${index}`}>
                      <View style={styles.userCircle}>
                        <C_Image
                          uri={item.profile_image}
                          type={item.profile_image}
                          imageType="profile"
                          imageStyle={{ width: '100%', height: '100%' }}
                        />
                      </View>
                      <Text numberOfLines={1} style={styles.userText}>
                        {item.username}
                      </Text>
                    </TouchableOpacity>
                  );
                })
                : null}
            </ScrollView>
          )}
        </View>
        {online &&
          (showSuccess ? null : (
            <Tab.Navigator
              tabBarOptions={{
                scrollEnabled: true,
                activeTintColor: colors.BLUE4,
                inactiveTintColor: colors.GREY1,
                style: {
                  boxShadow: 'none',
                  elevation: 0,
                  borderTopColor: '#EFEFEF',
                  borderTopWidth: 1,
                  shadowOpacity: 0,
                },
                tabStyle: {
                  height: SIZE(40),
                  width: wp('27%'),
                  paddingHorizontal: wp('1%'),
                  justifyContent: 'center',
                },
                labelStyle: {
                  fontSize: RF(1.4),
                  fontFamily: fonts.SegoeUIRegular,
                  textTransform: 'capitalize',
                },
                indicatorStyle: {
                  borderBottomColor: colors.BLUE4,
                  height: 1,
                  marginBottom: SIZE(39),
                },
              }}>
              <Tab.Screen
                name={'Awards 2021'}
                component={AwardsNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(1);
                  }
                }}
              />
              <Tab.Screen
                name={translate('common.hot')}
                component={HotNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(2);
                  }
                }}
              />
              <Tab.Screen
                name={translate('common.hotcollection')}
                component={HotCollection}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(0);
                  }
                }}
              />
              <Tab.Screen
                name={translate('common.2DArt')}
                component={ArtNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(3);
                  }
                }}
              />
              <Tab.Screen
                name={translate('common.photo')}
                component={PhotoNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(4);
                  }
                }}
              />
              <Tab.Screen
                name="gif"
                component={GifNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(5);
                  }
                }}
              />
              <Tab.Screen
                name={translate('common.video')}
                component={MovieNFT}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(6);
                  }
                }}
              />
            </Tab.Navigator>
          ))}
      </SafeAreaView>
      <AppModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        {isSuccessVisible ? (
          <SuccessModal
            onClose={() => {
              setModalVisible(false);
              dispatch(updateCreateState());
            }}
            onDonePress={() => {
              setSuccessVisible(false);
              checkPermissions();
              dispatch(updateCreateState());
            }}
          />
        ) : null}
        {isNotificationVisible ? (
          <NotificationActionModal
            onClose={() => setModalVisible(false)}
            onDonePress={() => {
              setModalVisible(false);
              Platform.OS === 'ios'
                ? checkNotifications().then(({ status, settings }) => {
                  if (status == 'denied') {
                    requestNotifications(['alert', 'sound']).then(
                      ({ status, settings }) => {
                        console.log(status, settings, 'notification');
                      },
                    );
                  }
                  if (status == 'blocked') {
                    Linking.openSettings();
                  }
                })
                : openSettings();
            }}
          />
        ) : null}
      </AppModal>
      {
        currentTab !== 0 &&
        <FAB.Group
          open={openState}
          icon={
            openState
              ? 'close'
              : props => (
                <FontAwesome5
                  name={'sort-amount-down'}
                  color={props.color}
                  size={props.size}
                />
              )
          }
          fabStyle={{ backgroundColor: Colors.themeColor }}
          actions={fabActions}
          onStateChange={onStateChange}
          onPress={() => {
            if (openState) {
              // do something if the speed dial is open
            }
          }}
        />
      }
    </>
  );
};

export default HomeScreen;
