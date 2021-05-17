import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { responsiveFontSize as FS } from '../../common/responsiveFunction';
import styles from './styles';
import { colors, fonts } from '../../res';
import { Loader } from '../../components';

const Tab = createMaterialTopTabNavigator();

const Trend = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [refresh, set_refresh] = useState(false);
    const [NFT_LIST, SET_NFT_LIST] = useState([]);
    const [ownerId, setOwnerId] = useState("");

    const [pageCount, set_pageCount] = useState(1);

    // state of offline/online network connection
    const [isOffline, setOfflineStatus] = useState(false);

    React.useEffect(async () => {
        setLoading(true);
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        const ownerId = await AsyncStorage.getItem("account_id@")
        if (ownerId !== null) {
            let owner_Id_parse = JSON.parse(ownerId)
            setOwnerId(owner_Id_parse.account)
        }
        getNFTlist();
        return () => removeNetInfoSubscription();
    }, [])

    const getNFTlist = useCallback(async () => {
        setListLoading(true)
        // let obj = {
        // limit: "40",
        // // networkType: "mainnet",
        // networkType: "testnet",
        // page: pageCount,
        // token: "piyush55",
        // type: "2D"
        // }
        let body_data = {
            type: "2d",
            page: pageCount,
            limit: 30,
            networkType: "mainnet",
            owner: ownerId,
            sort: "sell"
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
                // debugger;
                console.log(json.data, 'aaaaaaaaaaaaaaaaaaaaaaa')
                let nft_list = [...NFT_LIST, ...json.data];
                set_refresh(!refresh)
                SET_NFT_LIST(nft_list)
                isOffline && setOfflineStatus(false);
                setLoading(false)
                setListLoading(false)
            }).catch(err => {
                setLoading(false)
                alert(err.message)
            })
    }, [isOffline]);

    const Button = ({ children, ...props }) => (
        <TouchableOpacity style={styles.button} {...props}>
            <Text style={styles.buttonText}>{children}</Text>
        </TouchableOpacity>
    );

    const NoInternetModal = ({ show, onRetry, isRetrying }) => (
        <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Connection Error</Text>
                <Text style={styles.modalText}>
                    Oops! Looks like your device is not connected to the Internet.
            </Text>
                <Button onPress={onRetry} disabled={isRetrying}>
                    Try Again
            </Button>
            </View>
        </Modal>
    );

    console.log(NFT_LIST.length, pageCount)

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                isLoading ?
                    <Loader /> :
                    NFT_LIST.length !== 0 ?
                        <FlatList
                            data={NFT_LIST}
                            horizontal={false}
                            numColumns={3}
                            extraData={refresh}
                            renderItem={({ item }) => {
                                let findIndex = NFT_LIST.findIndex(x => x.id === item.id);
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate("DetailItem", { nftList: NFT_LIST.slice(findIndex), pageCount })} style={styles.listItem} >
                                        {
                                            item.metaData.image ?
                                                <Image style={styles.listImage} source={{ uri: item.metaData.image }} resizeMode="cover" />
                                                : <View style={styles.sorryMessageCont}>
                                                    <Text style={{ textAlign: "center" }} >No Image to Show</Text>
                                                </View>
                                        }
                                    </TouchableOpacity>
                                )
                            }}
                            onEndReached={() => {
                                console.log('yahooo...............')
                                set_pageCount(pageCount + 1)
                                getNFTlist()
                            }}
                            renderFooter={() => {
                                return listLoading ? <View style={styles.sorryMessageCont} >
                                    <ActivityIndicator size="small" color={colors.themeL} />
                                </View> : null
                            }}
                            onEndReachedThreshold={1}
                            // scrollEventThrottle={150}
                            keyExtractor={(v, i) => "item_" + i}
                        /> :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >No NFT Available</Text>
                        </View>
            }

            <NoInternetModal
                show={isOffline}
                onRetry={getNFTlist}
                isRetrying={isLoading}
            />
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
        // <SafeAreaView style={{ flex: 1 }} >
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
            <Tab.Screen name="For you" component={ForYou} />
            <Tab.Screen name="New" component={New} />
            <Tab.Screen name="Favorite" component={Favorite} />
        </Tab.Navigator>
        // </SafeAreaView>
    )
}

export default HomeScreen;
