import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNftLoadStart, newNFTList, newPageChange, newNftListReset } from '../../store/actions/newNFTActions';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, DetailModal, C_Image } from '../../components';
import getLanguage from '../../utils/languageSupport';
import { translate } from '../../walletUtils';

const langObj = getLanguage();

const Favorite = () => {

    const { NewNFTListReducer } = useSelector(state => state);
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset());
        getNFTlist(1);
        dispatch(newPageChange(1));
    }, [])

    const getNFTlist = useCallback((page, limit) => {
        dispatch(newNFTList(page, limit));
    }, []);

    const handleRefresh = () => {
        dispatch(newNftListReset());
        getNFTlist(1);
        dispatch(newPageChange(1));
    }

    const renderItem = ({ item }) => {
        let findIndex = NewNFTListReducer.newNftList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("newNFT"));
                        navigation.navigate("DetailItem", { index: findIndex });
                    }}
                    style={styles.listItem}>
                    {
                        item.metaData.image ? (
                            item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                                <C_Image
                                    type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
                                    uri={item.thumbnailUrl}
                                    imageStyle={styles.listImage} />
                                :
                                <View style={styles.sorryMessageCont}>
                                    <Text style={{ textAlign: "center" }}>{translate("wallet.common.error.noImage")}</Text>
                                </View>
                        ) :
                            <View style={styles.sorryMessageCont}>
                                <Text style={{ textAlign: "center" }}>{translate("wallet.common.error.noImage")}</Text>
                            </View>
                    }
                </TouchableOpacity>
            )
        }
    }

    const renderFooter = () => {
        if (!NewNFTListReducer.newNftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading ?
                    <Loader /> :
                    NewNFTListReducer.newNftList.length !== 0 ?
                        <FlatList
                            data={NewNFTListReducer.newNftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => {
                                dispatch(newNftLoadStart());
                                handleRefresh();
                            }}
                            scrollEnabled={!isModalVisible}
                            refreshing={NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newNftList.length) {
                                    let num = NewNFTListReducer.newListPage + 1;
                                    getNFTlist(num);
                                    dispatch(newPageChange(num));
                                }
                            }}
                            onEndReachedThreshold={0.4}
                            keyExtractor={(v, i) => "item_" + i}
                            ListFooterComponent={renderFooter}
                        /> :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
                        </View>
            }
            {
                modalData &&
                <DetailModal
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            }
        </View>
    )
}

export default Favorite;