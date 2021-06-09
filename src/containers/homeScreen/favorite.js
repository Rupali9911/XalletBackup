import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";

import { myNftLoadStart, myNFTList, favoritePageChange, myNftListReset } from '../../store/actions/myNFTaction';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const Favorite = () => {

    const { MyNFTReducer, AuthReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // const [isOffline, setOfflineStatus] = useState(true);

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
                dispatch(favoritePageChange(1))
            }
        });
        
        if (AuthReducer.accountKey) {
            dispatch(myNftLoadStart())
            dispatch(myNftListReset())
            getNFTlist(1)
            dispatch(favoritePageChange(1))
        }

        return () => {
            // removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, "favorite", 1000))
        // isOffline && setOfflineStatus(false);
    }, []);

    const refreshFunc = () => {
        dispatch(myNftListReset())
        getNFTlist(1)
        dispatch(favoritePageChange(1))
    }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                AuthReducer.accountKey ?
                    MyNFTReducer.myNftListLoading ?
                        <Loader /> :
                        MyNFTReducer.favorite.length !== 0 ?
                            <FlatList
                                data={MyNFTReducer.favorite}
                                horizontal={false}
                                numColumns={3}
                                initialNumToRender={30}
                                onRefresh={() => {
                                    dispatch(myNftLoadStart())
                                    refreshFunc()
                                }}
                                refreshing={MyNFTReducer.myNftListLoading}
                                renderItem={({ item }) => {
                                    let findIndex = MyNFTReducer.favorite.findIndex(x => x.id === item.id);
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            dispatch(changeScreenName("favourite"))
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
                                }}
                                onEndReached={() => {
                                    let num = MyNFTReducer.favoritePage + 1;
                                    getNFTlist(num)
                                    dispatch(favoritePageChange(num))
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

            {/* <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={MyNFTReducer.myNftListLoading}
            /> */}
        </View>
    )
}

export default Favorite;