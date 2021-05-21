import React, { useEffect, useCallback, useState } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Config from "react-native-config";
import NetInfo from "@react-native-community/netinfo";
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';
import { colors, fonts, images } from '../../res';
import { Loader } from '../../components';
import { responsiveFontSize as FS } from '../../common/responsiveFunction';

const Tab = createMaterialTopTabNavigator();

const Collection = ({ navigation }) => {

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Text>Coming Soon</Text>
        </View>
    )
}
const NFT = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [refresh, set_refresh] = useState(false);
    const [nftList, set_nftList] = useState([]);
    const [owner_Id, setOwnerId] = useState("");

    const [showNFT, setShowNFT] = useState(false);

    const [pageCount, setPageCount] = useState(1);

    // state of offline/online network connection
    const [isOffline, setOfflineStatus] = useState(false);

    useEffect(() => {
        const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
            const offline = !(state.isConnected && state.isInternetReachable);
            setOfflineStatus(offline);
        });
        const unsubscribe = navigation.addListener('focus', () => {
            LoadData();
        });

        LoadData();

        return () => {
            removeNetInfoSubscription();
            unsubscribe();
        };
    }, [])

    const LoadData = async () => {
        setLoading(true);
        const ownerId = await AsyncStorage.getItem("account_id@")
        // console.log(ownerId, ownerId !== null);
        if (ownerId !== null) {
            setShowNFT(true)
            let owner_Id_parse = JSON.parse(ownerId)
            setShowNFT(true)
            setOwnerId(owner_Id_parse.account)
            getNFTlist(pageCount);
        } else {
            setShowNFT(false)
            setLoading(false);
        }
    }

    const getNFTlist = useCallback((page) => {
        // console.log('aaaaaaaaa', owner_Id);
        setListLoading(true)

        let body_data = {
            limit: 1000,
            networkType: "mainnet",
            owner: owner_Id,
            page: page,
            token: "HubyJ*%qcqR0",
            type: "2D"
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
                var results = new_list.filter(e => {
                    if (e.hasOwnProperty("returnValues")) {
                        return e.returnValues.to === owner_Id
                        // return e.returnValues.to === "0x41052F4608418d0A1039971c699bD74cf9CAd0Fd"
                    }
                });
                set_nftList(old_list => {
                    let array = [...old_list, ...results];
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

    console.log(owner_Id)

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                isLoading ?
                    <Loader /> :
                    showNFT ?
                        nftList.length !== 0 ?
                            <FlatList
                                data={nftList}
                                horizontal={false}
                                numColumns={3}
                                extraData={refresh}
                                renderItem={({ item }) => {
                                    let findIndex = nftList.findIndex(x => x.id === item.id);
                                    if (item.metaData) {
                                        return (
                                            <TouchableOpacity onPress={() => navigation.navigate("DetailItem", { nftList: nftList.slice(findIndex), pageCount })} style={styles.listItem} >
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
                onRetry={getNFTlist}
                isRetrying={isLoading}
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
