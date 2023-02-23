import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Clipboard from '@react-native-clipboard/clipboard';
import {openSettings} from 'react-native-permissions';
import PopupMenu from '../../components/PopupMenu';
import {useDispatch, useSelector} from 'react-redux';
import {XANALIA_WEB} from '../../common/constants';
import {COLORS, FONT, FONTS, SIZE, SVGS} from 'src/constants';
import {confirmationAlert} from '../../common/function';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {AppHeader, C_Image} from '../../components';
import Colors from '../../constants/Colors';
import CommonStyles from '../../constants/styles';
import {fonts} from '../../res';
import colors from '../../res/colors';
import {
  endLoadingBanner,
  endLoadingImage,
  getUserData,
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
import * as Tabs from 'react-native-collapsible-tab-view';
import SocialMediaLinks from '../../components/SocialMediaLinks/index';
import {SocketHandler} from './socketHandler';
import MultiActionModal from '../certificateScreen/MultiActionModal';

const {
  SettingIcon,
  CopyToClipboard,
  EditImage,
  CopyProfile,
  DefaultProfile,
  VerficationIcon,
} = SVGS;

const {height} = Dimensions.get('window');

function Profile({navigation, connector, route}) {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [backupPhrasePopup, setBackupPhrasePopup] = useState(false);

  // =============== Getting data from reducer ========================
  const {
    otherUserProfileData,
    loading,
    imageAvatarLoading,
    imageBannerLoading,
    userData,
    profilePullToRefresh,
  } = useSelector(state => state.UserReducer);
  const {isBackup} = useSelector(state => state.UserReducer);

  //================== Components State Defination ===================
  const [openDial, setOpenDial] = useState({
    address: false,
    webLink: false,
  });
  const [userDetails, setUserDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [options, setOptions] = useState([]);

  const id = route?.params?.id
    ? route?.params?.id
    : userData?.userWallet?.address;

  const OPEN_CAMERA = 0;
  const OPEN_GALLERY = 1;
  const REMOVE_BANNER = 2;

  //===================== UseEffect Function =========================
  useEffect(() => {
    handleUserData();
  }, [profilePullToRefresh]);

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

  const handleUserData = useCallback(() => {
    dispatch(startLoadingBanner());
    dispatch(startLoadingImage());
    if (route?.params?.id) {
      dispatch(getUserData(route?.params?.id, true));
    } else {
      dispatch(getUserData(userData?.userWallet?.address, false));
    }
  }, []);

  useEffect(() => {
    options.length && actionSheetRef.current.show();
  }, [options]);

  const copyToClipboard = () => {
    Clipboard.setString(id);
    setOpenDial({...openDial, address: true});
    setTimeout(() => {
      setOpenDial({...openDial, address: false});
    }, 500);
  };

  const copyProfileToClipboard = () => {
    Clipboard.setString(`${XANALIA_WEB}/profile/${id}`);
    setOpenDial({...openDial, webLink: true});
    setTimeout(() => {
      setOpenDial({...openDial, webLink: false});
    }, 500);
  };

  const onSelect = from => {
    setSelectedImage(from);
    handleOptions(from);
  };

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
            confirmationAlert(
              translate('wallet.common.cameraPermissionHeader'),
              translate('wallet.common.cameraPermissionMessage'),
              translate('common.Cancel'),
              translate('wallet.common.settings'),
              () => openSettings(),
              () => null,
            );
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
            confirmationAlert(
              translate('wallet.common.storagePermissionHeader'),
              translate('wallet.common.storagePermissionMessage'),
              translate('common.Cancel'),
              translate('wallet.common.settings'),
              () => openSettings(),
              () => null,
            );
          }
        });
    } else if (index === REMOVE_BANNER && selectedImage === 'banner') {
      // dispatch(removeBanner('-1', userDetails.id));
      dispatch(removeBanner('-1', userData?.userWallet?.address));
    }
  };

  const renderVerifiedIcon = () => {
    return <VerficationIcon width={SIZE(25)} height={SIZE(25)} />;
  };
  const renderBannerImage = () => {
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
          onPress={() =>
            isBackup ? onSelect('profile') : setBackupPhrasePopup(true)
          }>
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
            <PopupMenu
              opened={openDial.address}
              items={[{label: `${translate('common.Copied')}!`}]}
              containerStyle={{...CommonStyles.containerStyle}}
              textStyle={{...CommonStyles.textStyle}}
            />
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
          position: 'relative',
          paddingBottom: SIZE(10),
        }}>
        {id && <SocketHandler routeId={route?.params?.id} id={id} />}
        {route.params && (
          <AppHeader title={translate('common.profile')} showBackButton />
        )}
        <View pointerEvents="box-none">
          {!route.params && (
            <TouchableOpacity
              style={styles.settings}
              onPress={() =>
                navigation.navigate('Setting', {connector: connector})
              }>
              <SettingIcon width={SIZE(23)} height={SIZE(23)} />
            </TouchableOpacity>
          )}
          <View style={styles.collectionWrapper} pointerEvents="box-none">
            {renderBannerImage()}
          </View>
          {!route.params && (
            <TouchableOpacity
              style={styles.editImage}
              onPress={() =>
                isBackup ? onSelect('banner') : setBackupPhrasePopup(true)
              }>
              <EditImage width={SIZE(12)} height={SIZE(12)} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.copyProfile}
            onPress={() => copyProfileToClipboard()}>
            <PopupMenu
              opened={openDial.webLink}
              items={[{label: `${translate('common.Copied')}!`}]}
              containerStyle={{...CommonStyles.containerStyle}}
              textStyle={{...CommonStyles.textStyle}}
            />
            <CopyProfile width={SIZE(12)} height={SIZE(12)} />
          </TouchableOpacity>
          <View style={styles.iconWrapper} pointerEvents="box-none">
            <View
              style={[
                styles.iconBadgeVw,
                route?.params?.role === 4
                  ? styles.borderBtnColor
                  : styles.borderTrans,
              ]}
              pointerEvents="box-none">
              {renderIconImage()}
              {route?.params?.role === 4 ? (
                <View style={styles.markIconView}>{renderVerifiedIcon()}</View>
              ) : null}
            </View>
          </View>
          <View style={styles.userDetailsWrapper} pointerEvents="box-none">
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
              onPress={() =>
                isBackup
                  ? navigation.navigate('EditProfile', {userDetails})
                  : setBackupPhrasePopup(true)
              }>
              <EditButtonText>
                {translate('wallet.common.editprofile')}
              </EditButtonText>
            </EditButton>
          )}
          <ActionSheet
            ref={actionSheetRef}
            useNativeDriver={true}
            key={options}
            title={translate('wallet.common.choosePhoto')}
            options={options}
            cancelButtonIndex={selectedImage === 'profile' ? 2 : 3}
            onPress={selectActionSheet}
          />
        </View>

        <MultiActionModal
          isVisible={backupPhrasePopup}
          closeModal={() => setBackupPhrasePopup(false)}
          navigation={navigation}
        />
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
          justifyContent: 'center',
        }}
        activeColor={COLORS.BLUE2}
        inactiveColor={COLORS.BLACK5}
        labelStyle={{
          fontSize: RF(2),
          fontFamily: 'Arial',
        }}
        indicatorStyle={{
          borderBottomColor: COLORS.BLUE2,
        }}
        width={'100%'}
      />
    ),
    [],
  );

  return (
    <AppBackground>
      <Tabs.Container
        renderHeader={RenderHeader}
        lazy={true}
        cancelLazyFadeIn={true}
        initialTabName={translate('wallet.common.profileCreated')}
        renderTabBar={TabBarComponent}>
        <Tabs.Tab
          name={translate('wallet.common.profileCreated')}
          label={translate('wallet.common.profileCreated')}
          key={'profileCreated'}>
          <NFTCreated id={id} isFocused={isFocused} />
        </Tabs.Tab>
        <Tabs.Tab
          name={translate('wallet.common.owned')}
          label={translate('wallet.common.owned')}
          key={'nftOwned'}>
          <NFTOwned id={id} isFocused={isFocused} />
        </Tabs.Tab>
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
