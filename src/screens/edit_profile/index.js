import _ from 'lodash';
import React, { useState, useRef } from 'react';
import {
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';
import {
    RowBetweenWrap,
    CenterWrap,
    RowWrap,
    SpaceView,
    BorderView
} from 'src/styles/common.styles';
import {
    NormalText,
} from 'src/styles/text.styles';
import {
    SIZE,
    IMAGES,
    SVGS,
} from 'src/constants';
import {
    C_Image,
    LimitableInput,
} from 'src/components';
import {
    Avatar,
    ChangeAvatar,
    DoneText,
    EditableInput,
    MultiLineEditableInput,
    LimitView,
    WhiteText,
} from './styled';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../walletUtils';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import AppBackground from '../../components/appBackground';
import { AppHeader } from '../../components';
import { useSelector, useDispatch } from 'react-redux';
import { upateUserData } from '../../store/reducer/userReducer';
import { alertWithSingleBtn, validateEmail, validURL } from '../../utils';
import { signOut } from '../../store/reducer/userReducer';
import { hp } from '../../constants/responsiveFunct';
import { Permission, PERMISSION_TYPE } from '../../utils/appPermission';
import { confirmationAlert } from '../../common/function';

function Profile({
    navigation,
}) {

    const { UserReducer } = useSelector(state => state);
    const [loading, setLoading] = useState(false);
    const [username, setUserName] = useState(UserReducer.data.user.name || UserReducer.data.user.username);
    const [title, setTitle] = useState(UserReducer.data.user.title);
    const [firstName, setFirstName] = useState(UserReducer.data.user.firstName);
    const [lastName, setLastName] = useState(UserReducer.data.user.lastName);
    const [address, setAddress] = useState(UserReducer.data.user.address);
    const [phoneNumber, setPhoneNumber] = useState(UserReducer.data.user.phoneNumber);
    const [email, setEmail] = useState(UserReducer.data.user.email);
    const [website, setWebsite] = useState(UserReducer.data.user.links && UserReducer.data.user.links.website);
    const [facebook, setFacebook] = useState(UserReducer.data.user.links && UserReducer.data.user.links.facebook);
    const [twitter, setTwitter] = useState(UserReducer.data.user.links && UserReducer.data.user.links.twitter);
    const [youtube, setYoutube] = useState(UserReducer.data.user.links && UserReducer.data.user.links.youtube);
    const [instagram, setInstagram] = useState(UserReducer.data.user.links && UserReducer.data.user.links.instagram);
    const [about, setAbout] = useState(UserReducer.data.user.about);
    const [photo, setPhoto] = useState({ uri: UserReducer.data.user.profile_image });
    const actionSheetRef = useRef(null);
    const refInput1 = useRef(null);
    const refInput2 = useRef(null);
    const refInput3 = useRef(null);
    const refInput4 = useRef(null);
    const refInput5 = useRef(null);
    const refInput6 = useRef(null);
    const refInput7 = useRef(null);
    const refInput8 = useRef(null);
    const dispatch = useDispatch();

    const OPEN_CAMERA = 0;
    const OPEN_GALLERY = 1;

    const onPhoto = async () => {
        const isGranted = await Permission.checkPermission(PERMISSION_TYPE.camera);

        if (!isGranted) {
            confirmationAlert(
                'This feature requires camera access',
                'To enable access, tap Settings and turn on Camera.',
                'Cancel',
                'Settings',
                () => openSettings(),
                () => null
            )
        } else {
            actionSheetRef.current.show();
        }
    }

    const selectActionSheet = index => {
        const options = {
            title: 'Select Your Photo',
            storageOptions: {
                skipBackup: true,
                cropping: true,
            },
            quality: 0.5,
        };

        if (index === OPEN_CAMERA) {
            launchCamera(options, (response) => {
                if (response.assets) {
                    setPhoto(response.assets[0]);
                }
            });
        } else if (index === OPEN_GALLERY) {
            launchImageLibrary(options, (response) => {
                if (response.assets) {
                    setPhoto(response.assets[0]);
                }
            });
        }
    }

    const onSave = async () => {
        
        if (email && !validateEmail(email)) {
            alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("wallet.common.emailValidation"),
                () => {
                    console.log();
                }
            );
            return;
        }

        if (!firstName && !lastName) {
            alertWithSingleBtn(
                translate("wallet.common.alert"),
                translate("common.usrempty"),
                () => {
                    console.log();
                }
            );
            return;
        }

        // if (website && !validURL(website)) {
        //     alert('Website is not validated');
        //     return;
        // }

        setLoading(true);

        axios.defaults.headers.common['Authorization'] = `Bearer ${UserReducer.data.token}`;

        if (photo.uri !== UserReducer.data.user.profile_image) {
            let formData = new FormData();
            formData.append('profile_image', { uri: photo.uri, name: photo.fileName, type: photo.type });

            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
            await axios.post(`${BASE_URL}/user/update-profile-image`, formData)
                .then(res => {
                    dispatch(upateUserData(res.data.data));
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        alertWithSingleBtn(
                            translate("wallet.common.alert"),
                            translate("common.sessionexpired"),
                            () => {
                                console.log(err);
                            }
                        );
                        dispatch(signOut());
                        return;
                    }
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("wallet.common.error.networkFailed"),
                        () => {
                            console.log(err);
                        }
                    );
                    return;
                });
        }

        const req_body = {
            about,
            address,
            crypto: false,
            email,
            facebook,
            firstName,
            instagram,
            lastName,
            phoneNumber,
            title,
            twitter,
            username,
            website,
            youtube,
        }
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        await axios.post(`${BASE_URL}/user/update-user-profile`, req_body)
            .then(res => {
                let data = res.data.data;
                if (data.name) {
                    data.name = data.name.replace('undefined', '');
                    data.username = data.username.replace('undefined', '');
                }
                dispatch(upateUserData(data));
                navigation.goBack();
            })
            .catch(err => {
                if (err.response.status === 401) {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("common.sessionexpired"),
                        () => {
                            console.log(err);
                        }
                    );
                    dispatch(signOut());
                    return;
                }
                if (err.response.data.data === 'email already taken') {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("common.emailexists"),
                        () => {
                            console.log(err);
                        }
                    );
                } else if (err.response.data.data === 'username already taken') {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("common.usrnameexists"),
                        () => {
                            console.log(err);
                        }
                    );
                } else {
                    alertWithSingleBtn(
                        translate("wallet.common.alert"),
                        translate("wallet.common.error.networkFailed"),
                        () => {
                            console.log(err);
                        }
                    );
                }
            })

        setLoading(false);
    }

    return (
        <AppBackground isBusy={loading}>
            <SafeAreaView style={{ flex: 1 }}>
                <AppHeader
                    title={translate("wallet.common.profileSettings")}
                    showBackButton
                    showRightButton={true}
                    onPressRight={onSave}
                    rightButtonComponent={<DoneText>{translate("wallet.common.done")}</DoneText>}
                />

                <KeyboardAwareScrollView extraScrollHeight={hp('7%')}>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(10)} />
                        <Avatar>
                            <C_Image
                                uri={photo.uri}
                                imageType="profile"
                                imageStyle={{ width: '100%', height: '100%' }}
                            />
                        </Avatar>
                        <SpaceView mTop={SIZE(7)} />
                        <TouchableOpacity onPress={onPhoto}>
                            <ChangeAvatar>
                                {translate("wallet.common.changeprofilephoto")}
                            </ChangeAvatar>
                        </TouchableOpacity>
                        <SpaceView mTop={SIZE(17)} />
                    </CenterWrap>
                    <BorderView />
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.UserName")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            editable={false}
                            value={username.replace('undefined', '')}
                            onChangeText={setUserName}
                            placeholderTextColor={'grey'}
                            returnKeyType="next"
                            onSubmitEditing={() => refInput1.current.focus()}
                            placeholder={translate("common.UserName")} />
                    </RowBetweenWrap>
                    <LimitableInput
                        value={title}
                        onChangeText={setTitle}
                        limit={50}
                        placeholder={translate("common.artistname")} />
                    <LimitableInput
                        value={firstName}
                        onChangeText={setFirstName}
                        limit={50}
                        placeholder={translate("wallet.common.firstName")} />
                    <LimitableInput
                        value={lastName}
                        onChangeText={setLastName}
                        limit={50}
                        placeholder={translate("wallet.common.lastName")} />
                    <LimitableInput
                        value={address}
                        onChangeText={setAddress}
                        limit={50}
                        placeholder={translate("common.address")} />
                    <LimitableInput
                        keyboardType='numeric'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        limit={20}
                        placeholder={translate("common.phoneNumber")} />
                    <LimitableInput
                        value={_.isEmpty(email)}
                        onChangeText={setEmail}
                        limit={20}
                        placeholder={translate("common.email")} />
                    <LimitableInput
                        editable={_.isEmpty(UserReducer.data.user.links && UserReducer.data.user.links.website)}
                        value={website}
                        onChangeText={setWebsite}
                        limit={50}
                        placeholder={translate("common.website")} />
                    <SpaceView mTop={SIZE(12)} />
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("wallet.common.aboutMe")}
                            </NormalText>
                        </RowWrap>
                    </RowBetweenWrap>
                    <SpaceView mTop={SIZE(12)} />
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <MultiLineEditableInput
                            value={about}
                            onChangeText={setAbout}
                            multiline
                            placeholderTextColor={'grey'}
                            placeholder={translate("wallet.common.aboutMe")} />
                    </RowWrap>
                    {about?.length > 200 && (
                        <LimitView>
                            <WhiteText>
                                {translate('wallet.common.limitInputLength', { number: 200 })}
                            </WhiteText>
                        </LimitView>
                    )}
                </KeyboardAwareScrollView>

                <ActionSheet
                    ref={actionSheetRef}
                    title={translate("wallet.common.choosePhoto")}
                    options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
                    cancelButtonIndex={2}
                    onPress={selectActionSheet}
                />
            </SafeAreaView>
        </AppBackground>
    )
}

export default Profile;