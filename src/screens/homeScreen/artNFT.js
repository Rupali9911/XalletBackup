import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import { newNftLoadStart, newNFTList, newPageChange, newNftListReset } from '../../store/actions/newNFTActions';
import { changeScreenName } from '../../store/actions/authAction';

import styles from './styles';
import { colors } from '../../res';
import { Loader, DetailModal, C_Image } from '../../components';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';


const ArtNFT = () => {

    const { NewNFTListReducer } = useSelector(state => state);
    const { sort } = useSelector(state => state.ListReducer);
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isSort, setIsSort] = useState(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused && (isFirstRender || isSort !== sort)) {
            console.log("artNFT")
            dispatch(newNftLoadStart());
            dispatch(newNftListReset('art'));
            getNFTlist(1, null, sort);
            dispatch(newPageChange(1));
            setIsFirstRender(false)
            setIsSort(sort)
        }
    }, [sort, isFocused])

    const getNFTlist = useCallback((page, limit, _sort) => {
        // console.log('___sort',_sort);
        dispatch(newNFTList(page, limit, _sort));
    }, []);

    const handleRefresh = () => {
        dispatch(newNftListReset());
        getNFTlist(1, null, sort);
        dispatch(newPageChange(1));
    }

    const renderItem = ({ item }) => {
        let findIndex = NewNFTListReducer.newNftList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;

            return (
                <NFTItem
                    item={item}
                    image={imageUri}
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName('newNFT'));
                        navigation.push('DetailItem', { index: findIndex });
                    }}
                />
            )
        }
    }

    const memoizedValue = useMemo(() => renderItem, [NewNFTListReducer.newNftList]);


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
                isFirstRender ? isFirstRender : NewNFTListReducer.newListPage === 1 && NewNFTListReducer.isArtNftLoading ?
                    <Loader /> :
                    NewNFTListReducer.newNftList.length !== 0 ?
                        <FlatList
                            data={NewNFTListReducer.newNftList}
                            horizontal={false}
                            numColumns={2}
                            initialNumToRender={14}
                            onRefresh={() => {
                                dispatch(newNftLoadStart());
                                handleRefresh();
                            }}
                            scrollEnabled={!isModalVisible}
                            refreshing={NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading}
                            renderItem={memoizedValue}
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

export default ArtNFT;