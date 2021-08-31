import React, { useState } from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import {
    COLORS,
    SIZE,
    SVGS,
    FONT
} from 'src/constants';
import {
    Header,
    HeaderLeft,
    SpaceView,
    Container,
    CenterWrap,
    RowWrap
} from 'src/styles/common.styles';
import {
    LargeText,
    GreySmallText,
} from 'src/styles/text.styles';
import {
    MainContent,
    BottomView,
    SendAgainText
} from './styled';
import { DefaultButton } from 'src/components';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const {
    LogoIcon,
    LeftArrowIcon,
} = SVGS;

function OTPScreen({
    navigation
}) {

    return (
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
                            {`Enter the verify code`}
                        </LargeText>
                        <SpaceView mTop={SIZE(34)} />
                        <OTPInputView
                            style={{
                                width: SIZE(250),
                                height: SIZE(39)
                            }}
                            codeInputFieldStyle={{
                                width: SIZE(39),
                                height: SIZE(39),
                                borderRadius: SIZE(2.5),
                                color: COLORS.BLACK1,
                                padding: 0,
                                fontSize: FONT(16),
                            }}
                            pinCount={4}
                        />
                        <SpaceView mTop={SIZE(22)} />
                        <GreySmallText>
                            {'- The code expires in 10 minutes.'}
                        </GreySmallText>
                    </CenterWrap>
                </MainContent>
                <BottomView>
                    <DefaultButton
                        onPress={() => navigation.navigate('Password')}
                        color={COLORS.BLUE2}
                        text={'Next'}
                    />
                    <SpaceView mTop={SIZE(28)} />
                    <RowWrap>
                        <GreySmallText>
                            {'09:59 '}
                        </GreySmallText>
                        <TouchableOpacity>
                            <SendAgainText>
                                {'Send Again'}
                            </SendAgainText>
                        </TouchableOpacity>
                    </RowWrap>
                    <SpaceView mTop={SIZE(14.46)} />
                </BottomView>
            </Container>
        </TouchableWithoutFeedback>
    )
}

export default OTPScreen;