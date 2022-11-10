import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
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
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useDispatch, useSelector} from 'react-redux';

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
} from '../../store/reducer/userReducer';
import {translate} from '../../walletUtils';
import NFTCreated from './nftCreated';
import NFTOwned from './nftOwned';
import {SocketHandler} from './socketHandler';
import {EditButton, EditButtonText} from './styled';
import AppBackground from '../../components/appBackground';

const {
  ConnectSmIcon,
  SettingIcon,
  CopyToClipboard,
  EditImage,
  CopyProfile,
  SettingIconBlack,
  DefaultProfile,
  YouTubeIcon,
  WebIcon,
  Twitter,
  Instagram,
  DiscordIcon,
} = SVGS;

const {height} = Dimensions.get('window');

function Profile({navigation, connector, route}) {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();

  // =============== Getting data from reducer ========================
  const {
    profileData,
    loading,
    loggedInUser,
    imageAvatarLoading,
    imageBannerLoading,
  } = useSelector(state => state.UserReducer);
  const {UserReducer} = useSelector(state => state);

  //================== Components State Defination ===================
  const [openDial1, setOpenDial1] = useState(false);
  const [openDial2, setOpenDial2] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [index, setIndex] = useState(0);
  const [id, setId] = useState();
  const [routes] = useState([
    {key: 'profileCreated', title: translate('wallet.common.profileCreated')},
    {key: 'nftOwned', title: translate('wallet.common.owned')},
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
    if (
      !loading &&
      route?.params?.id &&
      profileData?.userWallet?.address === route?.params?.id
    ) {
      setUserDetails({...profileData});
    } else if (
      !loading &&
      !route?.params?.id &&
      profileData?.userWallet?.address === loggedInUser?.userWallet?.address
    ) {
      setUserDetails({...profileData});
    }
    !loading && dispatch(endLoadingImage());
    !loading && dispatch(endLoadingBanner());
  }, [profileData, loading]);

  useEffect(() => {
    handleUserData();
    const unsubscribe = navigation.addListener('focus', () => {});
    return unsubscribe;
  }, [navigation]);

  const handleUserData = () => {
    dispatch(startLoadingBanner());
    dispatch(startLoadingImage());
    if (route?.params?.id) {
      setId(route?.params?.id);
      dispatch(getUserData(route?.params?.id, true));
    } else {
      setId(loggedInUser?.userWallet?.address);
      dispatch(getUserData(loggedInUser?.userWallet?.address, true));
    }
  };

  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;

  const copyToClipboard = () => {
    Clipboard.setString(id);
    setOpenDial1(true);
    setTimeout(() => {
      setOpenDial1(false);
    }, 500);
  };

  const copyProfileToClipboard = () => {
    Clipboard.setString(`https://xanalia.com/profile/${id}`);
    setOpenDial2(true);
    setTimeout(() => {
      setOpenDial2(false);
    }, 500);
  };

  const handleIndexChange = index => {
    console.log('Index', index);
    setIndex(index);
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'profileCreated':
        return <NFTCreated key={id} id={id} />;
      case 'nftOwned':
        return <NFTOwned key={id} id={id} />;
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

  let imageType = '';

  const onSelect = from => {
    imageType = from;
    actionSheetRef.current.show();
  };

  const selectActionSheet = async index => {
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
            if (imageType === 'profile') {
              dispatch(updateAvtar(userDetails.id, temp));
            } else if (imageType === 'banner') {
              dispatch(updateBanner(userDetails.id, temp));
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
            if (imageType === 'profile') {
              dispatch(updateAvtar(userDetails.id, temp));
            } else if (imageType === 'banner') {
              dispatch(updateBanner(userDetails.id, temp));
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
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const loadAllData = () => {
    dispatch(loadProfileFromAsync(id))
      .then(() => {
        setRefreshing(false);
      })
      .catch(err => {
        setRefreshing(false);
      });
  };

  const renderBannerImage = () => {
    const renderBanner = () => {
      if (userDetails?.banner && !imageBannerLoading) {
        return (
          <C_Image
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
          <C_Image uri={userDetails.avatar} imageStyle={styles.iconImage} />
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

  const hideDialog = () => setVisible(false);

  const renderProfileNameAndId = () => {
    return (
      <View style={styles.profileInfo}>
        <View style={styles.userNameView}>
          <Text style={styles.userNameText}>
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
            <Menu opened={openDial1}>
              <MenuTrigger />
              <MenuOptions
                optionsContainerStyle={{
                  width: SIZE(60),
                  backgroundColor: Colors.BLACK1,
                }}>
                <MenuOption>
                  <Text style={{color: '#FFFFFF'}}>Copied!</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
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
  return (
    // <Container>
    <AppBackground>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollView}>
        <View style={styles.scrollView}>
          <View
            style={{
              flex: socialSite ? 0.6 : 0.55,
              position: 'relative',
            }}>
            <View
            // style={styles.scrollView}
            // refreshControl={
            //     <RefreshControl
            //         refreshing={refreshing}
            //         onRefresh={onRefresh}
            //         tintColor={Colors.themeColor}
            //     />
            // }
            >
              {id && <SocketHandler id={id} />}
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
                <View style={styles.collectionWrapper}>
                  {renderBannerImage()}
                </View>
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
                  <Menu opened={openDial2}>
                    <MenuTrigger />
                    <MenuOptions
                      optionsContainerStyle={{
                        width: SIZE(60),
                        backgroundColor: Colors.BLACK1,
                      }}>
                      <MenuOption>
                        <Text style={{color: '#FFFFFF'}}>Copied!</Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                  <CopyProfile width={SIZE(12)} height={SIZE(12)} />
                </TouchableOpacity>
                <View style={styles.iconWrapper}>{renderIconImage()}</View>
                <View style={styles.userDetailsWrapper}>
                  {renderProfileNameAndId()}
                </View>
                <View style={styles.socialSiteView}>
                  {userDetails?.twitterSite ? (
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'https://twitter.com/' + userDetails?.twitterSite,
                        )
                      }>
                      <Twitter width={SIZE(35)} height={SIZE(35)} />
                    </TouchableOpacity>
                  ) : null}
                  {userDetails?.instagramSite ? (
                    <TouchableOpacity
                      style={styles.socialSiteButton}
                      onPress={() =>
                        Linking.openURL(
                          'https://www.instagram.com/' +
                            userDetails?.instagramSite,
                        )
                      }>
                      <Instagram width={SIZE(35)} height={SIZE(35)} />
                    </TouchableOpacity>
                  ) : null}
                  {userDetails?.youtubeSite ? (
                    <TouchableOpacity
                      style={styles.socialSiteButton}
                      onPress={() => Linking.openURL(userDetails?.youtubeSite)}>
                      <YouTubeIcon width={SIZE(35)} height={SIZE(35)} />
                    </TouchableOpacity>
                  ) : null}
                  {userDetails?.discordSite ? (
                    <TouchableOpacity
                      style={styles.socialSiteButton}
                      onPress={() => Linking.openURL(userDetails?.discordSite)}>
                      <DiscordIcon width={SIZE(35)} height={SIZE(35)} />
                    </TouchableOpacity>
                  ) : null}
                  {userDetails?.website ? (
                    <TouchableOpacity
                      style={styles.socialSiteButton}
                      onPress={() => Linking.openURL(userDetails?.website)}>
                      <WebIcon width={SIZE(35)} height={SIZE(35)} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {!route.params && (
                  <EditButton
                    style={{
                      alignSelf: 'center',
                      width: wp(60),
                      height: hp(3),
                      marginTop: SIZE(5),
                    }}
                    onPress={() =>
                      navigation.navigate('EditProfile', {userDetails})
                    }>
                    <EditButtonText>
                      {translate('wallet.common.editprofile')}
                    </EditButtonText>
                  </EditButton>
                )}
                <ActionSheet
                  ref={actionSheetRef}
                  title={translate('wallet.common.choosePhoto')}
                  options={[
                    translate('wallet.common.takePhoto'),
                    translate('wallet.common.choosePhotoFromGallery'),
                    translate('wallet.common.cancel'),
                  ]}
                  cancelButtonIndex={2}
                  onPress={selectActionSheet}
                />
              </View>
            </View>
          </View>
          {/* <View style={{flex: socialSite ? 0.4 : 0.45}}>
          <View style={styles.tabView}>{renderTabView(id)}</View>
        </View> */}

          <View style={styles.tabView}>{renderTabView(id)}</View>
        </View>
      </ScrollView>
    </AppBackground>
    // </Container>
  );
}

export default Profile;

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
    width: SIZE(150),
    height: SIZE(150),
    borderRadius: SIZE(150),
    marginBottom: SIZE(10),
    backgroundColor: colors.PERIWINKLE,
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
  socialSiteButton: {
    marginLeft: SIZE(12),
  },
  socialSiteView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZE(15),
  },
  tabView: {
    height: height / 1.5,
    marginTop: SIZE(5),
  },
});
