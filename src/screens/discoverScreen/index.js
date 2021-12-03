import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TwoDArt from './twoDArt';

import styles from './styles';
import { colors, fonts } from '../../res';
import { AppHeader } from '../../components';
import getLanguage from '../../utils/languageSupport';
import { translate } from '../../walletUtils';

const langObj = getLanguage();

const Tab = createMaterialTopTabNavigator();

const GIFArt = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>{translate("wallet.common.comingSoon")}</Text>
        </View>
    )
}

const ThreeDAsset = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>{translate("wallet.common.comingSoon")}</Text>
        </View>
    )
}

const Land = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>{translate("wallet.common.comingSoon")}</Text>
        </View>
    )
}

const DiscoverScreen = () => {
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} >
                <AppHeader
                    title={translate("wallet.common.explore")}
                />

                <Tab.Navigator tabBarOptions={{
                    activeTintColor: colors.tabbar,
                    inactiveTintColor: colors.black,
                    style: {
                        boxShadow: 'none',
                        elevation: 0,
                        borderBottomColor: '#56D3FF',
                        borderBottomWidth: 0.2
                    },
                    tabStyle: {
                        paddingBottom: 0
                    },
                    labelStyle: {
                        fontSize: 14,
                        fontFamily: fonts.SegoeUIRegular,
                        textTransform: 'none'
                    },
                    indicatorStyle: {
                        borderBottomColor: colors.tabbar,
                        borderBottomWidth: 2,
                    }
                }} >
                    <Tab.Screen
                        name={langObj.common.twoDArt}
                        component={TwoDArt}
                    />
                    <Tab.Screen
                        name={langObj.common.GIFArt}
                        component={GIFArt}
                    />
                    <Tab.Screen
                        name={langObj.common.threeDAssets}
                        component={ThreeDAsset}
                    />
                    <Tab.Screen
                        name={langObj.common.land}
                        component={Land}
                    />
                </Tab.Navigator>
            </SafeAreaView>
        </>
    )
}

export default DiscoverScreen;
