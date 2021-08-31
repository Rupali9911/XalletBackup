import React, { useState } from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native';
import {
    COLORS,
    SIZE,
    SVGS,
    IMAGES,
} from 'src/constants';
import {
    Header,
    HeaderLeft,
    SpaceView,
    Container,
    RowWrap
} from 'src/styles/common.styles';
import {
    HeaderText,
    RegularText,
    LargeText
} from 'src/styles/text.styles';
import {
    MainContent,
    ProfileImage,
} from './styled';
import { TextInput, DefaultButton, LoaderIndicator } from 'src/components';
import { useDispatch, useSelector } from 'react-redux';
// import { updatePassword } from "../../store/actions/authActions";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from "../../utils";

const {
    LeftArrowIcon,
} = SVGS;

const {
    DEFAULTPROFILE
} = IMAGES;

function ChangePasswordScreen({
    navigation
}) {

    const dispatch = useDispatch();
    const { authLoading, email, phone, userName, data } = useSelector((state) => state.AuthReducer);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});

    const changePassword = () => {
        let errorList = {};
        !oldPassword ?
            errorList["oldPassword"] = translate("common.error.fieldRequired") :
            !newPassword ? errorList["newPassword"] = translate("common.error.fieldRequired") :
                !confirmPassword ? errorList["newCPassword"] = translate("common.error.fieldRequired") :
                    newPassword !== confirmPassword ? errorList["newCPassword"] = translate("common.error.passwordDoesntMatch") : {};

        setError(errorList)
        if (Object.keys(errorList).length == 0) {
            setError({});
            let body = {
                userName: userName ? userName : email ? email : phone,
                currentPassword: oldPassword,
                newPassword,
                newPasswordConfirm: confirmPassword
            }

            console.log(body);

            dispatch(updatePassword(body, navigation))

        }
    }

    return (
        <Container>

            {
                authLoading && <LoaderIndicator />
            }

            <Header>
                <HeaderLeft>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowIcon />
                    </TouchableOpacity>
                </HeaderLeft>
                <HeaderText>
                    {translate("common.changePassword")}
                </HeaderText>
            </Header>
            <KeyboardAwareScrollView >
                <MainContent>
                    <RowWrap>
                        <ProfileImage>
                            <Image source={DEFAULTPROFILE} style={{ flex: 1, height: null, width: null }} />
                        </ProfileImage>
                        <LargeText>{data.userName}</LargeText>
                    </RowWrap>
                    <SpaceView mTop={SIZE(30)} />

                    <RegularText>{translate("common.oldPassword")}</RegularText>
                    <SpaceView mTop={SIZE(12)} />
                    <TextInput
                        value={oldPassword}
                        onChangeText={(e) => setOldPassword(e)}
                        placeholder={''}
                        secureText
                        error={error["oldPassword"]}
                    />
                    <SpaceView mTop={SIZE(12)} />
                    <RegularText>{translate("common.newPassword")}</RegularText>
                    <SpaceView mTop={SIZE(12)} />
                    <TextInput
                        value={newPassword}
                        secureText
                        onChangeText={(e) => setNewPassword(e)}
                        placeholder={''}
                        error={error["newPassword"]}
                    />
                    <SpaceView mTop={SIZE(12)} />
                    <RegularText>{translate("common.confirmNewPassword")}</RegularText>
                    <SpaceView mTop={SIZE(12)} />
                    <TextInput
                        value={confirmPassword}
                        onChangeText={(e) => setConfirmPassword(e)}
                        placeholder={''}
                        secureText
                        error={error["newCPassword"]}
                    />
                    <SpaceView mTop={SIZE(20)} />
                    <DefaultButton
                        color={COLORS.BLUE2}
                        secureText
                        text={translate("common.changePassword")}
                    />
                </MainContent>
            </KeyboardAwareScrollView>
        </Container>
    )
}

export default ChangePasswordScreen;