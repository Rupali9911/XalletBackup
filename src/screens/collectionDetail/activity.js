import { useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
    activityHistoryList,
    activityNftListStart,
    activityNftListReset,
    activityNftListPageChange,
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
import PaginationContainer from '../../components/PaginationContainer';
import moment from 'moment';
const FILTER_TYPE = ['MintWithTokenURI', 'SellNFT', 'Bid', 'BuyNFT', 'Claim', 'OnAuction', 'CancelSell'];

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

    const [pageNum, setPageNum] = useState('1')
    const [pageInput, setPageInput] = useState(pageNum)
    const [values, setValues] = useState([])
    const [items, setItems] = useState([
        { label: 'Minted', value: 'MintWithTokenURI' },
        { label: "Listings(Fixed Price)", value: 'SellNFT' },
        { label: "Bids", value: 'Bid' },
        { label: "Buy", value: 'BuyNFT' },
        { label: "Claim", value: 'Claim' },
        { label: "Listing(Auction)", value: 'OnAuction' },
        { label: "Cancel Sell", value: 'CancellSell' },
    ]);
    const [tradingTableHead, setTradingTableHead] = useState([
        'NFT',
        translate('common.event'),
        translate('common.price'),
        translate('common.from'),
        translate('common.to'),
        translate('common.date')
    ]);

    const isLoading = NftDataCollectionReducer.nftActivityLoading;
    const collectionList = NftDataCollectionReducer.nftActivityList;
    const page = NftDataCollectionReducer.nftActivityPage;
    const totalCount = NftDataCollectionReducer.nftActivityTotalCount;
    const reducerTabTitle = NftDataCollectionReducer.tabTitle

    const limit = 6

    const NumOfPages = Math.ceil(totalCount / limit)
    const isArray = Array.isArray(collectionList[0])

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
                dispatch(activityNftListStart(tabTitle));
                dispatch(activityNftListReset());
                if (values.length > 0) {
                    setValues(values)
                    getNFTlist(1, values)
                } else {
                    getNFTlist(1)
                }
                setPageNum('1')
                setPageInput('1')
                dispatch(activityNftListPageChange(1));
            } else {
                isFocused && setDetailScreen(false)
            }
        }
    }, [collectionType, isFocused, values]);

    function setDate(t) {
        var s = moment.utc(t).local().format("YYYY/MM/DD HH:mm:ss");
        return s.toString();
    }

    const getNFTlist = useCallback(
        (page, v) => {
            dispatch(
                activityHistoryList(
                    page,
                    collectionId,
                    v?.length !== 0 ? v : values.length !== 0 ? values : FILTER_TYPE,
                    tabTitle,
                    limit
                ),
            );
        },
        [],
    );

    const Filters = props => {
        const [open, setOpen] = useState(false);

        return (
            <DropDownPicker
                open={open}
                value={values}
                items={items}
                multiple={true}
                min={0}
                mode={'BADGE'}
                setOpen={setOpen}
                setValue={setValues}
                setItems={setItems}
                closeAfterSelecting={true}
                style={styles.tokenPicker}
                dropDownContainerStyle={styles.dropDownContainer}
                placeholder={translate('wallet.common.filter')}
                maxHeight={hp(40)}
            />
        );
    };
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1, justifyContent: 'flex-start' }}
            style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            <View style={{ flex: 1 }}>
                <Filters />
                <View style={{ margin: hp(1), marginVertical: (hp(3)), borderWidth: 1, borderColor: Colors.GREY9 }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flex: 1 }}
                    // nestedScrollEnabled={true}
                    >
                        <View style={{ flex: 1, }}>
                            {(tabTitle !== reducerTabTitle) || isLoading ? (
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: '90%', width: '100%' }}>
                                    <Loader />
                                </View>
                            ) :
                                <Table borderStyle={{ borderWidth: 1, borderColor: Colors.GREY9 }}>

                                    <Row
                                        data={tradingTableHead}
                                        style={{ marginBottom: hp(0.5) }}
                                        textStyle={{ marginLeft: 5 }}
                                        widthArr={[170, 100, 180, 140, 120, 140]}
                                        height={hp(2.5)}
                                    />
                                    {isArray && !isLoading && collectionList.length > 0 ? (
                                        collectionList.map((rowData, rowIndex) => {
                                            return (
                                                <TableWrapper
                                                    key={rowIndex}
                                                    style={{ flexDirection: 'row' }}>
                                                    {rowData?.map((cellData, cellIndex) => {
                                                        let wid;
                                                        if (cellIndex === 0) {
                                                            wid = 50;
                                                        }
                                                        if (cellIndex === 1) {
                                                            wid = 120;
                                                        }
                                                        if (cellIndex === 2) {
                                                            wid = 100;
                                                        }
                                                        if (cellIndex === 3) {
                                                            wid = 180;
                                                        }
                                                        if (cellIndex === 4) {
                                                            wid = 140;
                                                        }
                                                        if (cellIndex === 5) {
                                                            wid = 120;
                                                        }
                                                        return (

                                                            <Cell
                                                                key={cellIndex}
                                                                data={
                                                                    // cellIndex == 0 
                                                                    cellIndex == 2 || cellIndex == 1 ? (
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
                                                                                    {
                                                                                        color: '#00a8ff',
                                                                                        marginLeft: hp(1)
                                                                                    },
                                                                                ]}>
                                                                                {cellData !== 'Null Address' && cellData
                                                                                    ? cellData.substring(0, 10)
                                                                                    : cellData.substring(0, 10)}
                                                                            </Text>
                                                                        </View>
                                                                    ) :
                                                                        cellIndex == 0 ? (
                                                                            <View
                                                                                style={{
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: 'center',
                                                                                    alignItems: 'center'
                                                                                }}
                                                                                onPress={() =>
                                                                                    cellData && cellData !== 'Null Address'
                                                                                        ? navigation.push('ArtistDetail', {
                                                                                            id: cellData,
                                                                                        })
                                                                                        : null
                                                                                }>
                                                                                <Image
                                                                                    style={{ height: hp(5.5), width: hp(5.5), borderRadius: 3 }}
                                                                                    source={{ uri: cellData }}
                                                                                />

                                                                            </View>) :
                                                                            cellIndex === 6 ?
                                                                                (
                                                                                    setDate(cellData)
                                                                                ) :
                                                                                cellIndex === 3 ?
                                                                                    (
                                                                                        cellData && Number(cellData)
                                                                                    ) :
                                                                                    cellIndex === 4 ? (
                                                                                        cellData && cellData.substring(0, 12)
                                                                                    ) :
                                                                                        cellIndex === 5 && (
                                                                                            cellData && cellData.substring(0, 12)
                                                                                        )
                                                                }
                                                                // cellIndex === 3 ? element(cellData, index) :
                                                                // textStyle={styles.text}
                                                                textStyle={{ margin: SIZE(10), fontSize: SIZE(12) }}
                                                                width={wid}
                                                                height={hp(6.5)}
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
                                </Table>}
                        </View>
                    </ScrollView>
                </View>
            </View>
            
            <PaginationContainer width={'60%'}
                height={'10%'}
                inputWidth={'70%'}
                iconSize={20}
                margin={10}
                fontSize={12}
                marginBottomInput={'5%'}
                inputColor='black'
                pageNum={pageNum}
                setPageNum={setPageNum}
                pageInput={pageInput}
                setPageInput={setPageInput}
                totalPage={NumOfPages}
                onPress={(arg) => {
                    let num
                    if (arg === 'prev') {
                        num = Number(pageNum)
                        num = num - 1
                        getNFTlist(num.toString(), values)
                        setPageNum(num.toString())
                        setPageInput(num.toString())
                    } else if (arg === 'next') {
                        num = Number(pageNum)
                        num = num + 1
                        getNFTlist(num.toString(), values)
                        setPageNum(num.toString())
                        setPageInput(num.toString())
                    } else if (arg) {
                        console.log(arg, '>>>>>>>>>>> Argument')
                        num = arg
                        getNFTlist(num, values)
                    }

                    dispatch(activityNftListPageChange(num));
                    dispatch(activityNftListStart(tabTitle));
                    dispatch(activityNftListReset());
                }}
            />
        </KeyboardAwareScrollView>
    );
};

export default Activity;