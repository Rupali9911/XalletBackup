import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { awardsNftLoadStart, getAwardsNftList, awardsNftPageChange, awardsNftListReset } from '../../store/actions/awardsAction';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, DetailModal, C_Image } from '../../components';
import getLanguage from '../../utils/languageSupport';
const langObj = getLanguage();

const Awards = () => {

    const { AwardsNFTReducer } = useSelector(state => state);
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(awardsNftLoadStart());
        dispatch(awardsNftListReset());
        getNFTlist(1);
        dispatch(awardsNftPageChange(1));
    }, [])

    const getNFTlist = useCallback((page, limit) => {
        dispatch(getAwardsNftList(page, limit));
    }, []);

    const handleRefresh = () => {
        dispatch(awardsNftListReset());
        getNFTlist(1);
        dispatch(awardsNftPageChange(1));
    }

    const renderFooter = () => {
        if (!AwardsNFTReducer.awardsNftLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = AwardsNFTReducer.awardsNftList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            return (
                <TouchableOpacity
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName("awards"));
                        navigation.navigate("DetailItem", { index: findIndex });
                    }}
                    style={styles.listItem}>
                    {
                        item.thumbnailUrl !== undefined || item.thumbnailUrl ?
                            <C_Image
                                type={item.metaData.image.split('.')[item.metaData.image.split('.').length - 1]}
                                uri={item.thumbnailUrl}
                                imageStyle={styles.listImage} />
                            :
                            <View style={styles.sorryMessageCont}>
                                <Text style={{ textAlign: "center" }}>{translate("wallet.common.error.noImage")}</Text>
                            </View>
                    }
                </TouchableOpacity>
            )
        }
    }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                AwardsNFTReducer.awardsNftPage === 1 && AwardsNFTReducer.awardsNftLoading ?
                    <Loader /> :
                    AwardsNFTReducer.awardsNftList.length !== 0 ?
                        <FlatList
                            data={AwardsNFTReducer.awardsNftList}
                            horizontal={false}
                            numColumns={3}
                            initialNumToRender={15}
                            onRefresh={() => {
                                dispatch(awardsNftLoadStart());
                                handleRefresh();
                            }}
                            scrollEnabled={!isModalVisible}
                            refreshing={AwardsNFTReducer.awardsNftPage === 1 && AwardsNFTReducer.awardsNftLoading}
                            renderItem={renderItem}
                            onEndReached={() => {
                                if (!AwardsNFTReducer.awardsNftLoading && AwardsNFTReducer.awardsTotalCount !== AwardsNFTReducer.awardsNftList.length) {
                                    let num = AwardsNFTReducer.awardsNftPage + 1;
                                    getNFTlist(num);
                                    dispatch(awardsNftPageChange(num));
                                }
                            }}
                            onEndReachedThreshold={0.4}
                            keyExtractor={(v, i) => "item_" + i}
                            ListFooterComponent={renderFooter}
                        /> :
                        <View style={styles.sorryMessageCont} >
                            <Text style={styles.sorryMessage} >{langObj.common.noNFT}</Text>
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

export default Awards;