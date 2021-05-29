import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, SafeAreaView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, nftLoadStart, pageChange, nftListReset } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';

import { responsiveFontSize as FS } from '../../common/responsiveFunction';
import styles from './styles';
import { colors, fonts } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

import NewNFT from './newNFT';
import Favorite from './favorite';

const Tab = createMaterialTopTabNavigator();

const Trend = () => {

    const { ListReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // state of offline/online network connection
    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {

        dispatch(nftLoadStart())

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        dispatch(nftListReset())
        getNFTlist(1);
        dispatch(pageChange(1))

        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback((page) => {

        dispatch(getNFTList(page))
        isOffline && setOfflineStatus(false);

    }, [isOffline]);

    const refreshFunc = () => {
        dispatch(nftListReset())
        getNFTlist(1)
        dispatch(pageChange(1))
    }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                ListReducer.nftListLoading ?
                    <Loader /> :
                    ListReducer.nftList.length !== 0 ?
                        <FlatList
                            data={ListReducer.nftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={30}
                            onRefresh={() => {
                                dispatch(nftLoadStart())
                                refreshFunc()
                            }}
                            refreshing={ListReducer.nftListLoading}
                            renderItem={({ item }) => {
                                let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
                                if (item.metaData) {
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            dispatch(changeScreenName("Trend"))
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
                                let num = ListReducer.page + 1;
                                getNFTlist(num)
                                dispatch(pageChange(num))
                            }}
                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        /> :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >No NFT Available</Text>
                        </View>
            }

            <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={ListReducer.nftListLoading}
            />
        </View>
    )
}

const HomeScreen = () => {
    return (
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
                    textTransform: 'capitalize'
                },
                indicatorStyle: {
                    borderBottomColor: colors.tabbar,
                    borderBottomWidth: 2,
                }
            }} >
                <Tab.Screen name="Trend" component={Trend} />
                <Tab.Screen name="New" component={NewNFT} />
                <Tab.Screen name="Favorite" component={Favorite} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default HomeScreen;
