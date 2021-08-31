import React, { useState } from 'react';
import {
    TouchableOpacity,
    View,
} from 'react-native';
import {
    createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import {
    SIZE,
    SVGS,
    COLORS,
    FONT
} from 'src/constants';
import {
    Header,
    SpaceView,
    BorderView,
    Container,
    RowWrap
} from 'src/styles/common.styles';
import {
    HeaderText,
    BoldText,
} from 'src/styles/text.styles';
import {
    MainContent,
    PriceTextInput,
    UserText,
    PriceLabel,
    DescriptionText,
    GroupButtonView,
    GrouponButton,
    GroupText,
    TimeLeftText
} from './styled';
import { FlexWrap, HeaderLeft } from '../../styles/common.styles';
import {
    Chart,
    Line,
    Area,
    HorizontalAxis,
    VerticalAxis
} from 'react-native-responsive-linechart';
import {
    KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';

const {
    LeftArrowIcon
} = SVGS;

const Tab = createMaterialTopTabNavigator();

function MakeBidScreen({
    navigation
}) {

    const Month = () => {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Chart
                    style={{ height: SIZE(200), width: SIZE(338), backgroundColor: 'white' }}
                    data={[
                        { x: 0, y: 12 },
                        { x: 1, y: 7 },
                        { x: 2, y: 6 },
                        { x: 3, y: 8 },
                        { x: 4, y: 10 },
                        { x: 5, y: 8 },
                        { x: 6, y: 12 },
                        { x: 7, y: 14 },
                        { x: 8, y: 12 },
                        { x: 9, y: 13.5 },
                        { x: 10, y: 18 },
                    ]}
                    padding={{ left: SIZE(20), bottom: 20, right: SIZE(14), top: SIZE(10) }}
                    xDomain={{ min: 0, max: 8 }}
                    yDomain={{ min: 0, max: 20 }}>
                    <VerticalAxis tickCount={4} theme={{ labels: { formatter: (v) => v.toFixed(1) } }} />
                    <HorizontalAxis tickCount={5} />
                    <Area theme={{ gradient: { from: { color: COLORS.WHITE6 }, to: { color: COLORS.WHITE7, opacity: 0.4 } } }} />
                    <Line theme={{ stroke: { color: '#ffa502', width: 1 } }} />
                </Chart>
            </View>
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
                    marginBottom: SIZE(33),
                },
                tabStyle: {
                    height: SIZE(42),
                    marginTop: SIZE(-10)
                },
                labelStyle: {
                    fontSize: FONT(16),
                    textTransform: 'none'
                },
                indicatorStyle: {
                    backgroundColor: COLORS.BLUE4,
                    height: 2
                }
            }}>
                <Tab.Screen name='Month' component={Month} />
                <Tab.Screen name='Year' component={Month} />
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
                    {'Make a bid'}
                </HeaderText>
            </Header>
            <KeyboardAwareScrollView flex={1}>
                <FlexWrap>
                    <SpaceView mTop={SIZE(40)} />
                    <UserText>
                        {'Time Left'}
                    </UserText>
                    <SpaceView mTop={SIZE(3)} />
                    <TimeLeftText>
                        {'01:23:32:31'}
                    </TimeLeftText>
                    <SpaceView mTop={SIZE(40)} />
                    <MainContent>
                        <RowWrap>
                            <PriceLabel>
                                {'金額'}
                            </PriceLabel>
                            <PriceTextInput
                                keyboardType={'number-pad'}
                                placeholder={'0'}
                                onSubmitEditing={() => navigation.navigate('Me')}
                            />
                            <BoldText>
                                {'円'}
                            </BoldText>
                        </RowWrap>
                        <BorderView />
                        <SpaceView mTop={SIZE(2)} />
                        <DescriptionText>
                            {'Current Highest bid\n223,343'}
                        </DescriptionText>
                        <SpaceView mTop={SIZE(33)} />
                        <View style={{ height: SIZE(330), backgroundColor: COLORS.WHITE1 }}>
                            {renderTabView()}
                        </View>
                        <SpaceView mTop={SIZE(33)} />
                        <GroupButtonView>
                            <GrouponButton
                                onPress={() => navigation.navigate('Pay')}
                                color={COLORS.BLUE2}>
                                <GroupText>
                                    {'Bid Now'}
                                </GroupText>
                            </GrouponButton>
                        </GroupButtonView>
                        <SpaceView mTop={SIZE(40)} />
                    </MainContent>
                </FlexWrap>
            </KeyboardAwareScrollView>
        </Container>
    )
}

export default MakeBidScreen;