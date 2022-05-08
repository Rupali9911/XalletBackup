import { useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { passShowStatusCall, updateCreateState } from '../../store/reducer/userReducer';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { translate } from '../../walletUtils';
import AwardsNFT from './awardsNFT';
import PhotoNFT from './photoNFT';
import GifNFT from './gifNFT';
import HotNFT from './hotNFT';
import MovieNFT from './movieNFT';
import ArtNFT from './artNFT';
import HotCollection from './hotCollection';
import Collection from './collection';
import styles from './styles';
import { alertWithSingleBtn } from '../../utils';

const Tab = createMaterialTopTabNavigator();
const HomeScreen = ({ navigation }) => {
  const userRole = useSelector(state => state.UserReducer?.data?.user?.role);
  const { artistList, artistLoading, sort } = useSelector(
    state => state.ListReducer,
  );
  const { showSuccess, passcodeAsync, data, passShowStatus } = useSelector(state => state.UserReducer);
  const { requestAppId } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(showSuccess);
  const [isSuccessVisible, setSuccessVisible] = useState(showSuccess);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [online, setOnline] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const onStateChange = ({ open }) => setOpenState(open);

  const appStateChange = async nextAppState => {
    const languageCheck = await AsyncStorage.getItem('languageCheck');
    let parseLanguageCheck = JSON.parse(languageCheck);
    // var pass = passcodeAsync;
    // console.log(  passcodeAsync)
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
      if (passcodeAsync) {
        navigation.navigate('PasscodeScreen', { screen: 'active' })
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setOpenState(false);
    }, [])
  );

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

  const onClickButton = (from) => {
    if (from == 'Certificate')
      navigation.navigate('Certificate')
    else if (from == 'Create')
      navigation.navigate('Create')
    else
      alertWithSingleBtn(
        translate('wallet.common.alert'),
        translate('common.comingSoon'))
  }

  const fab = () => {
    return (
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
    )
  }

  const FilterComponent = React.memo(fab);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <AppHeader
          title={translate('common.home')}
          showRightComponent={
            <View style={styles.headerMenuContainer}>
              <TouchableOpacity
                onPress={() => onClickButton()}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onClickButton(userRole === 'crypto' ? 'Create' : '')}
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
                        {item.title || item.username}
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
              screenOptions={{
                tabBarScrollEnabled: true,
                tabBarActiveTintColor: colors.BLUE4,
                tabBarInactiveTintColor: colors.GREY1,
                tabBarLabelStyle: {
                  fontSize: RF(1.4),
                  fontFamily: fonts.SegoeUIRegular,
                  textTransform: 'capitalize',
                },
                tabBarIndicatorStyle: {
                  borderBottomColor: colors.BLUE4,
                  height: 1,
                  marginBottom: SIZE(39),
                },
                tabBarItemStyle: {
                  height: SIZE(40),
                  width: wp('27%'),
                  paddingHorizontal: wp('1%'),
                  justifyContent: 'center',
                },
                tabBarStyle: {
                  boxShadow: 'none',
                  elevation: 0,
                  borderTopColor: '#EFEFEF',
                  borderTopWidth: 1,
                  shadowOpacity: 0,
                }
              }}
            >
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
                name={translate('wallet.common.collection')}
                component={Collection}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(7);
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
              <Tab.Screen
                name={translate('common.hotcollection')}
                component={HotCollection}
                listeners={({ navigation, route }) => {
                  if (navigation.isFocused()) {
                    setCurrentTab(0);
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
            title={translate('wallet.common.setPushNotification')}
            hint={translate('wallet.common.notificationHint')}
            btnText={translate('wallet.common.enable')}
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
        currentTab !== 0 && currentTab !== 7 &&
        <FilterComponent />
      }
    </>
  );
};

export default HomeScreen;
