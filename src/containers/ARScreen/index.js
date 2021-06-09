import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, nftLoadStart, pageChange, nftListReset } from '../../store/actions/nftTrendList';

import styles from './styles';
import { colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const ARScreen = () => {

    const { ListReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        dispatch(nftLoadStart())

        // const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        //     const offline = !(state.isConnected && state.isInternetReachable);
        //     setOfflineStatus(offline);
        // });
        dispatch(nftListReset())
        getNFTlist(1);
        dispatch(pageChange(1))

        // return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(getNFTList(page))
        // isOffline && setOfflineStatus(false);
    }, []);

    const refreshFunc = () => {
        dispatch(nftListReset())
        getNFTlist(1)
        dispatch(pageChange(1))
    }

    return (
        <SafeAreaView style={styles.trendCont} >
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
                                if (item.metaData) {
                                    return (
                                        <TouchableOpacity onPress={() => navigation.navigate("ViroARScreen", { obj: item.metaData.image, type: item.metaData.properties.type })}
                                            style={styles.listItem}>
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
            {/* <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={ListReducer.nftListLoading}
            /> */}
        </SafeAreaView>
    )
}

export default ARScreen;