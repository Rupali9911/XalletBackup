import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { C_Image, Loader } from '../../components';
import Colors from '../../constants/Colors';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import {  getNftCollections , nftLoadStart, nftListReset, nftListPageChange, nftListCursorChange, setTabTitle } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import styles from './style';
import { ActivityIndicator } from 'react-native-paper';

const ChatNftsList = ({ navigation, route }) => {
    const { tabTitle } = route.params;

    // =============== Getting data from States =========================
    const [isDetailScreen, setDetailScreen] = useState(false);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    // =============== Getting data from reducer ========================
    const {
        searchText,
        isNftLoading,
        nftList,
        nftPageChange,
        nftTotalCount,
        nftCursor,
        reducerTabTitle
    } = useSelector(state => state.chatReducer);
    const { userData } = useSelector(state => state.UserReducer);
    let owner = userData.userWallet.address;

    const nftCollectionList = tabTitle === 'Owned' ? nftList.ownerNFTS : nftList.otherNFTs;

    // ===================== Use-effect call =================================
    useEffect(() => {
        if (isFocused) {
            dispatch(setTabTitle(tabTitle));
        }
        if (isFocused && !isDetailScreen && !searchText) {
            dispatch(setTabTitle(tabTitle));

            dispatch(nftLoadStart());
            dispatch(nftListReset());
            getDataCollection(nftPageChange, '');
            dispatch(nftListPageChange(1));
        }
        else {
            isFocused && setDetailScreen(false);
        }
    }, [isFocused, searchText]);

    // ========================== API call =================================
    const getDataCollection = useCallback((page, cursor) => {
        dispatch(getNftCollections(page, owner, cursor));
    }, []);

    // ========================== Footer call =================================
    const renderFooter = () => {
        if (!isNftLoading) return null;
        return (
            <ActivityIndicator size='small' color={Colors.themeColor} />
        );
    };

    // ========================== On-End Reached of Flatlist =================================
    const handleFlatListEndReached = () => {
        if (!isNftLoading && nftCollectionList.length !== nftTotalCount && !searchText) {
            let num = nftPageChange + 1;
            dispatch(nftLoadStart());
            getDataCollection(num, nftCursor);
            dispatch(nftListPageChange(num));
            dispatch(nftListCursorChange(nftCursor));
        }
    };

    // ========================== On Refresh of Flatlist =================================
    const handleFlatlistRefresh = () => {
        if (!searchText) {
            dispatch(nftLoadStart());
            dispatch(nftListCursorChange(''));
            refreshFunc();
        }
    };

    // ========================== Refresh Function Call =================================
    const refreshFunc = () => {
        dispatch(nftListReset());
        getDataCollection(1, '');
        dispatch(nftListPageChange(1));
        dispatch(nftListCursorChange(''));
    };

    // ========================== Flatlist KeyExtractor(Unique Key) =================================
    const keyExtractor = (item, index) => { return `_${index}` }

    // ========================== Reender Item of Flatlist ==========================================
    const renderItem = ({ item, index }) => {
        let metaData = item?.metadata;
        const ItemDetail = JSON.parse(metaData);

        return (
            <TouchableOpacity
                onPress={() => {
                    setDetailScreen(true);
                    navigation.navigate('ChatDetail', 
                    { 
                        nftDetail: ItemDetail, 
                        tokenId: item.token_id, 
                    })
                }}>
                <View style={styles.nftItemContainer}>
                    <View>
                        <C_Image
                            uri={ItemDetail?.image}
                            imageStyle={styles.cImageContainer}
                        />
                    </View>
                    <Text style={styles.nftTextShow}> {ItemDetail?.name.slice(ItemDetail?.name.lastIndexOf("#"))} </Text>
                </View>
            </TouchableOpacity>
        )
    }

    const memoizedValue = useMemo(() => renderItem, [nftCollectionList]);

    //=====================(Main return Function)=============================
    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }}>
            { isNftLoading && nftPageChange == 1 || tabTitle != reducerTabTitle ?
                <View style={styles.centerViewStyle}>
                    <Loader />
                </View>
                : //else
                nftCollectionList.length !== 0
                    ? (
                        <View style={{ flex: 1, padding: 10 }}>
                            <FlatList
                                showsVerticalScrollIndicator={true}
                                data={nftCollectionList}
                                keyExtractor={keyExtractor}
                                renderItem={memoizedValue}
                                onEndReached={handleFlatListEndReached}
                                ListFooterComponent={renderFooter}
                                onRefresh={handleFlatlistRefresh}
                                refreshing={isNftLoading && nftPageChange == 1}
                            />
                        </View>
                    )
                    : (
                        <View style={styles.centerViewStyle}>
                            <View style={styles.sorryMessageCont}>
                                <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
                            </View>
                        </View>
                    )
            }
        </View>
    )
}



export default ChatNftsList;

