import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityIndicator, View, Text, StatusBar, FlatList } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { newNftLoadStart, newNFTData, newPageChange, newNftListReset } from '../../store/actions/newNFTActions';
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
    const [isSort, setIsSort] = useState(0);
    const [page, setPage] = useState(1);

    const [end, setEnd] = useState()


    //===================== UseEffect Function =========================

    useEffect(() => {
        console.log("🚀 ~ file: artNFT.js ~ line 32 ~ ", isFocused, isFirstRender)
        if (isFocused && (isFirstRender || isSort !== sort)) {
            timer = setTimeout(() => {
                console.log("artNFT")
                dispatch(newNftLoadStart());
                dispatch(newNftListReset());
                getNFTlist(1, 0, 10, page);
                setIsFirstRender(false)
                setIsSort(sort)
            }, 100);
        }
        return () => clearTimeout(timer);
    }, [sort, isFocused])

    //===================== Dispatch Action to Fetch Art NFT List =========================
    const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
        dispatch(newNFTData('art', category, sort, pageSize, pageNum));
        // console.log(category,sort,pageSize,pageNum,'>>>>>>. params')
    }, []);

    // ===================== Render Art NFT Flatlist ===================================
    const renderArtNFTList = () => {
        return (
            <FlatList
                data={NewNFTListReducer.newArtNftList}
                horizontal={false}
                numColumns={2}
                initialNumToRender={14}
                onRefresh={handleFlatlistRefresh}
                refreshing={NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading}
                renderItem={memoizedValue}
                onEndReached={() => {
                    if (!end) {
                        handleFlastListEndReached()
                        setEnd(true)
                    }
                }}
                onEndReachedThreshold={0.4}
                keyExtractor={keyExtractor}
                ListFooterComponent={renderFooter}
                pagingEnabled={false}
                legacyImplementation={false}
                onMomentumScrollBegin={() => setEnd(false)}
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
        dispatch(newNftLoadStart());
        handleRefresh();
    }

    const handleRefresh = () => {
        dispatch(newNftListReset());
        getNFTlist(1, 0, 10, 1);
        // dispatch(newPageChange(1));
        setPage(1)
    }

    const handleFlastListEndReached = () => {
        if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newNftList.length) {
            let pageNum = page + 1
            getNFTlist(1, 0, 10, pageNum);
            // dispatch(newPageChange(pageNum));
            setPage(pageNum)
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
        let findIndex = NewNFTListReducer.newArtNftList.findIndex(x => item.id === x.id);
        let imageUri = item?.mediaUrl

        return (
            <NFTItem
                screenName="newNFT"
                item={item}
                image={imageUri}
                onPress={() => {
                    // dispatch(changeScreenName('newNFT'));
                    navigation.push('CertificateDetail', { item : item });
                }}
            />
        )
    }

    const memoizedValue = useMemo(() => renderItem, [NewNFTListReducer.newArtNftList]);

    //=====================(Main return Function)=============================
    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {isFirstRender ? isFirstRender :  page === 1 &&
                NewNFTListReducer.newNftListLoading ? (
                <Loader />
            ) : NewNFTListReducer.newArtNftList.length !== 0 ? renderArtNFTList()
                : renderNoNFT()
            }
        </View >
    )
}

export default React.memo(ArtNFT);