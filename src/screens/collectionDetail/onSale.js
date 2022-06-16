import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
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
import { changeScreenName } from '../../store/actions/authAction';
import {
    nftBlindDataCollectionList,
    nftDataCollectionList,
    nftDataCollectionListReset,
    nftDataCollectionLoadStart,
    nftDataCollectionPageChange,
    nftBlindSeriesCollectionList,
    nftBlindSeriesCollectionLoadStart,
    nftBlindSeriesCollectionReset,
    nftBlindSeriesCollectionPageChange,
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';
import CollectionItem from '../../components/CollectionItem';

const COLLECTION_TYPES = ['onsale', 'notonsale', 'owned', 'gallery'];
const BLIND_SERIES_COLLECTION_TYPE = [
    'minted2',
    'onsale',
    'notonsale',
    'owned',
];
const { height } = Dimensions.get('window');

const OnSale = ({ route }) => {
    const {
        nftChain,
        collectionAddress,
        collectionType,
        isBlind,
        isHotCollection,
        isSeries,
        collectionId,
        userCollection,
        isStore,
        manualColl,
        seriesInfoId
    } = route?.params;

    const { NftDataCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const isLoading = isSeries
        ? NftDataCollectionReducer.nftBlindSeriesCollectionLoading
        : NftDataCollectionReducer.nftDataCollectionLoading;
    const collectionList = isSeries
        ? NftDataCollectionReducer.nftBlindSeriesCollectionList
        : collectionType == 1 && blind ?
            NftDataCollectionReducer.mysteryBoxCollectionList :
            NftDataCollectionReducer.nftDataCollectionList;
    const page = isSeries
        ? NftDataCollectionReducer.nftBlindSeriesCollectionPage
        : NftDataCollectionReducer.nftDataCollectionPage;
    const totalCount = isSeries
        ? NftDataCollectionReducer.nftBlindSeriesCollectionTotalCount
        : collectionType == 1 && blind ?
            NftDataCollectionReducer.mysteryBoxCollectionTotalCount :
            NftDataCollectionReducer.nftDataCollectionTotalCount;

    useEffect(() => {
        if (isFocused) {
            // console.log("🚀 ~ file: onSale.js ~ line 53 ~",
            // route?.params
            // nftChain,
            // collectionAddress,
            // collectionType,
            // isBlind,
            // isHotCollection,
            // isSeries,
            // collectionId,
            // userCollection,
            // isStore,
            // manualColl,
            // seriesInfoId
            // )
            if (isSeries) {
                dispatch(nftBlindSeriesCollectionLoadStart());
                dispatch(nftBlindSeriesCollectionReset());
                getNFTlist(1);
                dispatch(nftBlindSeriesCollectionPageChange(1));
            } else {
                dispatch(nftDataCollectionLoadStart());
                dispatch(nftDataCollectionListReset());
                getNFTlist(1);
                dispatch(nftDataCollectionPageChange(1));
            }
        }
    }, [collectionType, userCollection, isFocused]);

    const getNFTlist = useCallback(
        page => {
            if (isStore) {
                // console.log("🚀 ~ file: getNFTlist ~ line 89 ~ isStore", isStore)
                dispatch(nftDataCollectionList(page, null, COLLECTION_TYPES[collectionType], null, true));
            } else if (!isBlind) {
                // console.log("🚀 ~ file: getNFTlist ~ line 91 ~ !isBlind", !isBlind)
                dispatch(
                    nftDataCollectionList(
                        page,
                        collectionAddress,
                        COLLECTION_TYPES[collectionType],
                        userCollection && userCollection.includes('0x')
                            ? collectionId
                            : null,
                        false,
                        manualColl
                    ),
                );
            } else if (isSeries) {
                // console.log("🚀 ~ file: getNFTlist ~ line 104 ~ isSeries", isSeries)
                dispatch(
                    nftBlindSeriesCollectionList(
                        page,
                        collectionAddress,
                        BLIND_SERIES_COLLECTION_TYPE[collectionType],
                        seriesInfoId,
                        nftChain
                    ),
                );
            } else {
                let temp = {
                    collectionAddress: collectionAddress,
                    filterType: "minted2",
                    limit: 24,
                    loggedIn: null,
                    owner: null,
                    page: 1
                }
                // console.log("🚀 ~ file: getNFTlist ~ line 120 ~ temp", temp)
                dispatch(nftBlindDataCollectionList(collectionAddress, collectionType, temp));
            }
            // dispatch(nftDataCollectionList(page, collectionAddress, COLLECTION_TYPES[collectionType], collectionId));
        },
        [collectionType, userCollection],
    );

    const refreshFunc = () => {
        if (isSeries) {
            dispatch(nftBlindSeriesCollectionReset());
            getNFTlist(1);
            dispatch(nftBlindSeriesCollectionPageChange(1));
        } else {
            dispatch(nftDataCollectionListReset());
            getNFTlist(1);
            dispatch(nftDataCollectionPageChange(1));
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item, index }) => {
        let findIndex = collectionList.findIndex(x => x?._id === item?._id);
        // console.log("🚀 ~ file: collections.js ~ line 152 ~ renderItem ~ isStore", isStore, isHotCollection || isBlind && collectionType == 0)
        if (isStore || seriesInfoId) {
            return (
                <NFTItem
                    item={item}
                    index={index}
                    image={item.image}
                    nftChain={nftChain}
                    isStore={isStore}
                    onPress={() => {
                        // console.log("🚀 ~ file: collections.js ~ line 146 ~ renderItem ~ isSeries", isSeries)
                        if (!isSeries) {
                            // dispatch(changeScreenName('dataCollection'));
                            navigation.push('DetailItem', {
                                index: findIndex,
                                collectionType: COLLECTION_TYPES[collectionType],
                                collectionAddress,
                                sName: "dataCollection"
                            });
                        } else {
                            // dispatch(changeScreenName('blindSeriesCollection'));
                            navigation.push('DetailItem', {
                                index: findIndex,
                                collectionType: BLIND_SERIES_COLLECTION_TYPE[collectionType],
                                collectionAddress,
                                sName: "blindSeriesCollection"
                            });
                        }
                    }}
                    isCollection
                    isBlind
                />)
        }

        // console.log("🚀 ~ file: collections.js ~ line 176 ~ renderItem ~ ",
        //     isHotCollection, isBlind, collectionType,
        //     isHotCollection || isBlind && collectionType == 0
        // )
        if (isHotCollection || isBlind && collectionType == 0) {
            return (
                <NFTItem
                    screenName="dataCollection"
                    item={item}
                    index={index}
                    image={item.iconImage}
                    nftChain={nftChain}
                    onPress={() => {
                        if (!isSeries) {
                            // dispatch(changeScreenName('dataCollection'));
                            navigation.push('DetailItem', {
                                index: findIndex,
                                sName: "dataCollection"
                            });

                        } else {
                            // dispatch(changeScreenName('blindSeriesCollection'));
                            navigation.push('DetailItem', {
                                index: findIndex,
                                sName: "blindSeriesCollection"
                            });
                        }
                    }}
                    isCollection
                    isBlind
                />
            );
        } else {
            // console.log("🚀 ~ file: collections.js ~ line 220 ~ renderItem ~ CollectionItem",)
            return (
                <CollectionItem
                    bannerImage={item.bannerImage}
                    chainType={item.chainType || 'polygon'}
                    items={item.items}
                    iconImage={item.iconImage}
                    collectionName={item.collectionName}
                    creator={item.creator}
                    creatorInfo={item.creatorInfo}
                    blind={item.blind}
                    isCollection={!isHotCollection}
                    cryptoAllowed={item?.cryptoAllowed}
                    onPress={() => {
                        // console.log("🚀 ~ file: collections.js ~ line 222 ~ renderItem ~ item", item, isBlind)
                        if (isBlind) {
                            navigation.push('CollectionDetail', {
                                isBlind: true,
                                collectionId: collectionId,
                                nftId: item._id,
                                isHotCollection: !item.blind,
                            });
                        } else {
                            if (item.collectionId) {
                                navigation.push('CollectionDetail', {
                                    isBlind: false,
                                    collectionId: item._id,
                                    isHotCollection: true,
                                });
                            }
                        }
                    }}
                />
            );
        }
    };

    const memoizedValue = useMemo(() => renderItem, [collectionList]);
    // { console.log("🚀 ~ file: collections.js ~ line 249 ~ ", collectionList, isStore, isSeries, isHotCollection) }

    const handleFlatlistRefresh = () => {
        dispatch(nftDataCollectionLoadStart());
        refreshFunc();
    }

    const keyExtractor = (item, index) => { return 'item_' + index }


    // console.log("🚀 ~ file: onSale.js ~ line 297 ~ OnSale ~ collectionList", collectionList)
    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {page === 1 && isLoading ? (
                <View style={{ marginTop: height / 8 }}>
                    <Loader />
                </View>
            ) : collectionList.length !== 0 ? (
                <FlatList
                    data={collectionList}
                    horizontal={false}
                    numColumns={2}
                    initialNumToRender={isSeries ? 6 : 15}
                    // onRefresh={handleFlatlistRefresh}
                    // refreshing={page === 1 && isLoading}
                    renderItem={memoizedValue}
                    onEndReached={() => {
                        if (!isLoading && collectionList.length !== totalCount) {
                            let num = page + 1;

                            if (isSeries) {
                                dispatch(nftBlindSeriesCollectionLoadStart());
                            } else {
                                dispatch(nftDataCollectionLoadStart());
                            }

                            getNFTlist(num);
                            if (isSeries) {
                                dispatch(nftBlindSeriesCollectionPageChange(num));
                            } else {
                                dispatch(nftDataCollectionPageChange(num));
                            }
                        }
                    }}
                    onEndReachedThreshold={0.4}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={renderFooter}
                />
            ) : (
                <View style={{ marginTop: height / 8 }}>
                    <View style={styles.sorryMessageCont}>
                        <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default OnSale;
