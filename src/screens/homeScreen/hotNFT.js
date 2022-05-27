import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
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
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isSort, setIsSort] = useState(null);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        if (isFocused && (isFirstRender || isSort !== ListReducer.sort)) {
            console.log("hot nft")
            dispatch(nftLoadStart());
            dispatch(nftListReset('hot'));
            getNFTlist(1, null, ListReducer.sort);
            dispatch(pageChange(1));
            setIsFirstRender(false)
            setIsSort(ListReducer.sort)
        }
    }, [ListReducer.sort, isFocused]);

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
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            let imageUri =
                item.thumbnailUrl !== undefined || item.thumbnailUrl
                    ? item.thumbnailUrl
                    : item.metaData.image;
            return (
                <NFTItem
                    item={item}
                    screenName="Hot"
                    image={imageUri}
                    onPress={() => {
                        // dispatch(changeScreenName('Hot'));
                        navigation.push('DetailItem', { index: findIndex, sName: "Hot" });
                    }}
                />
            );
        }
    };

    const memoizedValue = useMemo(() => renderItem, [ListReducer.nftList]);

    const handleFlatlistRefresh = () => {
        dispatch(nftLoadStart());
        refreshFunc();
    }
    const handleFlastListEndReached = () => {
        if (
            !ListReducer.nftListLoading &&
            ListReducer.nftList.length !== ListReducer.totalCount
        ) {
            let num = ListReducer.page + 1;
            getNFTlist(num);
            dispatch(pageChange(num));
        }
    }
    const keyExtractor = (item, index) => { return 'item_' + index }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {isFirstRender ? isFirstRender : ListReducer.page === 1 && ListReducer.isHotNftLoading ? (
                <Loader />
            ) : ListReducer.nftList.length !== 0 ? (
                <FlatList
                    data={ListReducer.nftList}
                    horizontal={false}
                    numColumns={2}
                    initialNumToRender={15}
                    onRefresh={handleFlatlistRefresh}
                    refreshing={ListReducer.page === 1 && ListReducer.nftListLoading}
                    renderItem={memoizedValue}
                    onEndReached={handleFlastListEndReached}
                    onEndReachedThreshold={0.4}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={renderFooter}
                    pagingEnabled={false}
                    legacyImplementation={false}
                />
            ) : (
                <View style={styles.sorryMessageCont}>
                    <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
                </View>
            )}
        </View>
    );
};

export default React.memo(HotNFT);
