import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { myNftLoadStart, myNFTList, myPageChange, myNftListReset } from '../../store/actions/myNFTaction';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors, fonts } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';
import { responsiveFontSize as FS } from '../../common/responsiveFunction';

const Tab = createMaterialTopTabNavigator();

const Collection = ({ navigation }) => {

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}

const NFT = () => {
    const { MyNFTReducer, AuthReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });

        const unsubscribe = navigation.addListener('focus', () => {
            if (AuthReducer.accountKey) {
                dispatch(myNftLoadStart())
                dispatch(myNftListReset())
                getNFTlist(1)
                dispatch(myPageChange(1))
            }
        });

        if (AuthReducer.accountKey) {
            dispatch(myNftLoadStart())
            dispatch(myNftListReset())
            getNFTlist(1)
            dispatch(myPageChange(1))
        }

        return () => {
            removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, "myNFT", 1000))
        isOffline && setOfflineStatus(false);
    }, [isOffline]);

    const refreshFunc = () => {
        dispatch(myNftListReset())
        getNFTlist(1)
        dispatch(myPageChange(1))
    }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                AuthReducer.accountKey ?
                    MyNFTReducer.myNftListLoading ?
                        <Loader /> :
                        MyNFTReducer.myList.length !== 0 ?
                            <FlatList
                                data={MyNFTReducer.myList}
                                horizontal={false}
                                numColumns={3}
                                initialNumToRender={30}
                                onRefresh={() => {
                                    dispatch(myNftLoadStart())
                                    refreshFunc()
                                }}
                                refreshing={MyNFTReducer.myNftListLoading}
                                renderItem={({ item }) => {
                                    let findIndex = MyNFTReducer.myList.findIndex(x => x.id === item.id);
                                    if (item.metaData) {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                dispatch(changeScreenName("myNFT"))
                                                navigation.navigate("DetailItem", { index: findIndex })
                                            }} style={styles.listItem} >
                                                {
                                                    item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                                                        <C_Image uri={item.thumbnailUrl} imageStyle={styles.listImage} />
                                                        : <View style={styles.sorryMessageCont}>
                                                            <Text style={{ textAlign: "center" }} >No Image to Show</Text>
                                                        </View>
                                                }
                                            </TouchableOpacity>
                                        )
                                    }
                                }}
                                onEndReached={() => {
                                    let num = MyNFTReducer.myListPage + 1;
                                    getNFTlist(num)
                                    dispatch(myPageChange(num))
                                }}
                                onEndReachedThreshold={1}
                                keyExtractor={(v, i) => "item_" + i}
                            /> :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                <Text style={styles.sorryMessage} >No NFT Available</Text>
                            </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                        <Text style={styles.sorryMessage} >To See Your NFT {'\n'} Please login first</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Connect")} style={{ backgroundColor: colors.themeL, borderRadius: 10, marginVertical: 10, paddingHorizontal: 20, paddingVertical: 5 }} >
                            <Text style={[styles.sorryMessage, { color: "#fff" }]} >Login</Text>
                        </TouchableOpacity>
                    </View>

            }

            <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={MyNFTReducer.myNftListLoading}
            />
        </View>
    )
}

const MyNFTScreen = () => {
    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            <SafeAreaView style={{ flex: 1 }} >
                <Tab.Navigator tabBarOptions={{
                    activeTintColor: colors.tabbar,
                    inactiveTintColor: colors.black,
                    tabStyle: {
                        paddingBottom: 0
                    },
                    labelStyle: {
                        fontSize: FS(2),
                        fontFamily: fonts.SegoeUIRegular,
                        textTransform: 'none'
                    },
                    indicatorStyle: {
                        borderBottomColor: colors.tabbar,
                        borderBottomWidth: 2,
                    }
                }} >
                    <Tab.Screen name="NFT" component={NFT} />
                    <Tab.Screen name="My Collection" component={Collection} />
                </Tab.Navigator>
            </SafeAreaView>
        </>
    )
}

export default MyNFTScreen;
