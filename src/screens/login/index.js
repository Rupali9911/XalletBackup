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
    SpaceView,
    BorderView,
    Container,
    CenterWrap,
    RowWrap
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
    BottomArrowIcon
} = SVGS;

function Login({
    navigation
}) {

    return (
        <Container>
            <Header>
                <RowWrap>
                    <HeaderText>
                        {'English (United States)'}
                    </HeaderText>
                    <SpaceView mRight={SIZE(12)} />
                    <BottomArrowIcon />
                </RowWrap>
            </Header>
            <MainContent>
                <KeyboardAwareScrollView>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(30)} />
                        <LogoIcon />
                        <SpaceView mTop={SIZE(40)} />
                        <LargeText>
                            {'Log in'}
                        </LargeText>
                    </CenterWrap>
                    <SpaceView mTop={SIZE(55)} />
                    <TextInput placeholder={'Phone number or email'} />
                    <SpaceView mTop={SIZE(24)} />
                    <TextInput placeholder={'Password'} />
                    <SpaceView mTop={SIZE(29)} />
                    <DefaultButton
                        onPress={() => navigation.navigate('Home')}
                        color={COLORS.BLUE2}
                        isBorder={true}
                        text={'Log in'}
                    />
                    <SpaceView mTop={SIZE(28)} />
                    <CenterWrap>
                        <TouchableOpacity>
                            <GreySmallText>
                                {'Forgot your login details? Get help signing in.'}
                            </GreySmallText>
                        </TouchableOpacity>
                    </CenterWrap>
                </KeyboardAwareScrollView>
            </MainContent>
            <BorderView />
            <BottomView>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <GreySmallText>
                        {`Don't have an account? Signup.`}
                    </GreySmallText>
                </TouchableOpacity>
            </BottomView>
        </Container>
    )
}

export default Login;