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
import { translate } from '../../walletUtils';

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
                    {translate("common.editprofile")}
                </HeaderText>
                <HeaderRight>
                    <TouchableOpacity>
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
                        <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                    </Avatar>
                    <SpaceView mTop={SIZE(7)} />
                    <TouchableOpacity onPress={() => { }}>
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
                            {translate("common.name")}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {translate("common.UserName")}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {translate("common.website")}
                        </NormalText>
                    </RowWrap>
                    <EditableInput
                        placeholder={'Lorem Ipsum'} />
                </RowBetweenWrap>
                <RowBetweenWrap>
                    <RowWrap>
                        <SpaceView mLeft={SIZE(19)} />
                        <NormalText>
                            {translate("common.bio")}
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