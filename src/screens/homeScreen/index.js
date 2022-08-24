import { useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
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
  Dimensions
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
import SuccessModalContent from '../../components/successModal';
import Colors from '../../constants/Colors';
import ImageSrc from '../../constants/Images';
import { colors } from '../../res';
import { getAllArtist, setSortBy } from '../../store/actions/nftTrendList';
import { updateCreateState, updatePassStatus } from '../../store/reducer/userReducer';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { translate } from '../../walletUtils';
import AllNFT from './allNFT';
import ImageNFT from './imageNFT';
import MusicNFT from './musicNFT'
import GifNFT from './gifNFT';
import Trending from './trending';
import MovieNFT from './movieNFT';
import ArtNFT from './artNFT';
import HotCollection from './hotCollection';
import Collection from './collection';
import styles from './styles';
import { alertWithSingleBtn } from '../../utils';
import LaunchPad from "./launchPad"
import {
  TabView,
  TabBar,
} from 'react-native-tab-view';
import { SORT_FILTER_OPTONS } from '../../constants'
import { newNFTData, newNftListReset } from '../../store/actions/newNFTActions';
import { FlatList } from 'native-base';

const HomeScreen = ({ navigation }) => {
  // =============== Getting data from reducer ========================
  const userRole = useSelector(state => state.UserReducer?.data?.user?.role);
  const { passcodeAsyncStatus } = useSelector(state => state.UserReducer);
  const { artistList, artistLoading, sort } = useSelector(
    state => state.ListReducer,
  );
  const { showSuccess, data } = useSelector(state => state.UserReducer);
  const modalState = Platform.OS === 'android' ? false : showSuccess;
  const { requestAppId } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();

  //================== Components State Defination ===================
  const [modalVisible, setModalVisible] = useState(modalState);
  const [isSuccessVisible, setSuccessVisible] = useState(modalState);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [online, setOnline] = useState(false);
  const [openState, setOpenState] = useState(false);
  const [index, setIndex] = useState(0);

  const [screen, setScreen] = useState('')
  const [sortOption, setSortOption] = useState(0)
  const [page, setPage] = useState(1);

  const [artistPage, setArtistPage] = useState(1)
  const [end, setEnd] = useState()


  let artistLimit = 12


  const [routes] = useState([
    { key: 'launch', title: translate('common.launchPad') },
    { key: 'allNft', title: translate("common.allNft") },
    { key: 'trending', title: translate("common.trending") },
    { key: 'collect', title: translate('wallet.common.collection') },
    { key: 'art', title: translate('common.2DArt') },
    { key: 'image', title: translate("common.image") },
    { key: 'gif', title: translate('common.gif') },
    { key: 'movie', title: translate('common.video') },
    { key: 'music', title: translate('common.music') },
    { key: 'hotCollection', title: translate('common.hotcollection') },
  ]);

  const onStateChange = ({ open }) => setOpenState(open);

  //===================== UseEffect Function =========================
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
          dispatch(getAllArtist(artistPage, artistLimit));
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

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        setModalVisible(showSuccess);
        setSuccessVisible(showSuccess);
      }, 1000)
    }
  }, [showSuccess]);

  //================== App State Change Function =======================
  const appStateChange = async nextAppState => {
    const passCheck = await AsyncStorage.getItem('@passcode');
    let passVal = JSON.parse(passCheck);
    if (nextAppState === 'active') {
      if (passVal && !passcodeAsyncStatus) {
        setSuccessVisible(false)
        setModalVisible(false)
        dispatch(updatePassStatus(false))
        navigation.navigate('PasscodeScreen', { screen: 'active' })
      }
    }
  };

  const checkPermissions = async () => {
    PushNotification.checkPermissions(async ({ alert }) => {
      if (!alert) {
        setNotificationVisible(true);
      } else {
        setModalVisible(false);
      }
    });
  };

  const getNFTlist = React.useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNftListReset(category))
    dispatch(newNFTData(category, sort, pageSize, pageNum));
    setSortOption(sort)
    setPage(1)
  }, []);

  // ===================== Render Screen Header =================================
  const renderAppHeader = () => {
    return (
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
    )
  }

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

  // ===================== Render Artist List ===================================
  const renderArtistItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.headerView}
        // onPress={() => {
        //   const id =
        //     item.role === 'crypto' ? item.username : item._id;
        //   navigation.navigate('ArtistDetail', { id: id });
        // }}
        key={`_${index}`}>
        <View style={styles.userCircle}>
          <C_Image
            uri={item?.mediaUrl}
            type={item.profile_image}
            imageType="profile"
            imageStyle={{ width: '100%', height: '100%' }}
          />
        </View>
        <Text numberOfLines={1} style={styles.userText}>
          {`${item?.name?.substring(0, 8)}...`}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderFooter = () => {
    if (artistLoading) {
      return <View style={styles.artistLoader1}>
        <ActivityIndicator size="small" color={colors.themeR} />
      </View>
    }
    return null
  };


  const renderArtistList = () => {
    return (
      <View>
        {artistList.length === 0 && artistLoading ? (
          <View
            style={styles.artistLoader}>
            <ActivityIndicator size="small" color={colors.themeR} />
          </View>
        ) : (
          <FlatList
            horizontal={true}
            data={artistList}
            renderItem={renderArtistItem}
            onEndReached={() => {
              if (!end) {
                let pageNum = artistPage + 1
                dispatch(getAllArtist(pageNum, artistLimit))
                setArtistPage(pageNum)
                setEnd(true)
              }
            }}
            onEndReachedThreshold={0.6}
            ListFooterComponent={renderFooter}
            onMomentumScrollBegin={() => setEnd(false)}
          />
          // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          //   {artistList && artistList.length !== 0
          //     ? artistList.map((item, index) => {
          //       return (
          //         <TouchableOpacity
          //           style={styles.headerView}
          //           onPress={() => {
          //             const id =
          //               item.role === 'crypto' ? item.username : item._id;
          //             navigation.navigate('ArtistDetail', { id: id });
          //           }}
          //           key={`_${index}`}>
          //           <View style={styles.userCircle}>
          //             <C_Image
          //               uri={item?.mediaUrl}
          //               type={item.profile_image}
          //               imageType="profile"
          //               imageStyle={{ width: '100%', height: '100%' }}
          //             />
          //           </View>
          //           <Text numberOfLines={1} style={styles.userText}>
          //             {getArtistName(item)}
          //           </Text>
          //         </TouchableOpacity>
          //       );
          //     })
          //     : null}
          // </ScrollView>
        )}
      </View>
    )
  }

  const getArtistName = (item) => {
    // let creatorName = item.title || item.username
    let creatorName = item && typeof item === 'object' ?
      item?.role === 'crypto' ?
        item?.title?.trim() ? item.title :
          item?.name?.trim() ? item.name :
            item?.username?.trim() ? item.username :
              item?._id ? item._id : ""

        : item?.username?.trim() ? item.username :
          item?.name?.trim() ? item.name :
            item?.title?.trim() ? item.title :
              item?._id ? item._id : ""
      : item?._id ? item._id : ""

    return creatorName.substring(0, 10);
  }

  // ===================== Render NFT Categories Tab View =======================
  const renderNFTCategoriesTabs = () => {
    return (
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        scrollEnabled={true}
        initialLayout={{ width: Dimensions.get('window').width }}
        lazy
      />
    )
  }

  const handleIndexChange = (index) => setIndex(index);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      bounces={false}
      scrollEnabled={true}
      indicatorStyle={styles.indicator}
      activeColor={colors.BLUE4}
      inactiveColor={colors.GREY1}
      style={styles.tabbar}
      labelStyle={styles.label}
      tabStyle={styles.tabStyle}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'launch':
        return <LaunchPad />;
      case 'allNft':
        return <AllNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />;
      case 'trending':
        return <Trending
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />;
      case 'collect':
        return <Collection
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'art':
        return <ArtNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'image':
        return <ImageNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'gif':
        return <GifNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'movie':
        return <MovieNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'music':
        return <MusicNFT
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      case 'hotCollection':
        return <HotCollection
          screen={(num) => setScreen(num)}
          page={page}
          setPage={setPage}
          sortOption={sortOption}
          setSortOption={setSortOption} />;
      default:
        return null;
    }
  };


  // ===================== Render App Modal On Success & Notification) ==============
  const renderAppModal = () => {
    return (
      <AppModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        {isSuccessVisible ? (
          <SuccessModalContent
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
    )
  }

  //=============== Filter Component Functions =================
  const fabActions = useMemo(() => {
    return [
      {
        icon: 'sort-variant',
        label: translate('common.mostFavourite'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.mostLiked, 10, 1)
          setPage(1)
        },
      },
      {
        icon: 'sort-variant',
        label: translate('common.recentlyListed'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.onSale, 10, 1)
          setPage(1)
        },
      },
      {
        icon: 'sort-variant',
        label: translate('common.recentlyCreated'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.recentlyCreated, 10, 1)
          setPage(1)
        },
      },
      {
        icon: 'sort-variant',
        label: translate('common.priceLowToHigh'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.lowToHighPrice, 10, 1)
          setPage(1)
        },
      },
      {
        icon: 'sort-variant',
        label: translate('common.priceHighToLow'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.highToLowPrice, 10, 1)
          setPage(1)
        },
      },
      {
        icon: 'sort-variant',
        label: translate('common.onAuction'),
        style: styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.onAuction, 10, 1)
          setPage(1)
        },
      },
    ]
  }, [index]);

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

  //=====================(Main return Function)=============================
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {renderAppHeader()}
        {renderArtistList()}
        {online &&
          (showSuccess ? null : renderNFTCategoriesTabs())}
      </SafeAreaView>
      {renderAppModal()}
      {
        index !== 0 && index !== 9 && index !== 3 &&
        <FilterComponent />
      }
    </>
  );
};

export default HomeScreen;