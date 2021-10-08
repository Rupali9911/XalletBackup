import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import EntypoIcon from "react-native-vector-icons/Entypo";
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
import { useDispatch } from 'react-redux';
import { resetAccount } from '../../store/actions/authAction';
import { translate } from '../../walletUtils';

const {
    LeftArrowIcon,
    RightArrowGreyIcon
} = SVGS;

function Setting({
    navigation,
    route
}) {

    const [isEnabled, onToggleEnable] = useState(false);
    const dispatch = useDispatch();
    const { connector } = route.params;

    const pressLogout = () => {
        Alert.alert(
            translate("common.Logout"),
            translate("wallet.common.logOutQ"),
            [
                {
                    text: translate("common.cancel"),
                    onPress: () => null,
                },
                { text: "OK", onPress: pressOk }
            ]
        );

    }

    const pressOk = () => {
        AsyncStorage.removeItem("account_id@");
        connector.killSession();
        dispatch(resetAccount());
        navigation.goBack();
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
                    {translate("wallet.common.setting")}
                </HeaderText>
            </Header>
            <SpaceView mTop={SIZE(10)} />
            <RowWrap>
                <SpaceView mLeft={SIZE(14)} />
                <GreyBoldText>
                    {translate("wallet.common.profileSettings")}
                </GreyBoldText>
            </RowWrap>
            <SpaceView mTop={SIZE(10)} />
            <MainContent>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("ChangePassword")}>
                    <RowBetweenWrap>
                        <NormalText>
                            {translate("common.changePassword")}
                        </NormalText>
                        <RightArrowGreyIcon />
                    </RowBetweenWrap>
                </TouchableOpacity>
            </MainContent>
            <MainContent>
                <TouchableOpacity style={{ flex: 1 }} onPress={pressLogout}>
                    <RowBetweenWrap>
                        <NormalText>
                            {translate("common.Logout")}
                        </NormalText>
                        {/* <EntypoIcon name="log-out" size={FONT(16)} style={{ marginHorizontal: SIZE(10) }} /> */}
                    </RowBetweenWrap>
                </TouchableOpacity>
            </MainContent>
            <BorderView />
            <MainContent>
                <TouchableOpacity onPress={() => navigation.navigate('ApplyToken')}>
                    <NormalText>
                        {translate("wallet.common.applyToken")}
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
                        {translate("wallet.common.createEvent")}
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