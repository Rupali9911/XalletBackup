import React, { useState, useRef } from 'react';
import {
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';
import {
    Header,
    HeaderLeft,
    HeaderRight,
    Container,
    RowBetweenWrap,
    CenterWrap,
    RowWrap,
    SpaceView,
    BorderView
} from 'src/styles/common.styles';
import {
    HeaderText,
    NormalText,
} from 'src/styles/text.styles';
import {
    SIZE,
    IMAGES,
    SVGS,
} from 'src/constants';
import {
    C_Image,
} from 'src/components';
import {
    Avatar,
    ChangeAvatar,
    DoneText,
    EditableInput,
    MultiLineEditableInput
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
import { useSelector, useDispatch } from 'react-redux';
import { upateUserData } from '../../store/reducer/userReducer';
import { alertWithSingleBtn, validateEmail, validURL } from '../../utils';
import { signOut } from '../../store/reducer/userReducer';

const {
    LeftArrowIcon,
} = SVGS;
const {
    DEFAULTPROFILE
} = IMAGES;

function Profile({
    navigation,
}) {

    const { UserReducer } = useSelector(state => state);
    const [loading, setLoading] = useState(false);
    const [username, setUserName] = useState(UserReducer.data.user.name || UserReducer.data.user.username);
    const [title, setTitle] = useState(UserReducer.data.user.title || UserReducer.data.user.firstName + ' ' + UserReducer.data.user.lastName);
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
    const dispatch = useDispatch();

    const OPEN_CAMERA = 0;
    const OPEN_GALLERY = 1;

    const onPhoto = () => {
        actionSheetRef.current.show();
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

        if (!validateEmail(email)) {
            alert('Email is not validated');
            return;
        }

        if (!validURL(website)) {
            alert('Website is not validated');
            return;
        }

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
                dispatch(upateUserData(res.data.data));
                navigation.goBack();
            })
            .catch(err => {
                alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.networkFailed"),
                    () => {
                        console.log(err);
                    }
                );
            })

        setLoading(false);
    }

    return (
        <AppBackground hideSafeArea lightStatus isBusy={loading}>
            <SafeAreaView style={{ flex: 1 }}>
                <Header>
                    <HeaderLeft>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <LeftArrowIcon />
                        </TouchableOpacity>
                    </HeaderLeft>
                    <HeaderText>
                        {translate("wallet.common.profileSettings")}
                    </HeaderText>
                    <HeaderRight>
                        <TouchableOpacity onPress={onSave}>
                            <DoneText>
                                {translate("wallet.common.done")}
                            </DoneText>
                        </TouchableOpacity>
                    </HeaderRight>
                </Header>
                <KeyboardAwareScrollView flex={1}>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(10)} />
                        <Avatar>
                            <C_Image
                                uri={photo.uri}
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
                            value={username}
                            onChangeText={setUserName}
                            placeholder={translate("common.UserName")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.artistname")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder={translate("common.artistname")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("wallet.common.firstName")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder={translate("wallet.common.firstName")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("wallet.common.lastName")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder={translate("wallet.common.lastName")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.address")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder={translate("common.address")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.phoneNumber")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder={translate("common.phoneNumber")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.email")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder={translate("common.email")} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {translate("common.website")}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder={translate("common.website")} />
                    </RowBetweenWrap>
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
                            placeholder={translate("wallet.common.aboutMe")} />
                    </RowWrap>

                    <ActionSheet
                        ref={actionSheetRef}
                        title={translate("wallet.common.choosePhoto")}
                        options={[translate("wallet.common.takePhoto"), translate("wallet.common.choosePhotoFromGallery"), translate("wallet.common.cancel")]}
                        cancelButtonIndex={2}
                        onPress={selectActionSheet}
                    />
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </AppBackground>
    )
}

export default Profile;