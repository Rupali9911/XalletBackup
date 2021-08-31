import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import EntypoIcon from "react-native-vector-icons/Entypo";
import { useDispatch } from 'react-redux';
// import { logoutUser } from "../../../../rn/fantoken/src/store/actions/authActions";

import {
    TouchableOpacity,
    View,
    Switch,
    Alert
} from 'react-native';
import {
    COLORS,
    SIZE,
    SVGS,
    FONT
} from 'src/constants';
import {
    Container,
    Header,
    SpaceView,
    HeaderLeft,
    RowWrap,
    BorderView,
    RowBetweenWrap
} from 'src/styles/common.styles';
import {
    HeaderText,
    GreyBoldText,
    GreySmallText,
    NormalText
} from 'src/styles/text.styles';
import {
    MainContent,
    SettingLabel
} from './styled';

const {
    LeftArrowIcon,
    RightArrowGreyIcon
} = SVGS;

function Setting({
    navigation
}) {

    const [isEnabled, onToggleEnable] = useState(false);
    const dispatch = useDispatch();

    const pressLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to Logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => null,
                },
                { text: "Okay", onPress: pressOk }
            ]
        );

    }

    const pressOk = () => {
        AsyncStorage.removeItem("@userToken");
        AsyncStorage.removeItem("@userData");
        navigation.navigate("Login")
        // dispatch(logoutUser());
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
                    {'Setting'}
                </HeaderText>
            </Header>
            <SpaceView mTop={SIZE(10)} />
            <RowWrap>
                <SpaceView mLeft={SIZE(14)} />
                <GreyBoldText>
                    {'Profile Settings'}
                </GreyBoldText>
            </RowWrap>
            <SpaceView mTop={SIZE(10)} />
            <MainContent>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("ChangePassword")}>
                    <RowBetweenWrap>
                        <NormalText>
                            {'Change Password'}
                        </NormalText>
                        <RightArrowGreyIcon />
                    </RowBetweenWrap>
                </TouchableOpacity>
            </MainContent>
            <MainContent>
                <TouchableOpacity style={{ flex: 1 }} onPress={pressLogout}>
                    <RowBetweenWrap>
                        <NormalText>
                            {'Log Out'}
                        </NormalText>
                        {/* <EntypoIcon name="log-out" size={FONT(16)} style={{ marginHorizontal: SIZE(10) }} /> */}
                    </RowBetweenWrap>
                </TouchableOpacity>
            </MainContent>
            <BorderView />
            <MainContent>
                <TouchableOpacity onPress={() => navigation.navigate('ApplyToken')}>
                    <NormalText>
                        {'Apply Token'}
                    </NormalText>
                    <GreySmallText>
                        {'message thumnailmessage thumnail'}
                    </GreySmallText>
                </TouchableOpacity>
            </MainContent>
            <BorderView />
            <MainContent>
                <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')}>
                    <NormalText>
                        {'Create Event'}
                    </NormalText>
                    <GreySmallText>
                        {'message thumnailmessage thumnail'}
                    </GreySmallText>
                </TouchableOpacity>
            </MainContent>
            <BorderView />
        </Container>
    )
}

export default Setting;