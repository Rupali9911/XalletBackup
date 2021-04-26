import * as React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar,SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import styles from './styles';
import { colors, fonts, images } from '../../res';

const Tab = createMaterialTopTabNavigator();

let list = [
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
]

const Collection = ({ navigation }) => {

    return (
        <View style={styles.trendCont} >
            <ScrollView>
                <View style={styles.imageListCont} >
                    {
                        list.map((v, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => navigation.navigate("DetailItem")} style={styles.listItem} >
                                    <Image style={styles.listImage} source={v} resizeMode="cover" />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}
const NFT = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}

const MyNFTScreen = () => {
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
                <Tab.Screen name="My Collection" component={Collection} />
                <Tab.Screen name="NFT" component={NFT} />
            </Tab.Navigator>
            </SafeAreaView>
        </>
    )
}

export default MyNFTScreen;
