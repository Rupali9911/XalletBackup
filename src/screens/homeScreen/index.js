import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { getNFTList, nftLoadStart, pageChange, nftListReset } from '../../store/actions/nftTrendList';
import { changeScreenName } from '../../store/actions/authAction';

import { responsiveFontSize as RF, SIZE } from '../../common/responsiveFunction';
import styles from './styles';
import { colors, fonts } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

import NewNFT from './newNFT';
import Favorite from './favorite';
import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

const Tab = createMaterialTopTabNavigator();

const USER_DATA = [
    {
        name: 'Name1'
    },
    {
        name: 'Name2'
    },
    {
        name: 'Name3'
    },
    {
        name: 'Name4'
    },
    {
        name: 'Name5'
    },
    {
        name: 'Name6'
    },
    {
        name: 'Name7'
    },
    {
        name: 'Name8'
    },
    {
        name: 'Name9'
    },
    {
        name: 'Name10'
    },
];

const Trend = () => {

    const { ListReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // state of offline/online network connection
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
                            <Text style={styles.sorryMessage} >{langObj.common.noNFT}</Text>
                        </View>
            }

            {/* <NoInternetModal
                show={isOffline}
                onRetry={refreshFunc}
                isRetrying={ListReducer.nftListLoading}
            /> */}
        </View>
    )
}

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {'Home'}
                </Text>
            </View>
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    {
                        USER_DATA.map(item => {
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate('')}>
                                    <View style={styles.userCircle}>
                                    </View>
                                    <Text style={styles.userText}>
                                        {'Name'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>
            </View>
            <Tab.Navigator tabBarOptions={{
                activeTintColor: colors.BLUE4,
                inactiveTintColor: colors.GREY1,
                style: {
                    boxShadow: 'none',
                    elevation: 0,
                    borderTopColor: '#EFEFEF',
                    borderTopWidth: 1,
                    shadowOpacity: 0,
                },
                tabStyle: {
                    height: SIZE(40)
                },
                labelStyle: {
                    fontSize: RF(1.4),
                    fontFamily: fonts.SegoeUIRegular,
                    textTransform: 'capitalize'
                },
                indicatorStyle: {
                    borderBottomColor: colors.BLUE4,
                    height: 1,
                    marginBottom: SIZE(39)
                }
            }} >
                <Tab.Screen name={langObj.common.trend} component={Trend} />
                <Tab.Screen name={langObj.common.New} component={NewNFT} />
                <Tab.Screen name={langObj.common.Favorite} component={Favorite} />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default HomeScreen;
