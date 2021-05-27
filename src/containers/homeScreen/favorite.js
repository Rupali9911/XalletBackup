import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";

import { myNftLoadStart, myNFTList, myPageChange } from '../../store/actions/myNFTaction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const Favorite = () => {

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
                getNFTlist(MyNFTReducer.myListPage)
            }
        });

        if (AuthReducer.accountKey) {
            dispatch(myNftLoadStart())
            getNFTlist(MyNFTReducer.myListPage)
        }

        return () => {
            removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])



    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page))
        isOffline && setOfflineStatus(false);
    }, [isOffline]);

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                AuthReducer.accountKey ?
                    MyNFTReducer.myNftListLoading ?
                        <Loader /> :
                        MyNFTReducer.completeNFTList.length !== 0 ?
                            <FlatList
                                data={MyNFTReducer.completeNFTList}
                                horizontal={false}
                                numColumns={3}
                                renderItem={({ item }) => {
                                    let findIndex = MyNFTReducer.completeNFTList.findIndex(x => x.id === item.id);
                                    if (item.like == 1) {
                                        return (
                                            <TouchableOpacity onPress={() => null} style={styles.listItem} >
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
                onRetry={() => {
                    getNFTlist(1)
                    dispatch(myPageChange(1))
                }}
                isRetrying={MyNFTReducer.myNftListLoading}
            />
        </View>
    )
}

export default Favorite;