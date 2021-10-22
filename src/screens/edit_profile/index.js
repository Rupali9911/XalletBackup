import React, { useState, useRef } from 'react';
import {
    TouchableOpacity,
    Image,
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
import { alertWithSingleBtn } from '../../utils';

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
    const [username, setUserName] = useState(UserReducer.data.user.username);
    const [title, setTitle] = useState(UserReducer.data.user.title);
    const [firstName, setFirstName] = useState(UserReducer.data.user.firstName);
    const [lastName, setLastName] = useState(UserReducer.data.user.lastName);
    const [address, setAddress] = useState(UserReducer.data.user.address);
    const [phoneNumber, setPhoneNumber] = useState(UserReducer.data.user.phoneNumber);
    const [email, setEmail] = useState(UserReducer.data.user.email);
    const [website, setWebsite] = useState(UserReducer.data.user.website);
    const [facebook, setFacebook] = useState(UserReducer.data.user.facebook);
    const [twitter, setTwitter] = useState(UserReducer.data.user.twitter);
    const [youtube, setYoutube] = useState(UserReducer.data.user.youtube);
    const [instagram, setInstagram] = useState(UserReducer.data.user.instagram);
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

        setLoading(true);

        axios.defaults.headers.common['Authorization'] = `Bearer ${UserReducer.data.token}`;

        if (photo) {
            let formData = new FormData();
            formData.append('profile_image', { uri: photo.uri, name: photo.fileName, type: photo.type });

            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
            await axios.post(`${BASE_URL}/user/update-profile-image`, formData)
                .then(res => {
                    dispatch(upateUserData(res.data.data));
                })
                .catch(err => {
                    alertWithSingleBtn(
                        translate("common.alert"),
                        translate("wallet.common.error.networkFailed"),
                        () => {
                            console.log(e);
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
                    translate("common.alert"),
                    translate("wallet.common.error.networkFailed"),
                    () => {
                        console.log(e);
                    }
                );
            })

        setLoading(false);
    }

    return (
        <AppBackground hideSafeArea lightStatus isBusy={loading}>
            <Container>
                <Header>
                    <HeaderLeft>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <LeftArrowIcon />
                        </TouchableOpacity>
                    </HeaderLeft>
                    <HeaderText>
                        {translate("common.editprofile")}
                    </HeaderText>
                    <HeaderRight>
                        <TouchableOpacity onPress={onSave}>
                            <DoneText>
                                {translate("wallet.common.done")}
                            </DoneText>
                        </TouchableOpacity>
                    </HeaderRight>
                </Header>
                <KeyboardAwareScrollView>
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
                                {'Artist Name'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder={'Artist Name'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'First Name'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder={'First Name'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Last Name'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder={'Last Name'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Address'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder={'Address'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'PhoneNumber'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder={'PhoneNumber'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Email Address'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder={'Email Address'} />
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
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Facebook'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={facebook}
                            onChangeText={setFacebook}
                            placeholder={'Facebook'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Twitter'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={twitter}
                            onChangeText={setTwitter}
                            placeholder={'Twitter'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'YouTube'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={youtube}
                            onChangeText={setYoutube}
                            placeholder={'YouTube'} />
                    </RowBetweenWrap>
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'Instagram'}
                            </NormalText>
                        </RowWrap>
                        <EditableInput
                            value={instagram}
                            onChangeText={setInstagram}
                            placeholder={'Instagram'} />
                    </RowBetweenWrap>
                    <SpaceView mTop={SIZE(12)} />
                    <RowBetweenWrap>
                        <RowWrap>
                            <SpaceView mLeft={SIZE(19)} />
                            <NormalText>
                                {'About me'}
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
                            placeholder={'About me'} />
                    </RowWrap>
                </KeyboardAwareScrollView>

                <ActionSheet
                    ref={actionSheetRef}
                    title={'Choose Photo'}
                    options={['Take Photo...', 'Choose Photo from Gallery...', 'Cancel']}
                    cancelButtonIndex={2}
                    onPress={selectActionSheet}
                />
            </Container></AppBackground>
    )
}

export default Profile;