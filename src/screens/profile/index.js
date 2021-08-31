import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
} from 'src/styles/common.styles';
import {
    HeaderText,
    SmallBoldText,
    SmallNormalText,
    BoldText,
} from 'src/styles/text.styles';
import {
    COLORS,
    SIZE,
    IMAGES,
    SVGS,
    FONT
} from 'src/constants';
import {
    UserImageView,
    FollowButton,
    FollowButtonText,
    EditButton,
    EditButtonText,
    DescriptionView,
    SmallText,
    ImageView,
    DetailView,
    Title,
    PriceView,
    PriceText,
    PriceTypeText,
    NumberOfPersonText,
    DotView
} from './styled';


const {
    GIRL
} = IMAGES;

const {
    LeftArrowIcon,
    SettingIcon
} = SVGS;

const USER_DATA = [
    {
        name: 'Name1'
    },
    {
        name: 'Name2'
    },
    {
        name: 'Name3'
    },
    {
        name: 'Name4'
    },
    {
        name: 'Name5'
    },
    {
        name: 'Name6'
    },
    {
        name: 'Name7'
    },
    {
        name: 'Name8'
    },
    {
        name: 'Name9'
    },
    {
        name: 'Name10'
    },
];

const Tab = createMaterialTopTabNavigator();

function Profile({
    navigation,
    route
}) {

    // const { isMe } = route.params;

    const renderGirl = ({ item, index }) => {
        return (
            <ModelView onPress={() => navigation.navigate('Artist')}>
                <ImageView>
                    <Image source={GIRL} style={{ width: '100%', height: '100%' }} />
                </ImageView>
                <DetailView>
                    <Title>
                        {'ROCK MANS\nロックトークン'}
                    </Title>
                    <RowBetweenWrap>
                        <RowWrap>
                            <PriceView>
                                <PriceTypeText>
                                    {'￥'}
                                </PriceTypeText>
                                <PriceText>
                                    {'829'}
                                </PriceText>
                            </PriceView>
                            <NumberOfPersonText>
                                {'132人保有'}
                            </NumberOfPersonText>
                        </RowWrap>
                        <RowWrap>
                            <DotView />
                            <SpaceView mRight={SIZE(4)} />
                            <DotView />
                            <SpaceView mRight={SIZE(2)} />
                            <DotView />
                            <SpaceView mRight={SIZE(4)} />
                        </RowWrap>
                    </RowBetweenWrap>
                </DetailView>
            </ModelView>
        )
    }


    const Following = () => {
        return (
            <FlatList
                data={USER_DATA}
                renderItem={renderGirl}
                keyExtractor={(item, index) => 'key' + index}
                numColumns={3}
                contentContainerStyle={{ paddingVertical: SIZE(4), backgroundColor: COLORS.WHITE1 }}
            />
        )
    }

    const Recommend = () => {
        return (
            <FlatList
                data={USER_DATA}
                renderItem={renderGirl}
                keyExtractor={(item, index) => 'key' + index}
                numColumns={3}
                contentContainerStyle={{ paddingVertical: SIZE(4), backgroundColor: COLORS.WHITE1 }}
            />
        )
    }

    const renderTabView = () => {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: COLORS.BLUE4,
                inactiveTintColor: COLORS.GREY1,
                style: {
                    boxShadow: 'none',
                    elevation: 0,
                    borderBottomColor: '#EFEFEF',
                    borderBottomWidth: 1,
                },
                tabStyle: {
                    height: SIZE(42),
                    marginTop: SIZE(-10)
                },
                labelStyle: {
                    fontSize: FONT(12),
                    textTransform: 'none'
                },
                indicatorStyle: {
                    backgroundColor: COLORS.BLUE4,
                    height: 2
                }
            }}>
                <Tab.Screen name='My NFTs' component={Following} />
                <Tab.Screen name='My Collection' component={Recommend} />
            </Tab.Navigator>
        )
    }

    return (
        <Container>
            <Header>
                <HeaderLeft>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <LeftArrowIcon />
                    </TouchableOpacity>
                </HeaderLeft>
                <HeaderText>
                    {'Name'}
                </HeaderText>
                <HeaderRight>
                    <RowWrap>
                        <SpaceView mRight={SIZE(15)} />
                        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                            <SettingIcon width={SIZE(23)} height={SIZE(23)} />
                        </TouchableOpacity>
                    </RowWrap>
                </HeaderRight>
            </Header>
            <RowWrap>
                <SpaceView mLeft={SIZE(14)} />
                <RowBetweenWrap flex={1}>
                    <CenterWrap>
                        <UserImageView>
                        </UserImageView>
                        <SpaceView mTop={SIZE(12)} />
                        <SmallBoldText>
                            {'Queens layer'}
                        </SmallBoldText>
                    </CenterWrap>
                    <CenterWrap>
                        <SpaceView mTop={SIZE(-14)} />
                        <RowBetweenWrap>
                            <RowWrap>
                                <CenterWrap>
                                    <BoldText>
                                        {'0'}
                                    </BoldText>
                                    <SmallText>
                                        {'Post'}
                                    </SmallText>
                                </CenterWrap>
                                <SpaceView mLeft={SIZE(41)} />
                            </RowWrap>
                            <CenterWrap>
                                <BoldText>
                                    {'0'}
                                </BoldText>
                                <SmallText>
                                    {'Follower'}
                                </SmallText>
                            </CenterWrap>
                            <RowWrap>
                                <SpaceView mLeft={SIZE(27)} />
                                <CenterWrap>
                                    <BoldText>
                                        {'0'}
                                    </BoldText>
                                    <SmallText>
                                        {'Following'}
                                    </SmallText>
                                </CenterWrap>
                            </RowWrap>
                        </RowBetweenWrap>
                        <SpaceView mTop={SIZE(32)} />
                    </CenterWrap>
                </RowBetweenWrap>
                <SpaceView mRight={SIZE(7)} />
            </RowWrap>
            <DescriptionView>
                <SmallNormalText>
                    {'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet asdfasdfas'}
                </SmallNormalText>
            </DescriptionView>
            <SpaceView mTop={SIZE(14)} />
            <RowWrap>
                <SpaceView mLeft={SIZE(15)} />
                <EditButton onPress={() => navigation.navigate('EditProfile')}>
                    <EditButtonText>
                        {'Edit'}
                    </EditButtonText>
                </EditButton>
                <SpaceView mRight={SIZE(15)} />
            </RowWrap>
            <SpaceView mTop={SIZE(16)} />
            {renderTabView()}
        </Container >
    )
}

export default Profile;