import React, { useState } from 'react';
import {
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import {
    COLORS,
    SIZE,
    SVGS,
    WIDTH,
    IMAGES,
} from 'src/constants';
import {
    Header,
    HeaderLeft,
    SpaceView,
    Container,
    CenterWrap,
    BorderView
} from 'src/styles/common.styles';
import {
    LargeText,
    BoldText,
    RegularText
} from 'src/styles/text.styles';
import {
    MainContent,
    IconImage,
    Description,
    Separator,
    SeparatorLabel,
    BottomView,
    LabelSeparatorContainer,
    Content
} from './styled';
import { TextInput, DefaultButton, LoaderIndicator } from 'src/components';
import { useDispatch, useSelector } from 'react-redux';
// import { SendOTP } from "../../store/actions/authActions";
import { translate } from "../../utils";

const {
    LogoIcon,
    LeftArrowIcon,
} = SVGS;

const {
    TROUBLELOGIN
} = IMAGES;

function LabelSeparator(props) {
    return (
        <LabelSeparatorContainer>
            <Separator />
            {props.label &&
                <SeparatorLabel>{props.label}</SeparatorLabel>
            }
            <Separator />
        </LabelSeparatorContainer>
    )
}

function ForgetPasswordScreen({
    navigation
}) {

    const dispatch = useDispatch();
    const { authLoading } = useSelector((state) => state.AuthReducer);

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const sendOtp = () => {

        setError("")
        if (email) {

            setError("")
            let obj = {
                userName: email
            }
            dispatch(SendOTP(obj, navigation))

        } else {
            setError(translate("common.error.fieldRequired"))
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
            </Header>
            <MainContent>
                <Content>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(30)} />
                        <IconImage>
                            <Image source={TROUBLELOGIN} style={{ flex: 1, height: null, width: null }} />
                        </IconImage>
                        <SpaceView mTop={SIZE(20)} />
                        <LargeText>
                            {translate("common.troubleLogin")}
                        </LargeText>
                    </CenterWrap>
                    <SpaceView mTop={SIZE(40)} />
                    <Description>
                        {translate("common.forgotHint")}
                    </Description>
                    <SpaceView mTop={SIZE(30)} />
                    <TextInput
                        value={email}
                        onChangeText={v => setEmail(v)}
                        placeholder={translate("common.emailPhoneUsername")}
                        error={error}
                    />
                    <SpaceView mTop={SIZE(24)} />
                    <DefaultButton
                        // onPress={sendOtp}
                        color={COLORS.BLUE2}
                        text={translate("common.sendLoginLink")}
                    />
                    <SpaceView mTop={SIZE(10)} />
                    <LabelSeparator label={translate("common.or")} />
                    <SpaceView mBottom={SIZE(10)} />
                    <CenterWrap>
                        <TouchableOpacity onPress={() => navigation.navigate("Signup")} >
                            <BoldText>{translate("common.createNewAccount")}</BoldText>
                        </TouchableOpacity>
                    </CenterWrap>
                </Content>
                <BottomView>
                    <>
                        <View style={{ width: WIDTH }} >
                            <BorderView height={1} />
                            <SpaceView mBottom={SIZE(10)} />
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()} >
                            <RegularText>{translate("common.backToLogin")}</RegularText>
                        </TouchableOpacity>
                    </>
                </BottomView>
            </MainContent>
        </Container>
    )
}

export default ForgetPasswordScreen;