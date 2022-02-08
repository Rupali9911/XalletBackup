import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { C_Image, DetailModal, Loader } from '../../components';
import { colors } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import {
    getNFTList,
    nftListReset,
    nftLoadStart,
    pageChange,
} from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';

const HotNFT = () => {
    const { ListReducer } = useSelector(state => state);
    const [modalData, setModalData] = useState();
    const [isModalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(nftLoadStart());
        dispatch(nftListReset());
        getNFTlist(1, null, ListReducer.sort);
        dispatch(pageChange(1));
    }, [ListReducer.sort]);

    const getNFTlist = useCallback((page, limit, _sort) => {
        // console.log('__sort',_sort);
        dispatch(getNFTList(page, limit, _sort));
    }, []);

    const refreshFunc = () => {
        dispatch(nftListReset());
        getNFTlist(1, null, ListReducer.sort);
        dispatch(pageChange(1));
    };

    const renderFooter = () => {
        if (!ListReducer.nftListLoading) return null;
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item, index }) => {
        let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
        if (item.metaData) {
            let imageUri =
                item.thumbnailUrl !== undefined || item.thumbnailUrl
                    ? item.thumbnailUrl
                    : item.metaData.image;
            return (
                <NFTItem
                    item={item}
                    image={imageUri}
                    onLongPress={() => {
                        setModalData(item);
                        setModalVisible(true);
                    }}
                    onPress={() => {
                        dispatch(changeScreenName('Hot'));
                        navigation.push('DetailItem', { index: findIndex });
                    }}
                />
            );
        }
    };

    const memoizedValue = useMemo(() => renderItem, [ListReducer.nftList]);

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {ListReducer.page === 1 && ListReducer.nftListLoading ? (
                <Loader />
            ) : ListReducer.nftList.length !== 0 ? (
                <FlatList
                    data={ListReducer.nftList}
                    horizontal={false}
                    numColumns={2}
                    initialNumToRender={15}
                    onRefresh={() => {
                        dispatch(nftLoadStart());
                        refreshFunc();
                    }}
                    scrollEnabled={!isModalVisible}
                    refreshing={ListReducer.page === 1 && ListReducer.nftListLoading}
                    renderItem={memoizedValue}
                    onEndReached={() => {
                        if (
                            !ListReducer.nftListLoading &&
                            ListReducer.nftList.length !== ListReducer.totalCount
                        ) {
                            let num = ListReducer.page + 1;
                            getNFTlist(num);
                            dispatch(pageChange(num));
                        }
                    }}
                    onEndReachedThreshold={0.4}
                    keyExtractor={(v, i) => 'item_' + i}
                    ListFooterComponent={renderFooter}
                />
            ) : (
                <View style={styles.sorryMessageCont}>
                    <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
                </View>
            )}
            {modalData && (
                <DetailModal
                    index={modalData.index}
                    data={modalData}
                    isModalVisible={isModalVisible}
                    toggleModal={() => setModalVisible(false)}
                />
            )}
        </View>
    );
};

export default HotNFT;
