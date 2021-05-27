import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNftLoadStart, newNFTList, newPageChange } from '../../store/actions/newNFTActions';

import styles from './styles';
import { colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const NewNFT = () => {

    const { NewNFTListReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // state of offline/online network connection
    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {

        dispatch(newNftLoadStart())

        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        getNFTlist(NewNFTListReducer.newListPage);

        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback((page) => {

        dispatch(newNFTList(page))
        isOffline && setOfflineStatus(false);

    }, [isOffline]);

    const handleRefresh = () => {
        getNFTlist(1)
        dispatch(newPageChange(1))
    }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                NewNFTListReducer.newNftListLoading ?
                    <Loader /> :
                    NewNFTListReducer.newNftList.length !== 0 ?
                        <FlatList
                            data={NewNFTListReducer.newNftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={30}
                            onRefresh={() => {
                                dispatch(newNftLoadStart())
                                handleRefresh()
                            }}
                            refreshing={NewNFTListReducer.newNftListLoading}
                            renderItem={({ item }) => {
                                let findIndex = NewNFTListReducer.newNftList.findIndex(x => x.id === item.id);
                                if (item.metaData) {
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
                                let num = NewNFTListReducer.newListPage + 1;
                                getNFTlist(num)
                                dispatch(newPageChange(num))
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
                onRetry={handleRefresh}
                isRetrying={NewNFTListReducer.newNftListLoading}
            />
        </View>
    )
}

export default NewNFT;