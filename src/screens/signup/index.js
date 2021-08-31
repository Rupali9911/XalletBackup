import React, { useState } from 'react';
import {
    TouchableOpacity,
} from 'react-native';
import {
    COLORS,
    SIZE,
    SVGS,
} from 'src/constants';
import {
    Header,
    HeaderLeft,
    SpaceView,
    BorderView,
    Container,
    CenterWrap
} from 'src/styles/common.styles';
import {
    HeaderText,
    GreySmallText,
    LargeText,
} from 'src/styles/text.styles';
import {
    MainContent,
    BottomView
} from './styled';
import { TextInput, DefaultButton } from 'src/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const {
    LogoIcon,
    LeftArrowIcon,
    PhoneIcon,
    EmailIcon
} = SVGS;

function Signup({
    navigation
}) {

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowIcon />
                    </TouchableOpacity>
                </HeaderLeft>
            </Header>
            <KeyboardAwareScrollView>
                <MainContent>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(30)} />
                        <LogoIcon />
                        <SpaceView mTop={SIZE(40)} />
                        <LargeText>
                            {'Sign up'}
                        </LargeText>
                    </CenterWrap>
                    <SpaceView mTop={SIZE(55)} />
                    <TextInput
                        icon={<PhoneIcon width={SIZE(23)} />}
                        placeholder={'Sign up with phone number'}
                    />
                    <SpaceView mTop={SIZE(24)} />
                    <TextInput
                        icon={<EmailIcon width={SIZE(23)} />}
                        placeholder={'Sign up with Email'}
                    />
                    <SpaceView mTop={SIZE(29)} />
                    <DefaultButton
                        onPress={() => navigation.navigate('AddPhone')}
                        color={COLORS.BLUE2}
                        isBorder={true}
                        text={'Sign up'}
                    />
                    <SpaceView mTop={SIZE(28)} />
                    <CenterWrap>
                        <TouchableOpacity>
                            <GreySmallText>
                                {'Forgot your login details? Get help signing in.'}
                            </GreySmallText>
                        </TouchableOpacity>
                    </CenterWrap>
                </MainContent>
            </KeyboardAwareScrollView>
            <BorderView />
            <BottomView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <GreySmallText>
                        {`Don't have an account? Login.`}
                    </GreySmallText>
                </TouchableOpacity>
            </BottomView>
        </Container>
    )
}

export default Signup;