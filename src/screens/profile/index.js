import React, {useEffect, useState, useRef} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import _, {size} from 'lodash';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native';

import Hyperlink from 'react-native-hyperlink';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {openSettings} from 'react-native-permissions';
import {confirmationAlert} from '../../common/function';

import {COLORS, FONT, FONTS, SIZE, SVGS, IMAGES} from 'src/constants';
import {Container, RowWrap, SpaceView} from 'src/styles/common.styles';
import {SmallBoldText, SmallNormalText} from 'src/styles/text.styles';
import {
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../common/responsiveFunction';
import {AppHeader, C_Image} from '../../components';
import {fonts} from '../../res';
import {languageArray, translate} from '../../walletUtils';
import {
  DescriptionView,
  EditButton,
  EditButtonText,
  SmallText,
  UserImageView,
  WebsiteLink,
} from './styled';
import Collection from './collection';
import NFTCreated from './nftCreated';
import NFTOwned from './nftOwned';
import Draft from './draft';
import colors from '../../res/colors';
import {
  upateUserData,
  loadFromAsync,
  loadProfileFromAsync,
  setUserData,
  updateUserData,
} from '../../store/reducer/userReducer';
import {
  getAllLanguages,
  setAppLanguage,
} from '../../store/reducer/languageReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import Images from '../../constants/Images';
import {SvgWithCssUri} from 'react-native-svg';
import {NEW_BASE_URL} from '../../common/constants';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {DEFAULT_DATE_FORMAT} from '../../constants';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  updateAvtar,
  updateBanner,
  getUserData,
} from '../../store/reducer/userReducer';
import sendRequest from '../../helpers/AxiosApiRequest';
import SOCKET_EVENTS from '../../constants/socketContants';
import {useSocketGlobal} from '../../helpers/useSocketGlobal';

const {
  ConnectSmIcon,
  SettingIcon,
  CopyToClipboard,
  EditImage,
  CopyProfile,
  SettingIconBlack,
  DefaultProfile,
} = SVGS;

const Tab = createMaterialTopTabNavigator();

function Profile({navigation, connector, route}) {
  const [openDial1, setOpenDial1] = useState(false);
  const [openDial2, setOpenDial2] = useState(false);
  const {UserReducer} = useSelector(state => state);
  const [walletId, setWalletId] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [processing, setProcessing] = useState(true);
  const actionSheetRef = useRef(null);
  const {userData, loading} = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  let id = UserReducer.userData.userWallet?.address;

  const setWalletAddress = async () => {
    try {
      if (!route?.params?.id) {
        let res = await AsyncStorage.getItem('@USERDATA');
        res = JSON.parse(res);
        setWalletId(res?.userWallet?.address);
        id = res?.userWallet?.address;
        dispatch(getUserData(res?.userWallet?.address));
        setProcessing(false);
      } else {
        setWalletId(route?.params?.id);
        dispatch(getUserData(route?.params?.id));
        id = route?.params?.id;
        setProcessing(false);
      }
    } catch (e) {
      console.log('error', e);
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!processing) {
      if (
        route?.params?.id === userData.userWallet.address ||
        walletId === userData.userWallet.address
      ) {
        setUserDetails(userData);
      }
    }
  }, [userData, processing]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setWalletAddress();
    });
    return unsubscribe;
  }, [navigation]);

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

  const renderTabView = id => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.BLUE2,
          tabBarInactiveTintColor: COLORS.BLACK5,
          tabBarStyle: {
            boxShadow: 'none',
            elevation: 0,
          },
          tabBarItemStyle: {
            height: SIZE(42),
          },
          tabBarLabelStyle: {
            fontSize: FONT(12),
            textTransform: 'none',
          },
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.BLUE4,
            top: SIZE(5),
            height: SIZE(2),
          },
        }}>
        <Tab.Screen
          name={translate('wallet.common.profileCreated')}
          component={NFTCreated}
          initialParams={{id: id}}
        />
        <Tab.Screen
          name={translate('wallet.common.owned')}
          component={NFTOwned}
          initialParams={{id: id}}
        />
      </Tab.Navigator>
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
    return userDetails?.banner ? (
      <C_Image
        uri={userDetails?.banner}
        imageStyle={styles.collectionListImage}
      />
    ) : (
      <View style={styles.collectionWrapper} />
    );
  };

  const renderIconImage = () => {
    const renderImage = () => {
      if (userDetails?.avatar && !loading) {
        return (
          <C_Image uri={userDetails.avatar} imageStyle={styles.iconImage} />
        );
      } else if (!loading && !userDetails?.avatar) {
        return (
          <View style={styles.iconImage}>
            <DefaultProfile width={SIZE(150)} height={SIZE(150)} />
          </View>
        );
      } else if (loading) {
        return <LoadingView />;
      } else return null;
    };
    return (
      <TouchableOpacity onPress={() => onSelect('profile')}>
        {renderImage()}
      </TouchableOpacity>
    );
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

  useSocketGlobal(
    SOCKET_EVENTS.userUpdateAvatar,
    () => {
      dispatch(getUserData(id));
    },
    false,
  );

  useSocketGlobal(
    SOCKET_EVENTS.userUpdateBanner,
    () => {
      dispatch(getUserData(id));
    },
    false,
  );

  return (
    <Container>
      <View
        style={styles.scrollView}
        // refreshControl={
        //     <RefreshControl
        //         refreshing={refreshing}
        //         onRefresh={onRefresh}
        //         tintColor={Colors.themeColor}
        //     />
        // }
      >
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
          <View style={styles.iconWrapper}>
            {renderIconImage()}
            {renderProfileNameAndId()}
          </View>
          {!route.params && (
            <EditButton
              style={{alignSelf: 'center', width: wp(60), height: hp(3)}}
              onPress={() => navigation.navigate('EditProfile', {userDetails})}>
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
      <View style={!route.params ? styles.tabBarView1 : styles.tabBarView2}>
        {renderTabView(id)}
      </View>
    </Container>
  );
}

export default Profile;

const styles = StyleSheet.create({
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
  iconWrapper: {
    marginTop: SIZE(-80),
    marginBottom: SIZE(10),
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
  tabBarView1: {
    marginTop: SIZE(5),
    width: '100%',
    height: Dimensions.get('window').height - hp(60),
  },
  tabBarView2: {
    marginTop: SIZE(5),
    width: '100%',
    height: Dimensions.get('window').height - hp(55),
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
});
