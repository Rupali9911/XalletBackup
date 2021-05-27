import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, Image } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TwoDArt from './twoDArt';

import styles from './styles';
import { colors, fonts } from '../../res';

const Tab = createMaterialTopTabNavigator();

const GIFArt = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}

const ThreeDAsset = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}

const Land = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}

const DiscoverScreen = () => {
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            <SafeAreaView style={{flex: 1}} >
            <Tab.Navigator tabBarOptions={{
                activeTintColor: colors.tabbar,
                inactiveTintColor: colors.black,
                tabStyle: {
                    paddingBottom: 0
                },
                labelStyle: {
                    fontSize: 15,
                    fontFamily: fonts.SegoeUIRegular,
                    textTransform: 'none'
                },
                indicatorStyle: {
                    borderBottomColor: colors.tabbar,
                    borderBottomWidth: 2,
                }
            }} >
                <Tab.Screen name="2D Art" component={TwoDArt} />
                <Tab.Screen name="GIF Art" component={GIFArt} />
                <Tab.Screen name="3D Asset" component={ThreeDAsset} />
                <Tab.Screen name="Land" component={Land} />
            </Tab.Navigator>
            </SafeAreaView>
        </>
    )
}

export default DiscoverScreen;
