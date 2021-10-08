import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { myNftLoadStart, myNFTList, myPageChange, myNftListReset } from '../../store/actions/myNFTaction';
import { myCollectionLoadStart, myCollectionList, myCollectionPageChange, myCollectionListReset } from '../../store/actions/myCollection';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors, fonts } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';
import { responsiveFontSize as FS } from '../../common/responsiveFunction';
import getLanguage from '../../utils/languageSupport';
import { translate } from '../../walletUtils';

const langObj = getLanguage();

const Tab = createMaterialTopTabNavigator();

const Collection = () => {
    const { MyCollectionReducer, AuthReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        // const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        //     const offline = !(state.isConnected && state.isInternetReachable);
        //     setOfflineStatus(offline);
        // });

        const unsubscribe = navigation.addListener('focus', () => {
            if (AuthReducer.accountKey) {
                dispatch(myCollectionLoadStart())
                dispatch(myCollectionListReset())
                getCollectionList(1)
                dispatch(myCollectionPageChange(1))
            }
        });

        if (AuthReducer.accountKey) {
            dispatch(myCollectionLoadStart())
            dispatch(myCollectionListReset())
            getCollectionList(1)
            dispatch(myCollectionPageChange(1))
        }

        return () => {
            // removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])

    const getCollectionList = useCallback((page) => {
        dispatch(myCollectionList(page, "myCollection", 20))
        // isOffline && setOfflineStatus(false);
    }, []);

    const refreshFunc = () => {
        dispatch(myCollectionListReset())
        getCollectionList(1)
        dispatch(myCollectionPageChange(1))
    }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                AuthReducer.accountKey ?
                    MyCollectionReducer.myCollectionListLoading ?
                        <Loader /> :
                        MyCollectionReducer.myCollection.length !== 0 ?
                            <FlatList
                                data={MyCollectionReducer.myCollection}
                                horizontal={false}
                                numColumns={3}
                                initialNumToRender={30}
                                onRefresh={() => {
                                    dispatch(myCollectionLoadStart())
                                    refreshFunc()
                                }}
                                refreshing={MyCollectionReducer.myCollectionListLoading}
                                renderItem={({ item }) => {
                                    let findIndex = MyCollectionReducer.myCollection.findIndex(x => x.id === item.id);
                                    if (item.metaData) {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                dispatch(changeScreenName("myCollection"))
                                                navigation.navigate("DetailItem", { index: findIndex })
                                            }} style={styles.listItem} >
                                                {
                                                    item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                                                        <C_Image uri={item.thumbnailUrl} imageStyle={styles.listImage} />
                                                        : <View style={styles.sorryMessageCont}>
                                                            <Text style={{ textAlign: "center" }} >{translate("wallet.common.error.noImage")}</Text>
                                                        </View>
                                                }
                                            </TouchableOpacity>
                                        )
                                    }
                                }}
                                onEndReached={() => {
                                    let num = MyCollectionReducer.myCollectionPage + 1;
                                    getCollectionList(num)
                                    dispatch(myCollectionPage(num))
                                }}
                                onEndReachedThreshold={1}
                                keyExtractor={(v, i) => "item_" + i}
                            /> :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                                <Text style={styles.sorryMessage} >{langObj.common.noNFT}</Text>
                            </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                        <Text style={styles.sorryMessage} >{langObj.common.toseelogin}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Connect")} style={{ backgroundColor: colors.themeL, borderRadius: 10, marginVertical: 10, paddingHorizontal: 20, paddingVertical: 5 }} >
                            <Text style={[styles.sorryMessage, { color: "#fff" }]} >{langObj.common.signIn}</Text>
                        </TouchableOpacity>
                    </View>

            }

            {/* <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={MyNFTReducer.myNftListLoading}
            /> */}
        </View>
    )
}

const NFT = () => {
    const { MyNFTReducer, AuthReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        // const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        //     const offline = !(state.isConnected && state.isInternetReachable);
        //     setOfflineStatus(offline);
        // });

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
            // removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, "myNFT", 1000))
        // isOffline && setOfflineStatus(false);
    }, []);

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
                                                            <Text style={{ textAlign: "center" }} >{translate("wallet.common.error.noImage")}</Text>
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
                                <Text style={styles.sorryMessage} >{langObj.common.noNFT}</Text>
                            </View>
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                        <Text style={styles.sorryMessage} >{langObj.common.toseelogin}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Connect")} style={{ backgroundColor: colors.themeL, borderRadius: 10, marginVertical: 10, paddingHorizontal: 20, paddingVertical: 5 }} >
                            <Text style={[styles.sorryMessage, { color: "#fff" }]} >{langObj.common.signIn}</Text>
                        </TouchableOpacity>
                    </View>

            }

            {/* <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={MyNFTReducer.myNftListLoading}
            /> */}
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
                        fontSize: FS(2),
                        fontFamily: fonts.SegoeUIRegular,
                        textTransform: 'none'
                    },
                    indicatorStyle: {
                        borderBottomColor: colors.tabbar,
                        borderBottomWidth: 2,
                    }
                }} >
                    <Tab.Screen name={langObj.common.NFT} component={NFT} />
                    <Tab.Screen name={langObj.common.myCollection} component={Collection} />
                </Tab.Navigator>
            </SafeAreaView>
        </>
    )
}

export default MyNFTScreen;
