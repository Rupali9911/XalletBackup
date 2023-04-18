import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  BackHandler,
  Image,
  Linking,
  Platform,
  SafeAreaView,
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
import { NEW_BASE_URL } from '../../common/constants';
import { ImagekitType } from '../../common/ImageConstant';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { AppHeader, C_Image } from '../../components';
import AppModal from '../../components/appModal';
import NotificationActionModal from '../../components/notificationActionModal';
import SuccessModalContent from '../../components/successModal';
import TabViewScreen from '../../components/TabView/TabViewScreen';
import { SORT_FILTER_OPTONS } from '../../constants';
import Colors from '../../constants/Colors';
import ImageSrc from '../../constants/Images';
import sendRequest from '../../helpers/AxiosApiRequest';
import { colors } from '../../res';
import { newNFTData, newNftListReset } from '../../store/actions/newNFTActions';
import { getAllArtist } from '../../store/actions/nftTrendList';
import { setNetworkData } from '../../store/reducer/networkReducer';
import {
  updateCreateState,
  updatePassStatus,
  updateNotificationStatus
} from '../../store/reducer/userReducer';
import { updateNetworkType } from '../../store/reducer/walletReducer';
import { modalAlert } from '../../common/function';
import { translate } from '../../walletUtils';
import AllNFT from './allNFT';
import ArtNFT from './artNFT';
import Collection from './collection';
import GifNFT from './gifNFT';
import HotCollection from './hotCollection';
import ImageNFT from './imageNFT';
import LaunchPad from './launchPad';
import MovieNFT from './movieNFT';
import MusicNFT from './musicNFT';
import styles from './styles';
import Trending from './trending';
import { Easing } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { CATEGORY_VALUE } from '../../constants';
// import {INFT} from '../../constants/GenesisAnimated';


const HomeScreen = ({ navigation }) => {
  const artistRef = useRef(null);

  // =============== Getting data from reducer ========================
  const isNonCrypto = useSelector(
    state => state.UserReducer?.userData?.isNonCrypto,
  );
  const { passcodeAsyncStatus } = useSelector(state => state.UserReducer);
  const { artistList, artistLoading, artistTotalCount } = useSelector(
    state => state.ListReducer,
  );
  const { showSuccess } = useSelector(state => state.UserReducer);
  const modalState = Platform.OS === 'android' ? false : showSuccess;
  const { requestAppId } = useSelector(state => state.WalletReducer);
  const dispatch = useDispatch();
  // const pushNotificationKey = useSelector(state => state.UserReducer?.userData?.push_notification);


  //================== Components State Defination ===================
  const [modalVisible, setModalVisible] = useState(modalState);
  const [isSuccessVisible, setSuccessVisible] = useState(modalState);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [online, setOnline] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const [screen, setScreen] = useState('');
  const [sortOption, setSortOption] = useState(0);

  const [artistPage, setArtistPage] = useState(1);
  const [active, setActive] = useState(0);

  let artistLimit = 12;

  const [tabs] = useState([
    {
      key: 'launch',
      title: translate('common.launchPad'),
      category: ''
    },
    {
      key: 'collect',
      title: translate('wallet.common.collection'),
      category: '',
    },
    {
      key: 'allNft',
      title: translate('common.allNft'),
      category: CATEGORY_VALUE.allNft,
    },
    {
      key: 'trending',
      title: translate('common.trending'),
      category: CATEGORY_VALUE.trending,
    },
    {
      key: 'art',
      title: translate('common.2DArt'),
      category: CATEGORY_VALUE.art,
    },
    {
      key: 'image',
      title: translate('common.image'),
      category: CATEGORY_VALUE.image,
    },
    {
      key: 'gif',
      title: translate('common.gif'),
      category: CATEGORY_VALUE.gif
    },
    {
      key: 'movie',
      title: translate('common.video'),
      category: CATEGORY_VALUE.movie,
    },
    {
      key: 'music',
      title: translate('common.music'),
      category: CATEGORY_VALUE.music,
    },
    {
      key: 'hotCollection',
      title: translate('common.hotcollection'),
      category: '',
    },
  ]);

  const [routes, setRoutes] = useState(tabs);

  const onFilterStateChange = ({ open }) => setOpenFilter(open);

  //===================== UseEffect Function =========================

  useFocusEffect(
    React.useCallback(() => {
      return () => setOpenFilter(false);
    }, []),
  );

  useEffect(async () => {
    const res = await sendRequest({
      url: `${NEW_BASE_URL}/networks`,
      method: 'GET',
    });
    if (res && typeof res === 'object' && res.length !== 0) {
      const chainId = await AsyncStorage.getItem('@CURRENT_NETWORK_CHAIN_ID');
      if (chainId) {
        const selectedNetwork = res?.find(
          item => item?.chainId === Number(chainId),
        );
        if (selectedNetwork) {
          dispatch(updateNetworkType(selectedNetwork));
        }
      } else {
        dispatch(updateNetworkType(res[3] ? res[3] : res[2]));
      }

      const foundIdx = res.findIndex(el => el.id === 4)
      if (foundIdx) {
        let elem = res[foundIdx]
        res.splice(foundIdx, 1)
        res.unshift(elem)
      }
      dispatch(setNetworkData(res));
    }
  }, []);

  useEffect(() => {
    setActive(0);
  }, [screen]);

  useEffect(() => {
    setActive(sortOption);
  }, [sortOption]);

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(state => {
      const offline = !state.isConnected;
      if (state.isInternetReachable) {
        if (offline) {
          modalAlert(
            translate('wallet.common.alert'),
            translate('wallet.common.error.networkError'),
          );
        } else {
          setOnline(true);
          dispatch(getAllArtist(artistPage, artistLimit));
        }
      }
    });
    const appStateEvent = AppState.addEventListener('change', appStateChange);
    if (requestAppId) {
      navigation.navigate('Connect', { appId: requestAppId });
    }

    return () => {
      netInfoSubscription();
      appStateEvent;
    };
  }, [requestAppId]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        setModalVisible(showSuccess);
        setSuccessVisible(showSuccess);
      }, 1000);
    }
  }, [showSuccess]);

  // function handleBackButtonClick() {
  //   //navigation.goBack();
  //   if (tabIndex != 0) {
  //     //this.props.jumpTo('launch');
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  //   };
  // }, [tabIndex]);

  //================== App State Change Function =======================
  const appStateChange = async nextAppState => {
    const passCheck = await AsyncStorage.getItem('@passcode');
    let passVal = JSON.parse(passCheck);
    if (nextAppState === 'active') {
      if (passVal && !passcodeAsyncStatus) {
        setSuccessVisible(false);
        setModalVisible(false);
        dispatch(updatePassStatus(false));
        navigation.navigate('PasscodeScreen', { screen: 'active' });
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
      // if (pushNotificationKey && pushNotificationKey === true) {
      //   dispatch(updateNotificationStatus(true))
      // } else {
      //   dispatch(updateNotificationStatus(false))
      // }
    });
  };


  const getNFTlist = React.useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNftListReset(category));
    dispatch(newNFTData(category, sort, pageSize, pageNum));
    setSortOption(sort);
  }, []);

  // ===================== Render Screen Header =================================
  const renderAppHeader = () => {
    return (
      <AppHeader
        title={translate('common.home')}
        showRightComponent={
          false && (
            <View style={styles.headerMenuContainer}>
              <TouchableOpacity
                onPress={() => onClickButton()}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.scanIcon} style={styles.headerMenu} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onClickButton(isNonCrypto === 0 ? 'Create' : '')}
                hitSlop={{ top: 5, bottom: 5, left: 5 }}>
                <Image source={ImageSrc.addIcon} style={styles.headerMenu} />
              </TouchableOpacity>
            </View>
          )
        }
      />
    );
  };

  const onClickButton = from => {
    if (from == 'Certificate') navigation.navigate('Certificate');
    else if (from == 'Create') navigation.navigate('Create');
    else
      modalAlert(
        translate('wallet.common.alert'),
        translate('common.comingSoon'),
      );
  };

  // ===================== Render Artist List ===================================
  const renderArtistItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.headerView}
        onPress={() => {
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
        key={`_${index}`}>
        <View style={styles.userCircle}>
          <C_Image
            uri={item?.mediaUrl}
            size={ImagekitType.PROFILE}
            imageStyle={{ width: '100%', height: '100%' }}
          />
          <Text numberOfLines={1} style={styles.userText}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderFooter = () => {
  //   if (artistLoading) {
  //     return (
  //       <View style={styles.artistLoader1}>
  //         <ActivityIndicator size="small" color={colors.themeR} />
  //       </View>
  //     );
  //   }
  //   return null;
  // };

  // const keyExtractor = (item, index) => {
  //   return 'item_' + index;
  // };

  const renderArtistList = () => {
    return (
      <View>
        {artistList.length === 0 && artistLoading ? (
          <View style={styles.artistLoader}>
            <ActivityIndicator size="small" color={colors.themeR} />
          </View>

        ) : (
          <Carousel
            ref={artistRef}
            loop={true}
            autoPlay={true}
            style={{
              width: wp(100),
              height: Platform.OS === 'android' ? hp(12) : hp(11),
            }}
            width={wp(29.5)}
            data={artistList}
            renderItem={renderArtistItem}
            onScrollEnd={num => {
              // if (
              //   num === artistList.length - 4 &&
              //   artistList.length < artistTotalCount
              // ) {
              //   let pageNum = artistPage + 1;
              //   dispatch(getAllArtist(pageNum, artistLimit));
              //   setArtistPage(pageNum);
              // }
            }}
            autoPlayInterval={0}
            withAnimation={{
              type: 'timing',
              config: {
                duration: 7000,
                easing: Easing.linear,
              },
            }}
          />
          // <FlatList
          //   horizontal={true}
          //   data={artistList}
          //   renderItem={renderArtistItem}
          //   onEndReached={() => {
          //     if (!end) {
          //       let pageNum = artistPage + 1;
          //       dispatch(getAllArtist(pageNum, artistLimit));
          //       setArtistPage(pageNum);
          //       setEnd(true);
          //     }
          //   }}
          //   showsHorizontalScrollIndicator={false}
          //   keyExtractor={keyExtractor}
          //   onEndReachedThreshold={0.6}
          //   ListFooterComponent={renderFooter}
          //   onMomentumScrollBegin={() => setEnd(false)}
          //   style={styles.headerList}
          // />
          // // <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          // //   {artistList && artistList.length !== 0
          // //     ? artistList.map((item, index) => {
          // //       return (
          // //         <TouchableOpacity
          // //           style={styles.headerView}
          // //           onPress={() => {
          // //             const id =
          // //               item.role === 'crypto' ? item.username : item._id;
          // //             navigation.navigate('ArtistDetail', { id: id });
          // //           }}
          // //           key={`_${index}`}>
          // //           <View style={styles.userCircle}>
          // //             <C_Image
          // //               uri={item?.mediaUrl}
          // //               type={item.profile_image}
          // //               imageType="profile"
          // //               imageStyle={{ width: '100%', height: '100%' }}
          // //             />
          // //           </View>
          // //           <Text numberOfLines={1} style={styles.userText}>
          // //             {getArtistName(item)}
          // //           </Text>
          // //         </TouchableOpacity>
          // //       );
          // //     })
          // //     : null}
          // // </ScrollView>
        )}
      </View>
    );
  };

  // const getArtistName = (item) => {
  //   let creatorName = item.title || item.username
  //   let creatorName = item && typeof item === 'object' ?
  //     item?.role === 'crypto' ?
  //       item?.title?.trim() ? item.title :
  //         item?.name?.trim() ? item.name :
  //           item?.username?.trim() ? item.username :
  //             item?._id ? item._id : ""

  //       : item?.username?.trim() ? item.username :
  //         item?.name?.trim() ? item.name :
  //           item?.title?.trim() ? item.title :
  //             item?._id ? item._id : ""
  //     : item?._id ? item._id : ""

  //   return creatorName.substring(0, 10);
  // }

  // ===================== Render NFT Categories Tab View =======================
  const renderNFTCategoriesTabs = () => {
    return (
      <TabViewScreen
        index={tabIndex}
        routes={routes}
        switchRoutes={r => renderScene(r)}
        indexChange={i => handleIndexChange(i)}
        tabBarStyle={styles.tabBarStyle}
      />
    );
  };

  const handleIndexChange = index => {
    // {[0, 1, 9].indexOf(index) === -1 && setScreen(routes[index].category)}
    setScreen(routes[index].category);
    setTabIndex(index);
  };

  useEffect(() => {
    if (tabIndex) {
      const backAction = () => {
        if (tabIndex !== 0) {
          setTabIndex(0);
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
  }, [tabIndex]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'launch':
        return <LaunchPad />;
      case 'allNft':
        return <AllNFT sortOption={sortOption} screen={screen} />;
      case 'trending':
        return <Trending sortOption={sortOption} screen={screen} />;
      case 'collect':
        return <Collection />;
      case 'art':
        return <ArtNFT sortOption={sortOption} screen={screen} />;
      case 'image':
        return <ImageNFT sortOption={sortOption} screen={screen} />;
      case 'gif':
        return <GifNFT sortOption={sortOption} screen={screen} />;
      case 'movie':
        return <MovieNFT sortOption={sortOption} screen={screen} />;
      case 'music':
        return <MusicNFT sortOption={sortOption} screen={screen} />;
      case 'hotCollection':
        return <HotCollection />;
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
                      ({ status, settings }) => { },
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
    );
  };

  //=============== Filter Component Functions =================
  const filtersAction = useMemo(() => {
    return [
      {
        id: 0,
        icon: 'sort-variant',
        label: translate('common.mostFavourite'),
        color:
          active === SORT_FILTER_OPTONS.mostLiked
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.mostLiked
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.mostLiked
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.mostLiked
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.mostLiked, 10, 1);
          setActive(SORT_FILTER_OPTONS.mostLiked);
        },
      },
      {
        id: 1,
        icon: 'sort-variant',
        label: translate('common.recentlyListed'),
        color:
          active === SORT_FILTER_OPTONS.onSale ? Colors.WHITE4 : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.onSale ? Colors.WHITE4 : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.onSale
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.onSale
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.onSale, 10, 1);
          setActive(SORT_FILTER_OPTONS.onSale);
        },
      },
      {
        id: 2,
        icon: 'sort-variant',
        label: translate('common.recentlyCreated'),
        color:
          active === SORT_FILTER_OPTONS.recentlyCreated
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.recentlyCreated
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.recentlyCreated
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.recentlyCreated
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.recentlyCreated, 10, 1);
          setActive(SORT_FILTER_OPTONS.recentlyCreated);
        },
      },
      {
        id: 3,
        icon: 'sort-variant',
        label: translate('common.priceLowToHigh'),
        color:
          active === SORT_FILTER_OPTONS.lowToHighPrice
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.lowToHighPrice
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.lowToHighPrice
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.lowToHighPrice
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.lowToHighPrice, 10, 1);
          setActive(SORT_FILTER_OPTONS.lowToHighPrice);
        },
      },
      {
        id: 4,
        icon: 'sort-variant',
        label: translate('common.priceHighToLow'),
        color:
          active === SORT_FILTER_OPTONS.highToLowPrice
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.highToLowPrice
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.highToLowPrice
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.highToLowPrice
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.highToLowPrice, 10, 1);
          setActive(SORT_FILTER_OPTONS.highToLowPrice);
        },
      },
      {
        id: 5,
        icon: 'sort-variant',
        label: translate('common.onAuction'),
        color:
          active === SORT_FILTER_OPTONS.onAuction
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelTextColor:
          active === SORT_FILTER_OPTONS.onAuction
            ? Colors.WHITE4
            : Colors.BLACK5,
        labelStyle:
          active === SORT_FILTER_OPTONS.onAuction
            ? styles.fabLabelStyle1
            : styles.fabLabelStyle,
        style:
          active === SORT_FILTER_OPTONS.onAuction
            ? styles.fabItemStyle1
            : styles.fabItemStyle,
        onPress: () => {
          getNFTlist(screen, SORT_FILTER_OPTONS.onAuction, 10, 1);
          setActive(SORT_FILTER_OPTONS.onAuction);
        },
      },
    ];
  }, [screen, active]);

  const filters = () => {
    return (
      <FAB.Group
        open={openFilter}
        icon={
          openFilter
            ? 'close'
            : props => (
              <FontAwesome5
                name={'sort-amount-down'}
                color={props.color}
                size={props.size}
              />
            )
        }
        fabStyle={styles.fabLabelStyle1}
        actions={filtersAction}
        onStateChange={onFilterStateChange}
        onPress={() => {
          if (openFilter) {
            // do something if the speed dial is open
          }
        }}
      />
    );
  };
  const FilterComponent = React.memo(filters);

  //=====================(Main return Function)=============================
  return (
    <>
      <SafeAreaView style={styles.trendCont}>
        {renderAppHeader()}
        {renderArtistList()}
        {online && (showSuccess ? null : renderNFTCategoriesTabs())}
      </SafeAreaView>
      {renderAppModal()}
      {[0, 1, 9].indexOf(tabIndex) === -1 && <FilterComponent />}
    </>
  );
};

export default React.memo(HomeScreen);
