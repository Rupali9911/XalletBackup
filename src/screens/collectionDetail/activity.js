import { useNavigation, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    Text,
    View,
    Dimensions,
    ScrollView,
    Image,
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
    activityHistoryList,
} from '../../store/actions/nftDataCollectionAction';
import {
    Row,
    Rows,
    Table,
    Cell,
    TableWrapper,
} from 'react-native-table-component';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';
import CollectionItem from '../../components/CollectionItem';
import NFTDetailDropdown from '../../components/NFTDetailDropdown';
import { hp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import { SIZE } from '../../common/responsiveFunction';
import DropDownPicker from 'react-native-dropdown-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const COLLECTION_TYPES = ['onsale', 'notonsale', 'owned', 'gallery'];
const BLIND_SERIES_COLLECTION_TYPE = [
    'minted2',
    'onsale',
    'notonsale',
    'owned',
];
const FILTER_TYPE = ['MintWithTokenURI', 'SellNFT', 'Bid', 'BuyNFT', 'Claim', 'OnAuction', 'CancelSell'];
const { height } = Dimensions.get('window');

const Activity = ({ route }) => {
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
        seriesInfoId,
        tabTitle
    } = route?.params;

    const { NftDataCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isDetailScreen, setDetailScreen] = useState(false);

    const [tradingTableData1, setTradingTableData1] = useState([]);
    const [tradingTableData, setTradingTableData] = useState([]);
    const [filterTableValue, setFilterTableValue] = useState([]);
    const [filterTableList, setFilterTableList] = useState([]);
    const [tradingTableHead, setTradingTableHead] = useState([
        'NFT',
        translate('common.event'),
        translate('common.price'),
        translate('common.from'),
        translate('common.to'),
        translate('common.date')
    ]);


    const isLoading = isSeries
        ? NftDataCollectionReducer.nftBlindSeriesCollectionLoading
        : NftDataCollectionReducer.nftDataCollectionLoading;
    // const collectionList = isSeries
    //     ? NftDataCollectionReducer.nftBlindSeriesCollectionList
    //     : collectionType == 1 && blind ?
    //         NftDataCollectionReducer.mysteryBoxCollectionList :
    //         NftDataCollectionReducer.nftDataCollectionList;
    const collectionList = [
        ["TAFFETA GATHERED DRESS", "0.59 BNB", "0xACBe", " ", "2022/06/25 10:57:42"]
        ["TAFFETA GATHERED DRESS", "0.59 BNB", "0xACBe", " ", "2022/06/25 10:57:42"],
        ["TAFFETA GATHERED DRESS", "0.59 BNB", "0xACBe", " ", "2022/06/25 10:57:42"],
        ["TAFFETA GATHERED DRESS", "0.59 BNB", "0xACBe", " ", "2022/06/25 10:57:42"],
        ["TAFFETA GATHERED DRESS", "0.59 BNB", "0xACBe", " ", "2022/06/25 10:57:42"]
    ];
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
            console.log("🚀 ~ file: onSale.js ~ line 53 ~",
                route?.params,
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
            )
            if (isFocused && !isDetailScreen) {
                dispatch(nftDataCollectionLoadStart(tabTitle));
                dispatch(nftDataCollectionListReset());
                getNFTlist(1);
                dispatch(nftDataCollectionPageChange(1));
            } else {
                isFocused && setDetailScreen(false)
            }
        }
    }, [collectionType, isFocused]);

    const getNFTlist = useCallback(
        page => {
            dispatch(
                activityHistoryList(
                    page,
                    collectionId,
                    FILTER_TYPE,
                    tabTitle
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
        return <ActivityIndicator size="small" color={colors.themeR} />;
    };

    const renderItem = ({ item, index }) => {
        return (
            <View />
        );


    };

    const memoizedValue = useMemo(() => renderItem, [collectionList]);

    const handleFlatlistRefresh = () => {
        dispatch(nftDataCollectionLoadStart());
        refreshFunc();
    }

    const keyExtractor = (item, index) => { return 'item_' + index }

    const Filters = props => {
        const [open, setOpen] = useState(false);

        return (
            <DropDownPicker
                open={open}
                value={props.value}
                items={props.data}
                multiple={true}
                min={0}
                mode={'BADGE'}
                setOpen={setOpen}
                setValue={props.setValue}
                setItems={props.setData}
                closeAfterSelecting={true}
                style={styles.tokenPicker}
                dropDownContainerStyle={styles.dropDownContainer}
                placeholder={translate('wallet.common.filter')}
                maxHeight={hp(20)}
            />
        );
    };
    console.log("Activity >>> ", collectionList)
    return (
        <View style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {isLoading ? (
                <View style={{ marginTop: height / 8 }}>
                    <Loader />
                </View>
            ) : (
                // <NFTDetailDropdown
                //     title={translate('common.tradingHistory')}
                //     containerChildStyles={{
                //         height:
                //             collectionList.length == 0
                //                 ? hp(19)
                //                 : collectionList.length < 5
                //                     ? hp(16) + hp(4) * collectionList.length
                //                     : hp(35.7),
                //     }}
                // // icon={trading}
                // >
                <>
                    <Filters
                        value={filterTableValue}
                        setValue={setFilterTableValue}
                        setData={setFilterTableList}
                        data={filterTableList}
                    />
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        // nestedScrollEnabled={true}
                        style={{ marginVertical: hp(2) }}>
                        <Table>
                            <Row
                                data={tradingTableHead}
                                style={styles.head}
                                textStyle={styles.text}
                                widthArr={[145, 130, 180, 180, 160]}
                            />

                            {collectionList.length > 0 ? (
                                collectionList.map((rowData, rowIndex) => {
                                    return (

                                        <TableWrapper
                                            key={rowIndex}
                                            style={{ flexDirection: 'row' }}>
                                            {rowData?.map((cellData, cellIndex) => {
                                                let wid;
                                                if (cellIndex === 0) {
                                                    wid = 145;
                                                }
                                                if (cellIndex === 1) {
                                                    wid = 130;
                                                }
                                                if (cellIndex === 2) {
                                                    wid = 180;
                                                }
                                                if (cellIndex === 3) {
                                                    wid = 180;
                                                }
                                                if (cellIndex === 4) {
                                                    wid = 160;
                                                }
                                                return (

                                                    <Cell
                                                        key={cellIndex}
                                                        data={
                                                            // cellIndex == 0 
                                                            cellIndex == 2 || cellIndex == 3 ? (
                                                                <View
                                                                    // onPress={() =>
                                                                    //     cellData && cellData !== 'Null Address'
                                                                    //         ? navigation.push('ArtistDetail', {
                                                                    //             id: cellData,
                                                                    //         })
                                                                    //         : null
                                                                    // }
                                                                    >
                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={[
                                                                            styles.text,
                                                                            { color: '#00a8ff' },
                                                                        ]}>
                                                                        {cellData !== 'Null Address' && cellData
                                                                            ? cellData
                                                                            : cellData}
                                                                    </Text>
                                                                </View>
                                                            ) :
                                                                cellIndex == 0 ? (
                                                                    <View
                                                                    style={{flexDirection:'row',
                                                                    justifyContent:'space-between',
                                                                
                                                                    }}
                                                                        onPress={() =>
                                                                            cellData && cellData !== 'Null Address'
                                                                                ? navigation.push('ArtistDetail', {
                                                                                    id: cellData,
                                                                                })
                                                                                : null
                                                                        }>
                                                                        
                                                                        <Text
                                                                            numberOfLines={1}
                                                                            style={[
                                                                                styles.text,
                                                                                { color: '#00a8ff' },
                                                                            ]}>
                                                                                <Image style={{ height: 20, width: 20,borderRadius:3 }} source={{
                                                                            uri: 'https://ik.imagekit.io/xanalia/nftData/hirokoCH06.png',
                                                                        }} />
                                                                            {cellData !== 'Null Address' && cellData
                                                                                ? cellData.slice(0,6)
                                                                                : cellData}
                                                                        </Text>
                                                                    </View>) :
                                                                    (
                                                                        cellData
                                                                    )
                                                        }
                                                        // cellIndex === 3 ? element(cellData, index) :
                                                        // textStyle={styles.text}
                                                        textStyle={{ margin: SIZE(10), fontSize: SIZE(12) }}
                                                        width={wid}
                                                    />
                                                );
                                            })}
                                        </TableWrapper>
                                    );
                                })
                            ) : (
                                <Text style={styles.emptyData}>
                                    {translate('common.noDataFound')}
                                </Text>
                            )}
                        </Table>
                    </ScrollView>
                </>
                // </NFTDetailDropdown>
            )}
            {/* 

            {page === 1 && isLoading ? (
                <View style={{ marginTop: height / 8 }}>
                    <Loader />
                </View>
            ) : collectionList.length !== 0 ? (
                <FlatList
                    nestedScrollEnabled={true}
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
                                dispatch(nftBlindSeriesCollectionLoadStart(tabTitle));
                            } else {
                                dispatch(nftDataCollectionLoadStart(tabTitle));
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
                <View style={{ flex: 1 }}>
                    <View style={styles.sorryMessageCont}>
                        <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
                    </View>
                </View>
            )}
        */}
        </View>
    );
};

export default Activity;