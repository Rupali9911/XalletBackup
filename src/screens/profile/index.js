import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import {openSettings} from 'react-native-permissions';
import PopupMenu from '../../components/PopupMenu';
import {useDispatch, useSelector} from 'react-redux';
import {XANALIA_WEB} from '../../common/constants';
import {COLORS, FONT, FONTS, SIZE, SVGS} from 'src/constants';
import {Container} from 'src/styles/common.styles';
import {confirmationAlert} from '../../common/function';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {AppHeader, C_Image} from '../../components';
import TabViewScreen from '../../components/TabView/TabViewScreen';
import Colors from '../../constants/Colors';
import {fonts} from '../../res';
import colors from '../../res/colors';
import {
  endLoadingBanner,
  endLoadingImage,
  getUserData,
  loadProfileFromAsync,
  startLoadingBanner,
  startLoadingImage,
  updateAvtar,
  updateBanner,
  removeBanner,
} from '../../store/reducer/userReducer';
import {translate} from '../../walletUtils';
import NFTCreated from './nftCreated';
import NFTOwned from './nftOwned';
import {EditButton, EditButtonText} from './styled';
import AppBackground from '../../components/appBackground';
import {ImagekitType} from '../../common/ImageConstant';
import CommonStyles from '../../constants/styles';
import SocialMediaLinks from '../../components/SocialMediaLinks';
import * as Tabs from 'react-native-collapsible-tab-view';

const {
  ConnectSmIcon,
  SettingIcon,
  CopyToClipboard,
  EditImage,
  CopyProfile,
  SettingIconBlack,
  DefaultProfile,
  VerficationIcon,
} = SVGS;

const {height} = Dimensions.get('window');

function Profile({navigation, connector, route}) {
  console.log('@@@ Profile Screen (Tab) =========>');
  const actionSheetRef = useRef(null);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const ref = React.useRef();

  // =============== Getting data from reducer ========================
  const {
    otherUserProfileData,
    loading,
    imageAvatarLoading,
    imageBannerLoading,
    userData,
  } = useSelector(state => state.UserReducer);
  const {UserReducer} = useSelector(state => state);
  const ComponentTypes = [<NFTCreated />, <NFTOwned />];

  //================== Components State Defination ===================
  const [userCopyAddress, setUserCopyAddress] = useState(false);
  const [bannerCopyAddress, setBannerCopyAddress] = useState(false);
  const [childScroll, setChildScroll] = useState(0);
  const [profileScroll, setProfileScroll] = useState(false);
  const [profilePScroll, setProfilePScroll] = useState(0);
  const [layout, setLayout] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState('');
  const [options, setOptions] = useState([]);
  const [id, setId] = useState();
  const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
  const [tabName, setTabName] = React.useState('');
  const [routes] = useState([
    {
      key: 'profileCreated',
      title: translate('wallet.common.profileCreated'),
      component: ComponentTypes[0],
    },
    {
      key: 'nftOwned',
      title: translate('wallet.common.owned'),
      component: ComponentTypes[1],
    },
  ]);

  //================== Global Variables ===================
  const socialSite =
    userDetails?.twitterSite ||
    userDetails?.instagramSite ||
    userDetails?.youtubeSite ||
    userDetails?.discordSite ||
    userDetails?.website;

  //===================== UseEffect Function =========================

  useEffect(() => {
    handleUserData();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      route?.params?.id &&
      otherUserProfileData?.userWallet?.address === route?.params?.id
    ) {
      setUserDetails({...otherUserProfileData});
    } else if (
      !loading &&
      !route?.params?.id &&
      userData?.userWallet?.address
    ) {
      setUserDetails({...userData});
    }
    !loading && dispatch(endLoadingImage());
    !loading && dispatch(endLoadingBanner());
  }, [userData, loading]);

  const handleUserData = () => {
    dispatch(startLoadingBanner());
    dispatch(startLoadingImage());
    console.log('route?.params?.id : ', route?.params?.id);
    if (route?.params?.id) {
      setId(route?.params?.id);
      dispatch(getUserData(route?.params?.id, true));
    } else {
      setId(userData?.userWallet?.address);
      dispatch(getUserData(userData?.userWallet?.address, false));
    }
  };
  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;
  const REMOVE_BANNER = 2;

  const copyToClipboard = () => {
    Clipboard.setString(id);
    setUserCopyAddress(true);
    setTimeout(() => {
      setUserCopyAddress(false);
    }, 500);
  };

  const copyProfileToClipboard = () => {
    Clipboard.setString(`${XANALIA_WEB}/profile/${id}`);
    setBannerCopyAddress(true);
    setTimeout(() => {
      setBannerCopyAddress(false);
    }, 500);
  };

  const handleIndexChange = index => {
    setIndex(index);
  };

  const renderScene = ({route}) => {
    let scrollEnabled =
      Number(profilePScroll).toFixed(0) < Number(layout).toFixed(0)
        ? false
        : true;
    setProfileScroll(scrollEnabled);

    switch (route.key) {
      case 'profileCreated':
        return (
          <NFTCreated
            key={id}
            id={id}
            navigation={navigation}
            scrollEnabled={scrollEnabled}
            setChildScroll={setChildScroll}
          />
        );
      case 'nftOwned':
        return (
          <NFTOwned
            key={id}
            id={id}
            navigation={navigation}
            scrollEnabled={scrollEnabled}
            setChildScroll={setChildScroll}
          />
        );
      default:
        return null;
    }
  };

  const renderTabView = id => {
    return (
      <TabViewScreen
        index={index}
        routes={routes}
        switchRoutes={r => renderScene(r)}
        indexChange={i => handleIndexChange(i)}
        tabBarStyle={{
          width: wp('50%'),
          paddingHorizontal: wp('1%'),
          justifyContent: 'center',
        }}
      />
    );
  };

  const onSelect = from => {
    setSelectedImage(from);
    handleOptions(from);
  };

  useEffect(() => {
    options.length && actionSheetRef.current.show();
  }, [options]);

  const selectActionSheet = async (index, e) => {
    const options = {
      title: 'Select Your Photo',
      storageOptions: {
        skipBackup: true,
        cropping: true,
        privateDirectory: true,
      },
      quality: 0.5,
    };

    if (index === OPEN_CAMERA) {
      ImagePicker.openCamera({
        height: 512,
        width: 512,
        cropping: true,
      })
        .then(image => {
          if (image.height <= 512 && image.width <= 512) {
            let filename =
              Platform.OS === 'android'
                ? image.path.substring(image.path.lastIndexOf('/') + 1)
                : image.filename
                ? image.filename
                : image.path.substring(image.path.lastIndexOf('/') + 1);
            let uri = Platform.OS === 'android' ? image.path : image.sourceURL;

            let temp = {
              path: image.path,
              uri: uri,
              type: image.mime,
              fileName: filename,
              image: image,
            };
            if (selectedImage === 'profile') {
              dispatch(
                updateAvtar(
                  userData?.userWallet?.address,
                  userDetails.id,
                  temp,
                ),
              );
            } else if (selectedImage === 'banner') {
              dispatch(
                updateBanner(
                  userData?.userWallet?.address,
                  userDetails.id,
                  temp,
                ),
              );
            }
          }
        })
        .catch(async e => {
          if (
            e.code &&
            (e.code === 'E_NO_CAMERA_PERMISSION' ||
              e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR')
          ) {
            // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);
            // if (isGranted===false) {
            confirmationAlert(
              translate('wallet.common.cameraPermissionHeader'),
              translate('wallet.common.cameraPermissionMessage'),
              translate('common.Cancel'),
              translate('wallet.common.settings'),
              () => openSettings(),
              () => null,
            );
            // }
          }
        });
    } else if (index === OPEN_GALLERY) {
      ImagePicker.openPicker({
        mediaType: 'photo',
        height: 512,
        width: 512,
        cropping: true,
      })
        .then(image => {
          if (image.height <= 512 && image.width <= 512) {
            let filename =
              Platform.OS === 'android'
                ? image.path.substring(image.path.lastIndexOf('/') + 1)
                : image.filename;

            let uri = Platform.OS === 'android' ? image.path : image.sourceURL;
            let temp = {
              path: image.path,
              uri: uri,
              type: image.mime,
              fileName: filename,
              image: image,
            };
            if (selectedImage === 'profile') {
              dispatch(
                updateAvtar(
                  userData?.userWallet?.address,
                  userDetails.id,
                  temp,
                ),
              );
            } else if (selectedImage === 'banner') {
              dispatch(
                updateBanner(
                  userData?.userWallet?.address,
                  userDetails.id,
                  temp,
                ),
              );
            }
          }
        })
        .catch(async e => {
          if (e.code && e.code === 'E_NO_LIBRARY_PERMISSION') {
            // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.storage);
            // if (isGranted === false) {
            confirmationAlert(
              translate('wallet.common.storagePermissionHeader'),
              translate('wallet.common.storagePermissionMessage'),
              translate('common.Cancel'),
              translate('wallet.common.settings'),
              () => openSettings(),
              () => null,
            );
            // }
          }
        });
    } else if (index === REMOVE_BANNER && selectedImage === 'banner') {
      dispatch(removeBanner('-1', userDetails.id));
    }
  };

  const renderVerifiedIcon = () => {
    return <VerficationIcon width={SIZE(25)} height={SIZE(25)} />;
  };
  const renderBannerImage = () => {
    const renderBanner = () => {
      if (userDetails?.banner && !imageBannerLoading) {
        return (
          <C_Image
            size={ImagekitType.FULLIMAGE}
            uri={userDetails?.banner}
            imageStyle={styles.collectionListImage}
          />
        );
      } else if (!imageBannerLoading && !userDetails?.banner) {
        return <View style={styles.collectionWrapper}></View>;
      } else if (imageBannerLoading) {
        return <LoadingView />;
      } else return null;
    };

    return renderBanner();
  };

  const renderIconImage = () => {
    const renderImage = () => {
      if (userDetails?.avatar && !imageAvatarLoading) {
        return (
          <C_Image
            size={ImagekitType.PROFILE}
            uri={userDetails.avatar}
            imageStyle={styles.iconImage}
          />
        );
      } else if (!imageAvatarLoading && !userDetails?.avatar) {
        return (
          <View style={styles.iconImage}>
            <DefaultProfile width={SIZE(150)} height={SIZE(150)} />
          </View>
        );
      } else if (imageAvatarLoading) {
        return (
          <View style={styles.loaderImage}>
            <LoadingView />
          </View>
        );
      } else return null;
    };
    if (route.params) {
      return renderImage();
    } else {
      return (
        <TouchableOpacity
          key={userDetails?.avatar}
          onPress={() => onSelect('profile')}>
          {renderImage()}
        </TouchableOpacity>
      );
    }
  };

  const handleOptions = selectedImage => {
    if (selectedImage === 'banner' && userDetails?.banner) {
      setOptions([
        translate('wallet.common.takePhoto'),
        translate('wallet.common.choosePhotoFromGallery'),
        translate('common.REMOVE_BANNER'),
        translate('wallet.common.cancel'),
      ]);
    } else {
      setOptions([
        translate('wallet.common.takePhoto'),
        translate('wallet.common.choosePhotoFromGallery'),
        translate('wallet.common.cancel'),
      ]);
    }
  };

  const hideDialog = () => setVisible(false);

  const HandleAddress = opened => {
    return (
      <PopupMenu
        opened={opened}
        items={[{label: `${translate('common.Copied')}!`}]}
        containerStyle={{...CommonStyles.containerStyle}}
        textStyle={{...CommonStyles.textStyle}}
      />
    );
  };

  const renderProfileNameAndId = () => {
    return (
      <View style={styles.profileInfo}>
        <View style={styles.userNameView}>
          <Text style={styles.userNameText} numberOfLines={1}>
            {userDetails?.userName ? userDetails?.userName : 'Unnamed'}
          </Text>
        </View>
        <View style={styles.userIdView}>
          <Text style={styles.userIdText}>
            {userDetails?.userWallet?.address.substring(0, 6)}...
            {userDetails?.userWallet?.address.substring(
              userDetails?.userWallet?.address.length - 4,
              userDetails?.userWallet?.address.length,
            )}
          </Text>
          <TouchableOpacity onPress={() => copyToClipboard()}>
            {userCopyAddress && <HandleAddress open={userCopyAddress} />}
            <CopyToClipboard
              // onPress={() => copyToClipboard()}
              style={{marginLeft: SIZE(6)}}
              width={SIZE(16)}
              height={SIZE(16)}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RenderHeader = () => {
    return (
      <View
        pointerEvents="box-none"
        style={{
          // flex: socialSite ? 0.6 : 0.55,
          position: 'relative',
          paddingBottom: SIZE(10),
        }}>
        {id && <SocketHandler routeId={route?.params?.id} id={id} />}
        {route.params && (
          <AppHeader title={translate('common.profile')} showBackButton />
        )}
        <View>
          {!route.params && (
            <TouchableOpacity
              style={styles.settings}
              onPress={() =>
                navigation.navigate('Setting', {connector: connector})
              }>
              <SettingIcon width={SIZE(23)} height={SIZE(23)} />
            </TouchableOpacity>
          )}
          <View style={styles.collectionWrapper}>{renderBannerImage()}</View>
          {!route.params && (
            <TouchableOpacity
              style={styles.editImage}
              onPress={() => onSelect('banner')}>
              <EditImage width={SIZE(12)} height={SIZE(12)} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.copyProfile}
            onPress={() => copyProfileToClipboard()}>
            {bannerCopyAddress && <HandleAddress open={bannerCopyAddress} />}
            <CopyProfile width={SIZE(12)} height={SIZE(12)} />
          </TouchableOpacity>
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconBadgeVw,
                route?.params?.role === 4
                  ? styles.borderBtnColor
                  : styles.borderTrans,
              ]}>
              {renderIconImage()}
              {route?.params?.role === 4 ? (
                <View style={styles.markIconView}>{renderVerifiedIcon()}</View>
              ) : null}
            </View>
          </View>
          <View style={styles.userDetailsWrapper}>
            {renderProfileNameAndId()}
          </View>
          <View style={{...CommonStyles.socialSiteView}}>
            <SocialMediaLinks socialSiteData={userDetails} />
          </View>
          {!route.params && (
            <EditButton
              style={{
                alignSelf: 'center',
                width: wp(60),
                height: hp(4),
                marginTop: SIZE(5),
              }}
              onPress={() => navigation.navigate('EditProfile', {userDetails})}>
              <EditButtonText>
                {translate('wallet.common.editprofile')}
              </EditButtonText>
            </EditButton>
          )}
          <ActionSheet
            ref={actionSheetRef}
            key={options}
            title={translate('wallet.common.choosePhoto')}
            options={options}
            cancelButtonIndex={selectedImage === 'profile' ? 2 : 3}
            onPress={selectActionSheet}
          />
        </View>
      </View>
    );
  };

  const TabBarComponent = React.useCallback(
    props => (
      <Tabs.MaterialTabBar
        {...props}
        scrollEnabled
        tabStyle={{
          width: wp('50%'),
          paddingHorizontal: wp('1%'),
          justifyContent: 'center',
        }}
        activeColor={COLORS.BLUE2}
        inactiveColor={COLORS.BLACK5}
        labelStyle={{
          fontSize: RF(1.6),
          fontFamily: 'Arial',
          textTransform: 'none',
        }}
        indicatorStyle={{
          borderBottomColor: COLORS.BLUE4,
          height: 1,
          marginBottom: SIZE(39),
          backgroundColor: COLORS.BLUE4,
        }}
        index={currentTabIndex}
        focusedTab={tabName}
        navigate
        // containerRef={ref.current.currentTabIndex}
      />
    ),
    [],
  );

  return (
    <AppBackground>
      {/* <ScrollView
        ref={scrollRef}
        // scrollEnabled={profileScroll}
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollView}
        onScroll={s => {
          const currentScrollPos = s?.nativeEvent?.contentOffset?.y;
          setProfilePScroll(currentScrollPos);
        }}>
        {renderHeader()}
        <View
          style={{
            height: !route.params
              ? Platform.OS == 'ios'
                ? hp(85.2)
                : hp(94)
              : Platform.OS == 'ios'
              ? hp(90.2)
              : hp(101),
          }}>
          {renderTabView(id)}
        </View>
      </ScrollView> */}

      <Tabs.Container
        ref={ref}
        renderHeader={RenderHeader}
        lazy
        cancelLazyFadeIn={false}
        cancelTranslation={false}
        onTabChange={e => {
          setTabName(e.tabName);
        }}
        onIndexChange={index => {
          setCurrentTabIndex(index);
        }}
        pagerProps={{hitSlop: {left: -10}}}
        renderTabBar={TabBarComponent}>
        {routes.map(tab => {
          return (
            <Tabs.Tab name={tab.title} key={tab.key}>
              {tab.component}
            </Tabs.Tab>
          );
        })}
        {/* <Tabs.Tab name={'A'} label={'A'}>
          <NFTCreated />
        </Tabs.Tab>
        <Tabs.Tab name={'B'} label={'B'}>
          <NFTCreated />
        </Tabs.Tab> */}
      </Tabs.Container>
    </AppBackground>
  );
}

export default React.memo(Profile);

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: Colors.WHITE1,
  },
  listItem: {
    height: wp('100%') / 3 - wp('0.5%'),
    marginVertical: wp('0.3'),
    marginHorizontal: wp('0.3'),
    width: wp('100%') / 3 - wp('0.5%'),
  },
  listImage: {
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: 'white',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerTitle: {
    fontSize: RF(2),
    fontFamily: fonts.PINGfANG_SBOLD,
    lineHeight: RF(2.1),
  },
  countLabel1: {
    fontSize: FONT(16),
    color: COLORS.BLACK1,
    fontFamily: FONTS.PINGfANG_SBOLD,
  },
  listItemContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  collectionWrapper: {
    height: SIZE(200),
    alignItems: 'center',
    backgroundColor: colors.DARK_GREY,
  },
  iconImage: {
    width: SIZE(140),
    height: SIZE(140),
    borderRadius: SIZE(150),
    backgroundColor: colors.PERIWINKLE,
    alignItems: 'center',
  },

  loaderImage: {
    backgroundColor: 'transparent',
    width: SIZE(150),
    height: SIZE(150),
  },
  iconWrapper: {
    marginTop: SIZE(-80),
    marginBottom: SIZE(10),
    alignItems: 'center',
    height: SIZE(150),
  },
  userDetailsWrapper: {
    marginTop: SIZE(5),
    alignItems: 'center',
  },
  collectionListImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  settings: {
    position: 'absolute',
    zIndex: 10,
    alignSelf: 'flex-end',
    right: SIZE(10),
    top: SIZE(10),
  },
  profileInfo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameView: {
    width: '100%',
    marginBottom: SIZE(6),
  },
  userIdView: {
    width: '100%',
    flexDirection: 'row',
  },
  userNameText: {
    fontSize: SIZE(22),
    fontWeight: '700',
    paddingHorizontal: SIZE(38),
  },
  userIdText: {
    fontFamily: 'Arial',
  },
  editImage: {
    zIndex: 20,
    position: 'absolute',
    width: SIZE(34),
    height: SIZE(34),
    borderRadius: SIZE(34),
    borderWidth: SIZE(1),
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    top: SIZE(150),
    left: SIZE(10),
  },
  copyProfile: {
    zIndex: 20,
    position: 'absolute',
    width: SIZE(34),
    height: SIZE(34),
    borderRadius: SIZE(34),
    borderWidth: SIZE(1),
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    top: SIZE(150),
    right: SIZE(10),
  },

  tabView: {
    height: height / 1.5,
    marginTop: SIZE(10),
  },
  markIconView: {
    position: 'absolute',
    top: 145,
    zIndex: 10,
  },
  iconBadgeVw: {
    borderWidth: 3,
    width: SIZE(155),
    height: SIZE(155),
    position: 'relative',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderTrans: {
    borderColor: 'transparent',
  },
  borderBtnColor: {
    borderColor: Colors.buttonBackground,
  },
});
