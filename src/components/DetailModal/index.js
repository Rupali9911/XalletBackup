import React from 'react';
import { Animated, Text, TouchableWithoutFeedback, TouchableOpacity, View, Platform, } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import {
    COLORS,
    SIZE,
    WIDTH,
    FONT,
    FONTS
} from 'src/constants';

import {
    RowWrap,
    SpaceView,
    BorderView,
    FlexWrap
} from 'src/styles/common.styles';
import {
    NormalText,
    SmallBoldText
} from 'src/styles/text.styles';
import {
    BlurView
} from '@react-native-community/blur';
import Video from 'react-native-video';

const ModalContainer = styled.View`
    flex: 1;
`;

const MainContent = styled.View`
    background-color: ${COLORS.WHITE1};
    border-radius: ${SIZE(12)}px;
    overflow: hidden;
`;

const ProfileIcon = styled.View`
    width: ${SIZE(28)}px;
    height: ${SIZE(28)}px;
    border-radius: ${SIZE(14)}px;
    background-color: ${COLORS.GREY2};
    overflow: hidden;
`;

const ImageView = styled.View`
    width: ${WIDTH * 0.9};
    height: ${WIDTH * 0.9};
    overflow: hidden;
`;

const ButtonList = styled.View`
    background-color: #ffffff99;
    border-radius: ${SIZE(12)}px;
    overflow: hidden;
    width: ${WIDTH * 0.6};
`;

const ButtonItem = styled.TouchableOpacity`
    padding-left: ${SIZE(20)}px;
    padding-vertical: ${SIZE(12)}px;
`;

const CreatorName = styled.Text`
    font-size: ${FONT(12)}px;
    color: ${COLORS.BLACK1};
    font-family: ${FONTS.ARIAL_BOLD};
    max-width: ${WIDTH * 0.7};
`;

const Image = createImageProgress(FastImage);

const DetailModal = ({
    isModalVisible,
    toggleModal,
    imageUrl,
    profileName,
    profileImage,
    fileType
}) => {

    return (
        <ModalContainer>
            <Modal
                onRequestClose={toggleModal}
                animationIn='fadeIn'
                animationOut='fadeOut'
                transparent={true}
                visible={isModalVisible}
                style={{ margin: 0 }}>
                <BlurView
                    blurType="light"
                    style={{
                        flex: 1
                    }}>
                    <TouchableOpacity
                        onPress={toggleModal}
                        activeOpacity={1}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TouchableWithoutFeedback>
                            <View>
                                <MainContent>
                                    <SpaceView mTop={SIZE(10)} />
                                    <RowWrap>
                                        <SpaceView mLeft={SIZE(10)} />
                                        <ProfileIcon>
                                            <Image source={profileImage} style={{ width: '100%', height: '100%' }} />
                                        </ProfileIcon>
                                        <SpaceView mLeft={SIZE(10)} />
                                        <CreatorName numberOfLines={1}>
                                            {profileName}
                                        </CreatorName>
                                        <SpaceView mRight={SIZE(10)} />
                                    </RowWrap>
                                    <SpaceView mTop={SIZE(10)} />
                                    <ImageView>
                                        {
                                            fileType !== 'mp4' ?
                                                <Image
                                                    indicator={Progress.Pie}
                                                    source={{
                                                        uri: imageUrl,
                                                        priority: FastImage.priority.normal
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                                :
                                                <Video
                                                    source={{ uri: imageUrl }}   // Can be a URL or a local file.
                                                    repeat
                                                    playInBackground={false}
                                                    paused={!isModalVisible}
                                                    resizeMode={'cover'}                                    // Store reference
                                                    // onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                                    // onError={this.videoError}               // Callback when video cannot be loaded
                                                    style={{ width: '100%', height: '100%' }} />
                                        }
                                    </ImageView>
                                </MainContent>
                                <SpaceView mTop={SIZE(20)} />
                                <ButtonList>
                                    <ButtonItem onPress={toggleModal}>
                                        <NormalText>
                                            {'Like'}
                                        </NormalText>
                                    </ButtonItem>
                                    <BorderView />
                                    <ButtonItem onPress={toggleModal}>
                                        <NormalText>
                                            {'Comment'}
                                        </NormalText>
                                    </ButtonItem>
                                    <BorderView />
                                    <ButtonItem onPress={toggleModal}>
                                        <NormalText>
                                            {'Send as Message'}
                                        </NormalText>
                                    </ButtonItem>
                                </ButtonList>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </BlurView>
            </Modal>
        </ModalContainer>
    )
}

export default DetailModal;