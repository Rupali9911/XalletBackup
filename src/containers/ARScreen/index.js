import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, pageChange } from '../../store/actions';

import styles from './styles';
import { colors, fonts, images } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const ARScreen = () => {

    const { ListReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });

        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(getNFTList(page))
        isOffline && setOfflineStatus(false);
    }, [isOffline]);

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
                            onEndReached={async () => {
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
                onRetry={() => {
                    getNFTlist(1)
                    dispatch(pageChange(1))
                }}
                isRetrying={ListReducer.nftListLoading}
            />
        </View>
    )
}

export default ARScreen;