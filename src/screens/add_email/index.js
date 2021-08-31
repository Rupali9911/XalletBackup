import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
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
    Container,
    CenterWrap,
} from 'src/styles/common.styles';
import {
    LargeText,
} from 'src/styles/text.styles';
import {
    MainContent,
    BottomView
} from './styled';
import { TextInput, DefaultButton } from 'src/components';

const {
    LogoIcon,
    LeftArrowIcon,
} = SVGS;

function AddEmail({
    navigation
}) {

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            flex={1}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header>
                        <HeaderLeft>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <LeftArrowIcon />
                            </TouchableOpacity>
                        </HeaderLeft>
                    </Header>
                    <MainContent>
                        <CenterWrap>
                            <SpaceView mTop={SIZE(30)} />
                            <LogoIcon />
                            <SpaceView mTop={SIZE(40)} />
                            <LargeText>
                                {`What's your Email?`}
                            </LargeText>
                        </CenterWrap>
                    </MainContent>
                    <BottomView>
                        <TextInput
                            placeholder={'Please enter your email address'}
                        />
                        <SpaceView mTop={SIZE(15)} />
                        <DefaultButton
                            onPress={() => navigation.navigate('OTP')}
                            color={COLORS.BLUE2}
                            text={'Next'}
                        />
                    </BottomView>
                </Container>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView >
    )
}

export default AddEmail;