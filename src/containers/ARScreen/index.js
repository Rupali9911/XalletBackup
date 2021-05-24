import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StatusBar,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';
import { colors, fonts, images } from '../../res';
import { Loader } from '../../components';

const ARScreen = ({ navigation }) => {

    const [isLoading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [refresh, set_refresh] = useState(false);
    const [nftList, set_nftList] = useState([]);
    const [ownerId, setOwnerId] = useState("");

    const [pageCount, setPageCount] = useState(1);

    // state of offline/online network connection
    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(async () => {
        setLoading(true);
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        const owner_Id = await AsyncStorage.getItem("account_id@");
        if (owner_Id !== null) {
            let owner_Id_parse = JSON.parse(owner_Id)
            setOwnerId(owner_Id_parse.account)
        }
        getNFTlist(pageCount);
        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback((page) => {
        setListLoading(true)
        // let obj = {
        //     limit: "50",
        //     // networkType: "mainnet",
        //     networkType: "testnet",
        //     page,
        //     token: "piyush55",
        //     type: "2D"
        // }
        let body_data = {
            type: "2d",
            page,
            limit: 20,
            networkType: "mainnet",
            owner: ownerId,
        }

        let fetch_data_body = {
            method: 'POST',
            body: JSON.stringify(body_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${Config.BASE_URL}/getDemuxData`, fetch_data_body)
            .then(response => response.json())  // promise
            .then(json => {
                let new_list = [...json.data];
                set_nftList(old_list => {
                    let array = [...old_list, ...new_list];
                    let jsonObject = array.map(JSON.stringify);
                    let uniqueSet = new Set(jsonObject);
                    let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                    return uniqueArray;
                })
                set_refresh(!refresh)
                isOffline && setOfflineStatus(false);
                setLoading(false)
                setListLoading(false)
            }).catch(err => {
                setLoading(false)
                alert(err.message)
            })
    }, [isOffline]);

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />

            {
                isLoading ?
                    <Loader /> :
                    nftList.length !== 0 ?
                        <FlatList
                            data={nftList}
                            horizontal={false}
                            numColumns={3}
                            extraData={refresh}
                            renderItem={({ item }) => {
                                if (item.metaData) {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.navigate("ViroARScreen", { obj: item.metaData.image, type: item.metaData.properties.type });
                                            }}
                                            style={styles.listItem}>
                                            {
                                                item.metaData.image !== undefined || item.metaData.image ?
                                                    <Image style={styles.listImage} source={{ uri: item.metaData.image }} resizeMode="cover" />
                                                    : <View style={styles.sorryMessageCont}>
                                                        <Text style={{ textAlign: "center" }} >No Image to Show</Text>
                                                    </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                }
                            }}
                            onEndReached={async () => {
                                setPageCount(num => {
                                    getNFTlist(num + 1)
                                    return num + 1
                                })
                            }}
                            renderFooter={() => {
                                return listLoading ? <View style={styles.sorryMessageCont} >
                                    <ActivityIndicator size="small" color={colors.themeL} />
                                </View> : null
                            }}
                            onEndReachedThreshold={1}
                            keyExtractor={(v, i) => "item_" + i}
                        /> :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >No NFT Available</Text>
                        </View>
            }

        </View>
    )
}

export default ARScreen;