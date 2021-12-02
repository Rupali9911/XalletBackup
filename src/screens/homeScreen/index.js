import NetInfo from '@react-native-community/netinfo';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {openSettings} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import {useDispatch, useSelector} from 'react-redux';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  SIZE,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {AppHeader, C_Image, DetailModal, Loader} from '../../components';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import SuccessModal from '../../components/successModal';
import ImageSrc from '../../constants/Images';
import { colors, fonts } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import { getAllArtist, getNFTList, nftListReset, nftLoadStart, pageChange } from '../../store/actions/nftTrendList';
import { updateCreateState } from '../../store/reducer/userReducer';
import { setCameraPermission } from '../../store/reducer/cameraPermission';
import { translate } from '../../walletUtils';
import AwardsNFT from './awards';
import Favorite from './favorite';
import NewNFT from './newNFT';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';

const Tab = createMaterialTopTabNavigator();

const Hot = () => {
  const {ListReducer} = useSelector(state => state);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(nftLoadStart());
    dispatch(nftListReset());
    getNFTlist(1);
    dispatch(pageChange(1));
  }, []);

  const getNFTlist = useCallback((page, limit) => {
    dispatch(getNFTList(page, limit));
  }, []);

  const refreshFunc = () => {
    dispatch(nftListReset());
    getNFTlist(1);
    dispatch(pageChange(1));
  };

  const renderFooter = () => {
    if (!ListReducer.nftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({item, index}) => {
    let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <TouchableOpacity
          onLongPress={() => {
            item.index = index;
            setModalData(item);
            setModalVisible(true);
          }}
          onPress={() => {
            dispatch(changeScreenName('Hot'));
            navigation.navigate('DetailItem', {index: findIndex});
          }}
          style={styles.listItem}>
          <C_Image
            type={
              item.metaData.image.split('.')[
                item.metaData.image.split('.').length - 1
              ]
            }
            uri={imageUri}
            imageStyle={styles.listImage}
          />
        </TouchableOpacity>
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.nftList]);

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {ListReducer.page === 1 && ListReducer.nftListLoading ? (
        <Loader />
      ) : ListReducer.nftList.length !== 0 ? (
        <FlatList
          data={ListReducer.nftList}
          horizontal={false}
          numColumns={3}
          initialNumToRender={15}
          onRefresh={() => {
            dispatch(nftLoadStart());
            refreshFunc();
          }}
          scrollEnabled={!isModalVisible}
          refreshing={ListReducer.page === 1 && ListReducer.nftListLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !ListReducer.nftListLoading &&
              ListReducer.nftList.length !== ListReducer.totalCount
            ) {
              let num = ListReducer.page + 1;
              getNFTlist(num);
              dispatch(pageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
      {modalData && (
        <DetailModal
          index={modalData.index}
          data={modalData}
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  const {artistList, artistLoading} = useSelector(state => state.ListReducer);
  const {showSuccess} = useSelector(state => state.UserReducer);
  const {requestAppId} = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();
  const {passcodeAsync, data} = useSelector(state => state.UserReducer);

  const [modalVisible, setModalVisible] = useState(showSuccess);
  const [isSuccessVisible, setSuccessVisible] = useState(showSuccess);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [online, setOnline] = useState(false);

  const appStateChange = async (nextAppState) => {
    const languageCheck = await AsyncStorage.getItem("languageCheck");
    const asyncPassCalled = await AsyncStorage.getItem("@asyncPassCalled");
    const asyncPassCalledParse = JSON.parse(asyncPassCalled);
    let parseLanguageCheck = JSON.parse(languageCheck);
    var pass = passcodeAsync;
    if (nextAppState === "active") {

      if (parseLanguageCheck) {
        if (parseLanguageCheck.cameraPermission) {
          const granted = await Permission.checkPermission(PERMISSION_TYPE.camera);
          dispatch(setCameraPermission(granted))
          AsyncStorage.removeItem("languageCheck");
          return;
        }
      }

      if (pass && !asyncPassCalledParse) {
        navigation.navigate("PasscodeScreen", { screen: "active" })
      }else{
        AsyncStorage.setItem("@asyncPassCalled", JSON.stringify(false));
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
      navigation.navigate('Connect', {appId: requestAppId});
    }

    return () => {
      removeNetInfoSubscription();
    };
  }, [requestAppId]);

  const checkPermissions = async () => {
    PushNotification.checkPermissions(async ({alert}) => {
      if (!alert) {
        setNotificationVisible(true);
      } else {
        setModalVisible(false);
      }
    });
  };
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <AppHeader
          title={translate('common.home')}
          showRightComponent={
            <View style={styles.headerMenuContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Certificate')}
                hitSlop={{top: 5, bottom: 5, left: 5}}>
                <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Create')}
                hitSlop={{top: 5, bottom: 5, left: 5}}>
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
                        onPress={() => {
                          const id =
                            item.role === 'crypto' ? item.username : item._id;
                          navigation.navigate('ArtistDetail', {id: id});
                        }}
                        key={`_${index}`}>
                        <View style={styles.userCircle}>
                          <C_Image
                            uri={item.profile_image}
                            type={item.profile_image}
                            imageType="profile"
                            imageStyle={{width: '100%', height: '100%'}}
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
              <Tab.Screen name={'Awards 2021'} component={AwardsNFT} />
              <Tab.Screen name={translate('common.hot')} component={Hot} />
              <Tab.Screen
                name={translate('common.following')}
                component={NewNFT}
              />
              <Tab.Screen
                name={translate('common.Discover')}
                component={Favorite}
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
              openSettings();
            }}
          />
        ) : null}
      </AppModal>
    </>
  );
};

export default HomeScreen;
