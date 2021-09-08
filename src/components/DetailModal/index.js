import React, { useState } from 'react';
import { Animated, Text, TouchableWithoutFeedback, TouchableOpacity, ScrollView, View, Modal } from 'react-native';
// import Modal from 'react-native-modal';
import styled from 'styled-components';
import {
    COLORS,
    SIZE1,
    SIZE2,
    SIZE10,
    SIZE,
    FONT,
    SVGS,
    IMAGES,
    WIDTH
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

const {
    CircleCloseIcon,
    SaveIcon,
    ShareIcon,
} = SVGS;

const {
    GIRL
} = IMAGES;

const ModalContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
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
`;

const NFTImage = styled.Image`
    width: ${WIDTH * 0.9};
    height: ${WIDTH * 0.9};
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

const DetailModal = ({
    isModalVisible,
    toggleModal,
    imageUrl
}) => {

    return (
        <ModalContainer>
            <Modal
                onRequestClose={toggleModal}
                animationType='fade'
                transparent={true}
                visible={isModalVisible}>
                <TouchableOpacity
                    onPress={toggleModal}
                    activeOpacity={1}
                    style={{ flex: 1 }}>
                    <BlurView
                        blurType="light"
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        <TouchableWithoutFeedback>
                            <View>
                                <MainContent>
                                    <SpaceView mTop={SIZE(10)} />
                                    <RowWrap>
                                        <SpaceView mLeft={SIZE(10)} />
                                        <ProfileIcon>

                                        </ProfileIcon>
                                        <SpaceView mLeft={SIZE(10)} />
                                        <SmallBoldText>
                                            {'profile name'}
                                        </SmallBoldText>
                                    </RowWrap>
                                    <SpaceView mTop={SIZE(10)} />
                                    <NFTImage
                                        source={{ uri: imageUrl }}
                                    />
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
                    </BlurView>
                </TouchableOpacity>
            </Modal>
        </ModalContainer>
    )
}

export default DetailModal;