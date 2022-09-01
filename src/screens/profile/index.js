import React, { useEffect, useState, useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import _, { size } from 'lodash';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    RefreshControl,
    Image,
    Dimensions
} from 'react-native';

import Hyperlink from 'react-native-hyperlink';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { openSettings } from 'react-native-permissions'
import { confirmationAlert } from '../../common/function';

import { COLORS, FONT, FONTS, SIZE, SVGS, IMAGES } from 'src/constants';
import { Container, RowWrap, SpaceView } from 'src/styles/common.styles';
import { SmallBoldText, SmallNormalText } from 'src/styles/text.styles';
import {
    responsiveFontSize as RF,
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from '../../common/responsiveFunction';
import { AppHeader, C_Image } from '../../components';
import { fonts } from '../../res';
import { languageArray, translate } from '../../walletUtils';
import {
    DescriptionView,
    EditButton,
    EditButtonText,
    SmallText,
    UserImageView,
    WebsiteLink,
} from './styled';
import Collection from "./collection";
import NFTCreated from './nftCreated';
import NFTOwned from './nftOwned';
import Draft from './draft';
import colors from "../../res/colors";
import { upateUserData, loadFromAsync, loadProfileFromAsync, setUserData } from "../../store/reducer/userReducer";
import { getAllLanguages, setAppLanguage } from "../../store/reducer/languageReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/Colors";
import Images from '../../constants/Images';
import { SvgWithCssUri } from 'react-native-svg';
import { NEW_BASE_URL } from '../../common/constants';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message'
import { DEFAULT_DATE_FORMAT } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { updateAvtar, updateBanner } from '../../store/actions/myNFTaction';


const { ConnectSmIcon, SettingIcon, CopyToClipboard, EditImage, CopyProfile } = SVGS;

const Tab = createMaterialTopTabNavigator();

function Profile({ navigation, connector, route }) {

    const [userData, setUserData] = useState([])
    const [openDial1, setOpenDial1] = useState(false)
    const [openDial2, setOpenDial2] = useState(false)
    const { UserReducer } = useSelector(state => state);
    // const [photo, setPhoto] = useState()
    // const [banner, setBanner] = useState();
    const actionSheetRef = useRef(null);

    const dispatch = useDispatch();
    const id = route.params.id


    const token = UserReducer.userData.access_token


    // const id = UserReducer?.wallet?.address || UserReducer?.userData?.user?.username;
    // const id = '0x5d19dc1141f866826e246098e9f122eb4b11910c'

    console.log(userData, '>>>>>> main data')

    const OPEN_CAMERA = 0;
    const OPEN_GALLERY = 1;


    // const { about, title, links, username, role, profile_image } = UserReducer?.data?.user;
    // useEffect(() => {
    //     Update the document title using the browser API
    //     UserReducer.data.user.profile_image,
    //     UserReducer.data.user.about,
    //     UserReducer.data.user.title,
    //     UserReducer.data.user.links,
    //     UserReducer.data.user.username,
    //     UserReducer.data.user.role

    //     console.log('UserReducer.data.user.profile_image ', UserReducer.data.user.profile_image)
    // });

    const fetchData = () => {
        const url = `${NEW_BASE_URL}/users/${id}`
        fetch(url)
            .then((response) => response.json())
            .then((data) => setUserData(data))
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const toastConfig = {
        my_custom_type: ({ text1, props, ...rest }) => (
            <View
                style={{
                    zIndex: 100,
                    alignItems: 'center',
                    width: wp('35%'),
                    paddingHorizontal: wp('2%'),
                    borderRadius: wp('10%'),
                    paddingVertical: hp('1%'),
                    backgroundColor: colors.GREY2,
                }}>
                <Text style={{ color: colors.black, fontWeight: 'bold' }}>{text1}</Text>
            </View>
        ),
    };

    const copyToClipboard = () => {
        Clipboard.setString(id);
        setOpenDial1(true)
        setTimeout(() => {
            setOpenDial1(false)
        }, 500)
    };

    const copyProfileToClipboard = () => {
        Clipboard.setString(`https://xanalia.com/profile/${id}`);
        setOpenDial2(true)
        setTimeout(() => {
            setOpenDial2(false)
        }, 500)
    };


    // const checkVideoUrl =
    //     uriType === 'mp4' ||
    //     uriType === 'MP4' ||
    //     uriType === 'mov' ||
    //     uriType === 'MOV';

    const renderTabView = () => {
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
                        // marginTop: SIZE(-10),
                    },
                    tabBarLabelStyle: {
                        fontSize: FONT(12),
                        textTransform: 'none',
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: COLORS.BLUE4,
                        top: true,
                        height: 2,
                    },

                }}>
                <Tab.Screen
                    name={translate('wallet.common.profileCreated')}
                    component={NFTCreated}
                    initialParams={{ id: id }}
                />
                <Tab.Screen
                    name={translate('wallet.common.owned')}
                    component={NFTOwned}
                    initialParams={{ id: id }}
                />
            </Tab.Navigator>
        );
    };

    let imageType = ''

    const onSelect = (from) => {
        imageType = from
        actionSheetRef.current.show();
    }

    const selectActionSheet = async (index) => {
        console.log(index, '???????', imageType)
        const options = {
            title: 'Select Your Photo',
            storageOptions: {
                skipBackup: true,
                cropping: true,
                privateDirectory: true
            },
            quality: 0.5,
        };

        if (index === OPEN_CAMERA) {

            ImagePicker.openCamera({
                height: 512,
                width: 512,
                cropping: true
            }).then(image => {
                console.log('Response from camera', image)
                if (image.height <= 512 && image.width <= 512) {
                    let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename ? image.filename : image.path.substring(image.path.lastIndexOf('/') + 1)
                    let uri = Platform.OS === 'android' ? image.path : image.sourceURL

                    let temp = {
                        path: image.path,
                        uri: uri,
                        type: image.mime,
                        fileName: filename,
                        image: image
                    }
                    // console.log("🚀 ~ file: index.js ~ line 212 ~ ~ imageType", imageType, temp.type)
                    if (imageType === 'profile') {
                        // setPhoto(temp)
                        updateAvtar(userData.id, token, temp)
                    } else if (imageType === 'banner') {
                        // setBanner(temp)
                        updateBanner(userData.id, temp, token)
                    }
                }
            }).catch(async e => {
                console.log('Error from openCamera', e, e.code)
                if (e.code && (e.code === 'E_NO_CAMERA_PERMISSION' || e.code === 'E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR')) {
                    // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);
                    // if (isGranted===false) {
                    confirmationAlert(
                        translate("wallet.common.cameraPermissionHeader"),
                        translate("wallet.common.cameraPermissionMessage"),
                        translate("common.Cancel"),
                        translate("wallet.common.settings"),
                        () => openSettings(),
                        () => null
                    )
                    // }
                }
            })
        } else if (index === OPEN_GALLERY) {
            ImagePicker.openPicker({
                mediaType: "photo",
                height: 512,
                width: 512,
                cropping: true
            }).then(image => {
                console.log('Response from storage', image)

                if (image.height <= 512 && image.width <= 512) {

                    let filename = Platform.OS === 'android' ? image.path.substring(image.path.lastIndexOf('/') + 1) : image.filename

                    let uri = Platform.OS === 'android' ? image.path : image.sourceURL

                    let temp = {
                        path: image.path,
                        uri: uri,
                        type: image.mime,
                        fileName: filename,
                        image: image
                    }
                    console.log("🚀 ~ file: index.js ~ line 212 ~ ~ imageType", imageType, temp.type)
                    if (imageType === 'profile') {
                        console.log(temp, '>>>>>> temp')
                        // setPhoto(temp)
                        updateAvtar(userData.id, temp, token)
                    } else if (imageType === 'banner') {
                        // setBanner(temp)
                        updateBanner(userData.id, temp, token)
                    }
                }
            }).catch(async e => {
                console.log('Error from openPicker', e)
                if (e.code && e.code === 'E_NO_LIBRARY_PERMISSION') {
                    // const isGranted = await Permission.checkPermission(PERMISSION_TYPE.storage);
                    // if (isGranted === false) {
                    confirmationAlert(
                        translate("wallet.common.storagePermissionHeader"),
                        translate("wallet.common.storagePermissionMessage"),
                        translate("common.Cancel"),
                        translate("wallet.common.settings"),
                        () => openSettings(),
                        () => null
                    )
                    // }
                }
            })
        }
    }


    const [refreshing, setRefreshing] = React.useState(false);
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const onRefresh = () => {
        setRefreshing(true);
        loadAllData()
    }

    const loadAllData = () => {
        dispatch(loadProfileFromAsync(id))
            .then(() => {
                setRefreshing(false)
            })
            .catch((err) => {
                setRefreshing(false)
            });
    }

    const renderBannerImage = () => {
        return (
            route.params.from === 'me' ? <C_Image uri={UserReducer?.userData?.user?.banner}
                imageStyle={styles.collectionListImage} /> :
                <C_Image uri={userData.banner}
                    imageStyle={styles.collectionListImage} />
        )
    }

    const renderIconImage = () => {
        return (
            <TouchableOpacity onPress={() => onSelect('profile')}>
                {route.params.from === 'me' ? <C_Image uri={UserReducer?.userData?.user?.profile_image}
                    imageStyle={styles.iconImage} /> :
                    <C_Image uri={userData.avatar}
                        imageStyle={styles.iconImage} />}
            </TouchableOpacity>
        )
    }

    const hideDialog = () => setVisible(false);

    const renderProfileNameAndId = () => {
        return (
            <View style={styles.profileInfo}>
                <View style={styles.userNameView}>
                    <Text style={styles.userNameText}>{userData.userName}</Text>
                </View>
                <View style={styles.userIdView}>
                    <Text style={styles.userIdText}>{userData?.userWallet?.address.substring(0, 6)}...{userData?.userWallet?.address.substring(userData?.userWallet?.address.length - 4, userData?.userWallet?.address.length)}</Text>
                    <TouchableOpacity onPress={() => copyToClipboard()} >
                        <Menu opened={openDial1} >
                            <MenuTrigger />
                            <MenuOptions optionsContainerStyle={{ width: SIZE(60), backgroundColor: Colors.BLACK1 }}>
                                <MenuOption>
                                    <Text style={{ color: '#FFFFFF' }}>Copied!</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                        <CopyToClipboard
                            // onPress={() => copyToClipboard()}
                            style={{ marginLeft: SIZE(6) }}
                            width={SIZE(16)}
                            height={SIZE(16)} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Container>
            <ScrollView
                contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.themeColor}
                    />
                }
            >
                <View>
                    <TouchableOpacity style={styles.settings}
                        onPress={() => navigation.navigate('Setting', { connector: connector })}>
                        <SettingIcon width={SIZE(23)} height={SIZE(23)} />
                    </TouchableOpacity>
                    <View style={styles.collectionWrapper}>
                        {renderBannerImage()}
                    </View>
                    {route.params.from === 'me' && <TouchableOpacity style={styles.editImage} onPress={() => onSelect('banner')}>
                        <EditImage width={SIZE(12)} height={SIZE(12)} />
                    </TouchableOpacity>}
                    <TouchableOpacity style={styles.copyProfile} onPress={() => copyProfileToClipboard()}>
                        <Menu opened={openDial2} >
                            <MenuTrigger />
                            <MenuOptions optionsContainerStyle={{ width: SIZE(60), backgroundColor: Colors.BLACK1 }}>
                                <MenuOption>
                                    <Text style={{ color: '#FFFFFF' }}>Copied!</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                        <CopyProfile width={SIZE(12)} height={SIZE(12)} />
                    </TouchableOpacity>
                    <View style={styles.iconWrapper}>
                        {renderIconImage()}
                        {renderProfileNameAndId()}
                    </View>
                    {route.params.from === 'me' && <EditButton style={{ alignSelf: 'center', width: wp(60), height: hp(3) }} onPress={() => navigation.navigate('EditProfile')}>
                        <EditButtonText>{translate('wallet.common.editprofile')}</EditButtonText>
                    </EditButton>}
                    <View style={route.params.from === 'me' ? styles.tabBarView1 : styles.tabBarView2}>
                        {renderTabView()}
                    </View>
                    <ActionSheet
                        ref={actionSheetRef}
                        title={translate("wallet.common.choosePhoto")}
                        options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
                        cancelButtonIndex={2}
                        onPress={selectActionSheet}
                    />
                </View>

                {/* <AppHeader
                    title={translate('wallet.common.myPage')}
                    showRightButton
                    // showBackButton
                    rightButtonComponent={
                        <SettingIcon width={SIZE(23)} height={SIZE(23)} />
                    }
                    onPressRight={() =>
                        navigation.navigate('Setting', { connector: connector })
                    }
                /> */}
                {/* <View
                    style={{
                        width: '100%',
                        paddingHorizontal: SIZE(14),
                        flexDirection: 'row',
                    }}>
                    <UserImageView>
                        <C_Image
                            uri={profile_image}
                            imageStyle={{
                                width: '100%',
                                height: '100%',
                            }}
                            imageType="profile"
                        />
                    </UserImageView>
                    <View style={{
                        flex: 1, justifyContent: "center",
                        alignItems: "flex-end", paddingLeft: wp("4")
                    }}>
                        <View
                            style={{
                                flexDirection: 'row',
                            }}>
                            <View style={{ alignItems: 'center', width: wp("17") }}>
                                <Text style={styles.countLabel1}>{'0'}</Text>
                                <SmallText>{translate('wallet.common.post')}</SmallText>
                            </View>
                            <View style={{ alignItems: 'center', width: wp("17") }}>
                                <Text style={styles.countLabel1}>{'0'}</Text>
                                <SmallText>{translate('common.followers')}</SmallText>
                            </View>
                            <View style={{ alignItems: 'center', width: wp("17") }}>
                                <Text style={styles.countLabel1}>{'0'}</Text>
                                <SmallText>{translate('common.following')}</SmallText>
                            </View>
                        </View>
                    </View>
                </View>
                <DescriptionView>
                    <SpaceView mTop={SIZE(12)} />
                    <SmallBoldText>{title || username}</SmallBoldText>
                    <SpaceView mTop={SIZE(8)} />
                    {!_.isEmpty(about) && (
                        <ScrollView style={{ maxHeight: SIZE(70), padding: 5 }}>
                            <Hyperlink
                                onPress={(url, text) => Linking.openURL(url)}
                                linkStyle={{ color: COLORS.BLUE2 }}>
                                <SmallNormalText>{about}</SmallNormalText>
                            </Hyperlink>
                        </ScrollView>
                    )}
                    <SpaceView mTop={SIZE(8)} />
                    {links && !_.isEmpty(links.website) && (
                        <TouchableOpacity
                            onPress={() => {
                                links.website.includes('://')
                                    ? Linking.openURL(links.website)
                                    : Linking.openURL(`https://${links.website}`);
                            }}>
                            <RowWrap>
                                <ConnectSmIcon />
                                <WebsiteLink>
                                    {links.website.includes('://')
                                        ? links.website.split('/')[2]
                                        : links.website}
                                </WebsiteLink>
                            </RowWrap>
                        </TouchableOpacity>
                    )}
                </DescriptionView>
                <SpaceView mTop={SIZE(14)} />
                <RowWrap>
                    <SpaceView mLeft={SIZE(15)} />
                    <EditButton onPress={() => navigation.navigate('EditProfile')}>
                        <EditButtonText>{translate('wallet.common.edit')}</EditButtonText>
                    </EditButton>
                    <SpaceView mRight={SIZE(15)} />
                </RowWrap>
                <SpaceView mTop={SIZE(16)} />
                {renderTabView()} */}
            </ScrollView>
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
        flex: 1
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
        width: "100%",
        overflow: 'hidden',
    },
    collectionWrapper: {
        height: SIZE(200),
        alignItems: 'center'
    },
    iconImage: {
        width: SIZE(160),
        height: SIZE(160),
        borderRadius: SIZE(160),
        marginBottom: SIZE(10)
    },
    iconWrapper: {
        marginTop: SIZE(-80),
        marginBottom: SIZE(10),
        alignItems: 'center'
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
        top: SIZE(10)
    },
    profileInfo: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    userNameView: {
        width: '100%',
        marginBottom: SIZE(6)
    },
    userIdView: {
        width: '100%',
        flexDirection: 'row',
    },
    userNameText: {
        fontSize: SIZE(22),
        fontWeight: '700'
    },
    userIdText: {
        fontFamily: 'Arial'
    },
    tabBarView1: {
        marginTop: SIZE(5),
        width: '100%',
        height: Dimensions.get('window').height - hp(60)
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
        left: SIZE(10)
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
        right: SIZE(10)
    }
});

