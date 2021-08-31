import React, { useState } from 'react';
import { Animated, Text, Image, TouchableOpacity, ScrollView, View } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import {
    COLORS,
    SIZE1,
    SIZE2,
    SIZE10,
    SIZE,
    FONT,
    SVGS,
    IMAGES
} from 'src/constants';

import {
    RowWrap,
    SpaceView,
    RowBetweenWrap,
} from 'src/styles/common.styles';
import {
    BoldText,
} from 'src/styles/text.styles';

const {
    CircleCloseIcon,
    SaveIcon,
    ShareIcon,
} = SVGS;

const {
    GIRL
} = IMAGES;

const ModalContainer = styled.View`
    justify-content: flex-end;
    flex: 1;
`;

const MainContent = styled.View`
    background-color: ${COLORS.WHITE1};
    border-top-left-radius: ${SIZE(16)}px;
    border-top-right-radius: ${SIZE(16)}px;
    overflow: hidden;
`;

const CircleCloseView = styled.View`
    padding-top: ${SIZE(13)}px;
    padding-right: ${SIZE(10)}px;
    align-items: flex-end;
    margin-bottom: ${SIZE(11)}px;
`;

const ImageView = styled.View`
    width: ${SIZE(249)}px;
    height: ${SIZE(234)}px;
    background-color: ${COLORS.GREY2};
    margin-right: ${SIZE(3)}px;
`;

const Content = styled.View`
    width: 100%;
    margin-top: ${SIZE(22)}px;
    padding-left: ${SIZE(15.5)}px;
    padding-right: ${SIZE(12)}px;
`;

const CircleColorView = styled.View`
    width: ${SIZE(19)}px;
    height: ${SIZE(19)}px;
    border-radius: ${SIZE(19)}px;
    background-color: ${props => props.color || COLORS.BLACK1};
`;

const StoreNameText = styled.Text`
    font-size: ${FONT(14)}px;
    color: ${COLORS.BLACK1};
    font-weight: 400;
`;

const TotalStoreText = styled.Text`
    font-size: ${FONT(12)}px;
    color: ${COLORS.BLACK1};
    font-weight: 400;
`;

const SizeView = styled.TouchableOpacity`
    width: ${SIZE(58)}px;
    height: ${SIZE(28)}px;
    align-items: center;
    justify-content: center;
    background-color: #F8F5F8;
    border-radius: ${SIZE(10)}px;
`;

const SizeText = styled.Text`
    font-size: ${FONT(11)}px;
    color: ${COLORS.BLACK1};
    font-weight: 400;
`;

const DescriptionText = styled.Text`
    font-size: ${SIZE(12)}px;
    color: ${COLORS.GREY4};
    font-weight: 400;
`;

const PriceView = styled.View`
    flex-direction: row;
    align-self: flex-end;
    align-items: flex-end;
`;

const PriceText = styled.Text`
    color: ${COLORS.RED1};
    font-size: ${FONT(24)}px;
`;

const PriceTypeText = styled.Text`
    color: ${COLORS.RED1};
    font-size: ${FONT(17)}px;
    font-weight: 400;
    padding-bottom: ${SIZE(2)}px;
`;

const GroupButtonView = styled.View`
    width: 100%;
    height: ${SIZE(39)}px;
    flex-direction: row;
    border-radius: ${SIZE(3.5)}px;
    overflow: hidden;
`;

const GrouponButton = styled.TouchableOpacity`
    flex: 1;
    align-Items: center;
    justify-content: center;
    background-color: ${props => props.color || COLORS.BLUE2};
`;

const GroupText = styled.Text`
    font-size: ${FONT(12)}px;
    color: ${COLORS.WHITE1};
    font-weight: 700;
`;

const DetailModal = ({ isModalVisible, toggleModal }) => {
    const [indicator, setIndicator] = useState(new Animated.Value(0));
    const [wholeWidth, setWholeWidth] = useState(1);
    const [visibleWidth, setVisibleWidth] = useState(0);

    const indicatorSize = wholeWidth > visibleWidth ?
        visibleWidth * visibleWidth / wholeWidth : visibleWidth;
    const difference = visibleWidth > indicatorSize ? visibleWidth - indicatorSize : 1;

    return (
        <Modal
            animationIn="slideInUp"
            animationOut="slideOutDown"
            style={{ margin: 0 }}
            isVisible={isModalVisible}>
            <ModalContainer>
                <MainContent>
                    <CircleCloseView>
                        <TouchableOpacity onPress={toggleModal}>
                            <CircleCloseIcon />
                        </TouchableOpacity>
                    </CircleCloseView>
                    <View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            onLayout={({
                                nativeEvent:
                                {
                                    layout: { x, y, width, height }
                                } }) => setVisibleWidth(width)
                            }
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: indicator } } }],
                                { useNativeDriver: false }
                            )}
                            onContentSizeChange={(width, height) => {
                                setWholeWidth(width);
                            }}>
                            <ImageView>
                                <Image source={GIRL} flex={1} />
                            </ImageView>
                            <ImageView>
                                <Image source={GIRL} flex={1} />
                            </ImageView>
                        </ScrollView>
                        <Animated.View style={[
                            {
                                position: 'absolute',
                                height: 10,
                                bottom: SIZE(12),
                                left: 0,
                                height: SIZE(4),
                                borderColor: COLORS.WHITE1,
                                borderRadius: SIZE(2),
                                borderWidth: 1,
                            },
                            {
                                width: indicatorSize,
                                transform: [{
                                    translateX: Animated.multiply(indicator, visibleWidth / wholeWidth).interpolate({
                                        inputRange: [0, difference],
                                        outputRange: [0, difference],
                                        extrapolate: 'clamp'
                                    })
                                }]
                            }
                        ]} />
                    </View>
                    <Content>
                        <RowBetweenWrap>
                            <RowWrap>
                                <CircleColorView color={COLORS.BLACK1} />
                                <SpaceView mRight={SIZE(8)} />
                                <StoreNameText>
                                    {'Store Name'}
                                </StoreNameText>
                            </RowWrap>
                            <RowWrap>
                                <SaveIcon />
                                <ShareIcon />
                            </RowWrap>
                        </RowBetweenWrap>
                        <SpaceView mTop={SIZE(11.5)} />
                        <BoldText>
                            {'Item Name Item Name Item'}
                        </BoldText>
                        <SpaceView mTop={SIZE(16)} />
                        <RowWrap>
                            <SizeView>
                                <SizeText>
                                    {'S'}
                                </SizeText>
                            </SizeView>
                            <SpaceView mRight={SIZE(13)} />
                            <SizeView>
                                <SizeText>
                                    {'M'}
                                </SizeText>
                            </SizeView>
                            <SpaceView mRight={SIZE(13)} />
                            <SizeView>
                                <SizeText>
                                    {'L'}
                                </SizeText>
                            </SizeView>
                            <SpaceView mRight={SIZE(15)} />
                            <SizeView>
                                <SizeText>
                                    {'XL'}
                                </SizeText>
                            </SizeView>
                            <SpaceView mRight={SIZE(15)} />
                            <SizeView>
                                <SizeText>
                                    {'XXL'}
                                </SizeText>
                            </SizeView>
                        </RowWrap>
                        <SpaceView mTop={SIZE(26.5)} />
                        <RowWrap>
                            <CircleColorView color={COLORS.BLACK1} />
                            <SpaceView mRight={SIZE(34)} />
                            <CircleColorView color={COLORS.PURPLE} />
                            <SpaceView mRight={SIZE(34)} />
                            <CircleColorView color={COLORS.ORANGE} />
                            <SpaceView mRight={SIZE(34)} />
                            <CircleColorView color={COLORS.LIGHT_BLUE} />
                            <SpaceView mRight={SIZE(34)} />
                        </RowWrap>
                        <SpaceView mTop={SIZE(24.5)} />
                        <BoldText>
                            {'Iteam description'}
                        </BoldText>
                        <SpaceView mTop={SIZE(5)} />
                        <DescriptionText>
                            {'texttexttexttexttexttexttextttexttexttexttexttexttexttexttextttexttexttexttexttexttexttexttextttexttexttexttexttexttexttexttextttexttexttexttexttexttexttexttextttexttexttexttexttexttexttexttextttext'}
                        </DescriptionText>
                        <SpaceView mTop={SIZE(27)} />
                        <PriceView>
                            <PriceTypeText>
                                {'￥'}
                            </PriceTypeText>
                            <PriceText>
                                {'829'}
                            </PriceText>
                        </PriceView>
                        <SpaceView mTop={SIZE(14)} />
                        <GroupButtonView>
                            <GrouponButton color={COLORS.BLUE3}>
                                <GroupText>
                                    {'Add Cart'}
                                </GroupText>
                            </GrouponButton>
                            <GrouponButton color={COLORS.BLUE2}>
                                <GroupText>
                                    {'Buy Now'}
                                </GroupText>
                            </GrouponButton>
                        </GroupButtonView>
                        <SpaceView mTop={SIZE(21)} />
                    </Content>
                </MainContent>
            </ModalContainer>
        </Modal >
    )
}

export default DetailModal;