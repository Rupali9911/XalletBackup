import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator, View, Text, StatusBar, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { newNftLoadStart, newNFTList, newPageChange, newNftListReset } from '../../store/actions/newNFTActions';
import styles from './styles';
import { colors } from '../../res';
import { Loader } from '../../components';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';

const ArtNFT = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    let timer = null;

    // =============== Getting data from reducer ========================
    const { NewNFTListReducer } = useSelector(state => state);
    const { sort } = useSelector(state => state.ListReducer);

    //================== Components State Declaration ===================
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [isSort, setIsSort] = useState(null);

    //===================== UseEffect Function =========================
    useEffect(() => {
        if (isFocused && (isFirstRender || isSort !== sort)) {
            timer = setTimeout(() => {
                console.log("artNFT")
                dispatch(newNftLoadStart('art'));
                dispatch(newNftListReset('art'));
                getNFTlist(1, null, sort);
                dispatch(newPageChange(1));
                setIsFirstRender(false)
                setIsSort(sort)
            }, 100);
        }
        return () => clearTimeout(timer);
    }, [sort, isFocused])

    //===================== Dispatch Action to Fetch Art NFT List =========================
    const getNFTlist = useCallback((page, limit, _sort) => {
        dispatch(newNFTList(page, limit, _sort));
    }, []);

    // ===================== Render Art NFT Flatlist ===================================
    const renderArtNFTList = () => {
        return (
            <FlatList
                data={NewNFTListReducer.newNftList}
                horizontal={false}
                numColumns={2}
                initialNumToRender={14}
                onRefresh={handleFlatlistRefresh}
                refreshing={NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading}
                renderItem={memoizedValue}
                onEndReached={handleFlastListEndReached}
                onEndReachedThreshold={0.4}
                keyExtractor={keyExtractor}
                ListFooterComponent={renderFooter}
                pagingEnabled={false}
                legacyImplementation={false}
            />
        )
    }

    // ===================== Render No NFT Function ===================================
    const renderNoNFT = () => {
        return (
            <View style={styles.sorryMessageCont} >
                <Text style={styles.sorryMessage} >{translate("common.noNFT")}</Text>
            </View>
        )
    }

    //=================== Flatlist Functions ====================
    const handleFlatlistRefresh = () => {
        dispatch(newNftLoadStart('art'));
        handleRefresh();
    }

    const handleRefresh = () => {
        dispatch(newNftListReset());
        getNFTlist(1, null, sort);
        dispatch(newPageChange(1));
    }

    const handleFlastListEndReached = () => {
        if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newNftList.length) {
            let num = NewNFTListReducer.newListPage + 1;
            getNFTlist(num);
            dispatch(newPageChange(num));
        }
    }

    const keyExtractor = (item, index) => { return 'item_' + index }

    const renderFooter = () => {
        if (!NewNFTListReducer.newNftListLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        )
    }

    const renderItem = ({ item }) => {
        let findIndex = NewNFTListReducer.newNftList.findIndex(x => x.id === item.id);
        if (item && item.hasOwnProperty("metaData") && item.metaData) {
            let imageUri = item.thumbnailUrl !== undefined || item.thumbnailUrl ? item.thumbnailUrl : item.metaData.image;

            return (
                <NFTItem
                    screenName="newNFT"
                    item={item}
                    image={imageUri}
                    onPress={() => {
                        // dispatch(changeScreenName('newNFT'));
                        navigation.push('DetailItem', { index: findIndex, sName: "newNFT" });
                    }}
                />
            )
        }
    }

    const memoizedValue = useMemo(() => renderItem, [NewNFTListReducer.newNftList]);

    //=====================(Main return Function)=============================
    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            {
                isFirstRender ? isFirstRender : NewNFTListReducer.newListPage === 1 && NewNFTListReducer.isArtNftLoading ?
                    <Loader /> :
                    NewNFTListReducer.newNftList.length !== 0 ? renderArtNFTList() : renderNoNFT()}
        </View>
    )
}

export default React.memo(ArtNFT);