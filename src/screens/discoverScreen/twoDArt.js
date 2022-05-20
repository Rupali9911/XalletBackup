import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";

import { myNFTList } from '../../store/actions/myNFTaction';
import { twoDNftLoadStart, twoDNftListReset, twoPageChange } from '../../store/actions/twoDAction';
import { changeScreenName } from '../../store/actions/authAction';
import { translate } from '../../walletUtils';

import styles from './styles';
import { colors } from '../../res';
import { Loader, NoInternetModal, C_Image } from '../../components';

const TwoDArt = () => {

    const { TwoDReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {

        dispatch(twoDNftListReset())
        dispatch(twoDNftLoadStart())
        getNFTlist(1)
        dispatch(twoPageChange(1))

    }, [])

    const getNFTlist = useCallback((page) => {
        dispatch(myNFTList(page, "2D", 30))
        // isOffline && setOfflineStatus(false);
    }, []);

    const refreshFunc = () => {
        dispatch(twoDNftListReset())
        getNFTlist(1)
        dispatch(twoPageChange(1))
    }

    const renderFlatListItem = ({ item }) => {
        let findIndex = TwoDReducer.twoDNftList.findIndex(x => x.id === item.id);
        return (
            <TouchableOpacity onPress={() => {
                // dispatch(changeScreenName("twoDArt"))
                navigation.navigate("DetailItem", { index: findIndex, sName: "twoDArt" })
            }} style={styles.listItem} >
                {
                    item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                        <C_Image uri={item.thumbnailUrl} imageStyle={styles.listImage} />
                        : <View style={styles.sorryMessageCont}>
                            <Text style={{ textAlign: "center" }} >{translate("wallet.common.error.noImage")}</Text>
                        </View>
                }
            </TouchableOpacity>
        )
    }

    const handleFlastListEndReached = () => {
        let num = TwoDReducer.page + 1;
        getNFTlist(num)
        dispatch(twoPageChange(num))
    }
    const keyExtractor = (item, index) => { return 'item_' + index }

    return (
        <View style={styles.trendCont} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                TwoDReducer.twoDListLoading ?
                    <Loader /> :
                    TwoDReducer.twoDNftList.length !== 0 ?
                        <FlatList
                            data={TwoDReducer.twoDNftList}
                            horizontal={false}
                            numColumns={3}
                            renderItem={renderFlatListItem}
                            onEndReached={handleFlastListEndReached}
                            onEndReachedThreshold={1}
                            keyExtractor={keyExtractor}
                        /> :
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                            <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                        </View>
            }

        </View>
    )
}

export default TwoDArt;
