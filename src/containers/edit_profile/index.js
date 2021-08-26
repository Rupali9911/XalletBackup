import React, { useState } from 'react';
import {
    TouchableOpacity,
    Image,
    FlatList
} from 'react-native';
import {
    Header,
    HeaderLeft,
    HeaderRight,
    Container,
    ModelView,
    RowBetweenWrap,
    CenterWrap,
    RowWrap,
    SpaceView,
    BorderView
} from 'src/styles/common.styles';
import {
    HeaderText,
    SmallBoldText,
    SmallNormalText,
    NormalText,
} from 'src/styles/text.styles';
import {
    COLORS,
    SIZE,
    IMAGES,
    SVGS,
    FONT
} from 'src/constants';
import {
    Avatar,
    ChangeAvatar,
    DoneText,
    EditableInput
} from './styled';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';

const {
    LeftArrowIcon,
} = SVGS;
const {
    GIRL
} = IMAGES;

function Profile({
    navigation,
}) {

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowIcon />
                    </TouchableOpacity>
                </HeaderLeft>
                <HeaderText>
                    {'Edit Profile'}
                </HeaderText>
                <HeaderRight>
                    <TouchableOpacity>
                        <DoneText>
                            {'Done'}
                        </DoneText>
                    </TouchableOpacity>
                </HeaderRight>
            </Header>
            <KeyboardAwareScrollView>
                <CenterWrap>
                    <SpaceView mTop={SIZE(10)} />
                    <Avatar>
                        <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                    </Avatar>
                    <SpaceView mTop={SIZE(7)} />
                    <TouchableOpacity onPress={() => { }}>
                        <ChangeAvatar>
                            {'Change profile photo'}
                        </ChangeAvatar>
                    </TouchableOpacity>
                    <SpaceView mTop={SIZE(17)} />
                </CenterWrap>
                <BorderView />
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {'Name'}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {'Username'}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {'Website'}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {'Bio'}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
            </KeyboardAwareScrollView>
        </Container>
    )
}

export default Profile;