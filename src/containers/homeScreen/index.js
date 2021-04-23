import * as React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StatusBar, BackHandler, SafeAreaView} from 'react-native';
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
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
    images.one,
]

const Trend = ({navigation}) => {

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />

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
const ForYou = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}
const New = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Coming Soon</Text>
        </View>
    )
}
const Favorite = () => {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Coming Soon</Text>
        </View>
    )
}

const HomeScreen = () => {
    return (
        <>
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
                textTransform: 'capitalize'
            },
            indicatorStyle: {
                borderBottomColor: colors.tabbar,
                borderBottomWidth: 2,
            }
        }} >
            <Tab.Screen name="Trend" component={Trend} />
            <Tab.Screen name="For you" component={ForYou} />
            <Tab.Screen name="New" component={New} />
            <Tab.Screen name="Favorite" component={Favorite} />
        </Tab.Navigator>
        </SafeAreaView>
            </>
    )
}

export default HomeScreen;
