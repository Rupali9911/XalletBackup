import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    View,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
import {
    nftDataCollectionList,
    nftDataCollectionListReset,
    nftDataCollectionLoadStart,
    nftDataCollectionPageChange,
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';

const { height } = Dimensions.get('window');

const tabOne = ({ route }) => {
    const {
        collection,
        tabTitle,
        tabStatus,
        isLaunchPad
    } = route?.params;

    const { NftDataCollectionReducer } = useSelector(state => state);

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isDetailScreen, setDetailScreen] = useState(false);

    const isLoading = NftDataCollectionReducer.nftDataCollectionLoading;
    const collectionList = NftDataCollectionReducer.nftDataCollectionList;
    const page = NftDataCollectionReducer.nftDataCollectionPage;
    const totalCount = NftDataCollectionReducer.nftDataCollectionTotalCount;
    const reducerTabTitle = NftDataCollectionReducer.tabTitle;

    useEffect(() => {
        if (isFocused && !isDetailScreen) {
            dispatch(nftDataCollectionLoadStart(tabTitle));
            dispatch(nftDataCollectionListReset());
            getNFTlist(1);
            dispatch(nftDataCollectionPageChange(1));
        }
        else {
            isFocused && setDetailScreen(false)
        }
    }, [isFocused]);

    const getNFTlist = useCallback(
        page => {
            dispatch(
                nftDataCollectionList(
                    page,
                    tabTitle,
                    collection?.network?.networkName,
                    collection?.contractAddress,
                    tabStatus,
                    null,
                    collection?.userId,
                    isLaunchPad,
                    false
                ),
            );
        },
        [],
    );

    const refreshFunc = () => {
        dispatch(nftDataCollectionListReset());
        getNFTlist(1);
        dispatch(nftDataCollectionPageChange(1));
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <ActivityIndicator size='small' color={colors.themeR} />
        );
    };

    const renderItem = ({ item, index }) => {
       
        let imageUri = item?.mediaUrl
        return (
            <NFTItem
                item={item}
                screenName="gallery"
                image={imageUri}
                onPress={() => {
                    navigation.push('CertificateDetail', { item: item });
                }}
            />
        );
        
    };

    const memoizedValue = useMemo(() => renderItem, [collectionList]);
    // { console.log("🚀 ~ file: gallery.js ~ line 249 ~ ",isLoading, collectionList, isStore, isSeries, isHotCollection) }

    const handleFlatlistRefresh = () => {
        dispatch(nftDataCollectionLoadStart());
        refreshFunc();
    }

    const keyExtractor = (item, index) => { return 'item_' + index }

    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {(tabTitle !== reducerTabTitle) || (page === 1 && isLoading) ? (
                <View style={{ marginTop: height / 8 }}>
                    <Loader />
                </View>
            ) : collectionList.length !== 0 ? (
                <FlatList
                        data={collectionList}
                        nestedScrollEnabled={true}
                        horizontal={false}
                        numColumns={2}
                        initialNumToRender={6}
                        onRefresh={handleFlatlistRefresh}
                        refreshing={page === 1 && isLoading}
                        renderItem={memoizedValue}
                        onEndReached={() => {
                            if (!isLoading && collectionList.length !== totalCount) {
                                let num = page + 1;

                                dispatch(nftDataCollectionLoadStart(tabTitle));
                                getNFTlist(num);
                                dispatch(nftDataCollectionPageChange(num));
                            }
                        }}
                        onEndReachedThreshold={0.4}
                        keyExtractor={keyExtractor}
                        ListFooterComponent={renderFooter}
                    />
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={styles.sorryMessageCont}>
                        <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default tabOne;
