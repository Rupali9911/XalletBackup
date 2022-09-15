import { useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    // ActivityIndicator,
    // FlatList,
    StatusBar,
    Text,
    View,
    Dimensions,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
// import { changeScreenName } from '../../store/actions/authAction';
import {
    activityHistoryList,
    activityNftListStart,
    activityNftListReset,
    activityNftListPageChange,
    nftDataCollectionList,
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
import { hp } from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import PaginationContainer from '../../components/PaginationContainer';
import moment from 'moment';
import { FILTER_TRADING_HISTORY_OPTIONS } from '../../constants';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';
// import NFTItem from '../../components/NFTItem';
// import CollectionItem from '../../components/CollectionItem';
// import NFTDetailDropdown from '../../components/NFTDetailDropdown';
// import { SIZE } from '../../common/responsiveFunction';

// const FILTER_TYPE = ['MintWithTokenURI', 'SellNFT', 'Bid', 'BuyNFT', 'Claim', 'OnAuction', 'CancelSell'];

const Activity = ({ route }) => {
    const {
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
        // seriesInfoId,
        tabTitle,
        collection,
    } = route?.params;

    const { NftDataCollectionReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isDetailScreen, setDetailScreen] = useState(false);
    const [filterTableList, setFilterTableList] = useState([]);
    const [pageNum, setPageNum] = useState('1')
    const [pageInput, setPageInput] = useState(pageNum)
    const [filterTableValue, setFilterTableValue] = useState([]);
    // const [values, setValues] = useState([])
    // const [items, setItems] = useState([
    //     { label: translate('common.minted'), value: 'MintWithTokenURI' },
    //     { label: translate('common.sales'), value: 'SellNFT' },
    //     { label: translate('common.Bids'), value: 'Bid' },
    //     { label: translate('common.Buys'), value: 'BuyNFT' },
    //     { label: translate('common.Claim'), value: 'Claim' },
    //     { label: translate('common.OnAuction'), value: 'OnAuction' },
    //     { label: translate('common.cancelSell'), value: 'CancelSell' },
    // ]);
    const [tradingTableHead, setTradingTableHead] = useState([
        translate('common.NFT'),
        translate('common.event'),
        translate('common.price'),
        translate('common.from'),
        translate('common.to'),
        translate('common.date')
    ]);

    const isLoading = NftDataCollectionReducer.nftActivityLoading;
    const collectionList = NftDataCollectionReducer.nftActivityList;
    const page = NftDataCollectionReducer.nftActivityPage;
    // const totalCount = NftDataCollectionReducer.nftActivityTotalCount;
    const NumOfPages = NftDataCollectionReducer.nftActivityTotalCount;
    const reducerTabTitle = NftDataCollectionReducer.tabTitle;
    const collectionItem = NftDataCollectionReducer.nftActivityItems;

    const limit = 6;

    // const NumOfPages = Math.ceil(totalCount / limit)
    const isArray = Array.isArray(collectionList[0])


    useEffect(() => {
        if (isFocused) {

            // console.log("🚀 ~ file: onSale.js ~ line 53 ~",
            //     route?.params,
            //     nftChain,
            //     collectionAddress,
            //     collectionType,
            //     isBlind,
            //     isHotCollection,
            //     isSeries,
            //     collectionId,
            //     userCollection,
            //     isStore,
            //     manualColl,
            //     seriesInfoId
            // )

            if (isFocused && !isDetailScreen) {
                dispatch(activityNftListStart(tabTitle));
                dispatch(activityNftListReset());
                if (filterTableValue.length > 0) {
                    setValues(filterTableValue)
                    getNFTlist(1, filterTableValue)

                } else {
                    getNFTlist(1, [])
                }
                setPageNum('1')
                setPageInput('1')
                dispatch(activityNftListPageChange(1));
            } else {
                isFocused && setDetailScreen(false)
            }
        }
    }, [isFocused, filterTableValue]);

    // function setDate(t) {
    //     // var s = moment.utc(t).local().format("YYYY/MM/DD HH:mm:ss");
    //     var s = moment.unix(t).format("YYYY/MM/DD HH:mm:ss")
    //     return s.toString();
    // }

    const renderCell = (cellIndex, cellData, rowIndex) => {
        return (
            <Cell
                key={rowIndex}
                data={

                     cellIndex === 0 ? (
                        <TouchableOpacity
                            onPress={() => getNftData(rowIndex)}
                            style={styles.tableCellImageView}>
                            <Image
                                style={styles.cellImage}
                                source={{ uri: cellData.image }} />
                            <Text numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap' }}>{cellData.imageName}</Text>
                        </TouchableOpacity>
                    ) :
                     cellIndex === 1 || cellIndex === 2 || cellIndex === 5 ? (
                        cellData
                    ) :
                     cellIndex === 3 || cellIndex === 4 ? (
                        <TouchableOpacity onPress={() => getNftData(rowIndex)}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.text,
                                    {
                                        color: 'black',
                                        marginLeft: hp(0.5),
                                        marginRight: hp(0.5)
                                    },
                                ]}>
                                {cellData !== 'Null Address' && cellData
                                }
                            </Text>
                        </TouchableOpacity>
                    ) : null

                }
                textStyle={styles.textStyle}
                width={
                    cellIndex === 0 ? 200 : cellIndex === 1 || cellIndex === 5 ? 180 : cellIndex === 2 || cellIndex === 3 || cellIndex === 4 ? 100 : 200
                }
                height={hp(6.5)}
            />
        )
    }

    const getNFTlist = useCallback(
        (page, v) => {
            // dispatch(
            //     activityHistoryList(
            //         page,
            //         collectionId,
            //         v ? v : values.length !== 0 ? values : FILTER_TYPE,
            //         tabTitle,
            //         limit
            //     ),
            // );
            // dispatch(
            //     nftDataCollectionList(
            //         page,
            //         tabTitle,
            //         collection.network.networkName,
            //         collection.contractAddress,
            //         null,
            //         null,
            //         collection.userId,     
            //     ),
            // );

            dispatch(
                activityHistoryList(
                    page,
                    collection.id,
                    limit,
                    tabTitle,
                    v
                ),
            );
            setFilterTableList(FILTER_TRADING_HISTORY_OPTIONS);
        },
        [],
    );

    const Filters = props => {
        const [open, setOpen] = useState(false);
        return (
            <DropDownPicker
                open={open}
                value={filterTableValue}
                items={filterTableList}
                multiple={true}
                min={0}
                mode={'BADGE'}
                setOpen={setOpen}
                setValue={setFilterTableValue}
                setItems={setFilterTableList}
                closeAfterSelecting={true}
                style={styles.tokenPicker}
                dropDownContainerStyle={styles.dropDownContainer}
                placeholder={translate('wallet.common.filter')}
                maxHeight={hp(45)}
            />
        );
    };

    const getNftData = (index) => {
        let nftDetail = collectionItem[index];
        let url = `${NEW_BASE_URL}/nfts/details`;
        // let url = `https://prod-backend.xanalia.com/nfts/details?networkName=${nftDetail.nft.network.name}&collectionAddress=${nftDetail.nft.collections.contractAddress}&nftTokenId=${nftDetail.nft.tokenId}`;

        sendRequest({
            url,
            params: {
                networkName: nftDetail.nft.network.name,
                collectionAddress: nftDetail.nft.collections.contractAddress,
                nftTokenId: nftDetail.nft.tokenId,
            }
            })
            .then(data => {
                navigation.push('CertificateDetail', { item: data });
            }).catch(err => {
                console.log('Error : ', err);
            });

        // let nftItemDetails = nftDetail.nft;

        // collectionItem

        // console.log(' This is nftItemsDetailes : ', nftItemDetails); 


        // navigation.push('CertificateDetail', { item: nftDetail }); 
        // let nftItemDetails = nftDetail[7]

        // const videoUri = nftItemDetails ? 
        //     nftItemDetails?.metaData?.image :
        //     nftItemDetails ? nftItemDetails?.metaData?.image?.replace('nftdata', 'nftData') : nftItemDetails?.thumbnailUrl;

        // const fileType = videoUri ? videoUri?.split('.')[videoUri?.split('.').length - 1] : '';


        // // console.log('Details Page : ', nftItemDetails, index, fileType, videoUri)

        // navigation.push('CertificateDetail', { item: nftDetail, index: index});

        // navigation.push('CertificateDetail', {
        //     item: nftItemDetails,
        //     index: index,
        //     fileType: fileType,
        //     video: videoUri,
        //     artistId: nftItemDetails?.returnValues?.to.toLowerCase()
        // })
        setDetailScreen(true)
    }
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.containerStyle}
            style={styles.trendCont}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            <View style={{ flex: 1 }}>
                <Filters />

                <View style={{ margin: hp(1), marginVertical: collectionList.length > 0 ? hp(3) : hp(0) }}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    // nestedScrollEnabled={true}
                    >
                        <View style={styles.tableView}>
                            {(tabTitle !== reducerTabTitle) || isLoading ? (
                                <View style={{
                                    height: Dimensions.get('window').height,
                                    width: Dimensions.get('window').width
                                }}>
                                    <Loader />
                                </View>
                            ) :
                                (!isLoading && collectionList.length > 0 ? (

                                    <Table borderStyle={{ borderWidth: 1, borderColor: Colors.GREY9 }}>
                                        <Row
                                            data={tradingTableHead}
                                            style={{ marginBottom: hp(0.5) }}
                                            textStyle={{ marginLeft: 10 }}
                                            widthArr={[200, 180, 100, 100, 100, 180]}
                                            height={hp(2.5)}
                                        />
                                        {isArray && !isLoading && collectionList.length > 0 ? (
                                            collectionList.map((rowData, rowIndex) => {
                                                return (

                                                    <TableWrapper
                                                        key={rowIndex}
                                                        style={{ flexDirection: 'row' }}>
                                                        {rowData?.map((cellData, cellIndex) => {
                                                            return (
                                                                renderCell(cellIndex, cellData, rowIndex)
                                                            );
                                                        })}
                                                    </TableWrapper>



                                                    // <TableWrapper
                                                    //     key={rowIndex}
                                                    //     style={{ flexDirection: 'row' }}>
                                                    //     {rowData?.map((cellData, cellIndex) => {
                                                    //         let wid;

                                                    //         // if (cellIndex === 0) {
                                                    //         //     wid = 50;
                                                    //         // }
                                                    //         // if (cellIndex === 1) {
                                                    //         //     wid = 145;
                                                    //         // }
                                                    //         // if (cellIndex === 2) {
                                                    //         //     wid = 140;
                                                    //         // }
                                                    //         // if (cellIndex === 3) {
                                                    //         //     wid = 180;
                                                    //         // }
                                                    //         // if (cellIndex === 4) {
                                                    //         //     wid = 140;
                                                    //         // }
                                                    //         // if (cellIndex === 5) {
                                                    //         //     wid = 120;
                                                    //         // }
                                                    //         // if (cellIndex === 6) {
                                                    //         //     wid = 145;
                                                    //         // }
                                                    //         // if (cellIndex === 7) {
                                                    //         //     wid = 1;
                                                    //         // }

                                                    //         if (cellIndex === 0) {
                                                    //             wid = 200;
                                                    //         }
                                                    //         if (cellIndex === 1 || cellIndex === 5) {
                                                    //             wid = 180;
                                                    //         }
                                                    //         if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4) {
                                                    //             wid = 100;
                                                    //         }
                                                    //         // if (cellIndex === 3) {
                                                    //         //     wid = 100;
                                                    //         // }
                                                    //         // if (cellIndex === 4) {
                                                    //         //     wid = 100;
                                                    //         // }
                                                    //         // if (cellIndex === 5) {
                                                    //         //     wid = 180;
                                                    //         // }

                                                    //         return (
                                                    //             <Cell
                                                    //                 key={cellIndex}
                                                    //                 data={
                                                    //                     cellIndex === 0 ? (

                                                    //                         <TouchableOpacity
                                                    //                             onPress={() => getNftData(rowIndex)}
                                                    //                             style={styles.tableCellImageView}                                                                       
                                                    //                             // numberOfLines={1}
                                                    //                         >
                                                    //                             <Image
                                                    //                                 style={styles.cellImage}
                                                    //                                 source={{ uri: cellData.image }}
                                                    //                             />
                                                    //                             <Text numberOfLines={1} style={{ flex: 1, flexWrap: 'wrap' }}>{cellData.imageName}</Text>
                                                    //                         </TouchableOpacity>
                                                    //                     ) : 
                                                    //                         cellIndex === 1 ?
                                                    //                             (
                                                    //                                 cellData
                                                    //                             ) :
                                                    //                             cellIndex === 2 ?
                                                    //                                 (
                                                    //                                     cellData
                                                    //                                 ) :
                                                    //                                 cellIndex === 3 ? (
                                                    //                                     <TouchableOpacity onPress={() => getNftData(rowIndex)}>
                                                    //                                         <Text
                                                    //                                             numberOfLines={1}
                                                    //                                             style={[
                                                    //                                                 styles.text,
                                                    //                                                 {
                                                    //                                                     color: 'black',
                                                    //                                                     marginLeft: hp(0.5),
                                                    //                                                     marginRight: hp(0.5)
                                                    //                                                 },
                                                    //                                             ]}>
                                                    //                                             {cellData !== 'Null Address' && cellData
                                                    //                                             }
                                                    //                                         </Text>
                                                    //                                     </TouchableOpacity>
                                                    //                                 ) :
                                                    //                                     cellIndex === 4 ? (
                                                    //                                         <TouchableOpacity onPress={() => getNftData(rowIndex)}>
                                                    //                                             <Text
                                                    //                                                 numberOfLines={1}
                                                    //                                                 style={[
                                                    //                                                     styles.text,
                                                    //                                                     {
                                                    //                                                         color: 'black',
                                                    //                                                         marginLeft: hp(0.5),
                                                    //                                                         marginRight: hp(0.5)
                                                    //                                                     },
                                                    //                                                 ]}>
                                                    //                                                 {cellData !== 'Null Address' && cellData
                                                    //                                                 }
                                                    //                                             </Text>
                                                    //                                         </TouchableOpacity>
                                                    //                                     ) :
                                                    //                                         cellIndex === 5 &&
                                                    //                                         (
                                                    //                                             // cellData && cellData.substring(0, 9)
                                                    //                                             cellData
                                                    //                                         )

                                                    //                     // cellIndex == 1 ? (
                                                    //                     //     <TouchableOpacity onPress={() => getNftData(rowIndex)}>
                                                    //                     //         <Text
                                                    //                     //             numberOfLines={1}
                                                    //                     //             style={[
                                                    //                     //                 styles.text,
                                                    //                     //                 {
                                                    //                     //                     color: 'black',
                                                    //                     //                     marginLeft: hp(0.5),
                                                    //                     //                     marginRight: hp(0.5)
                                                    //                     //                 },
                                                    //                     //             ]}>
                                                    //                     //              {cellData !== 'Null Address' && cellData
                                                    //                     //             }
                                                    //                     //         </Text>
                                                    //                     //     </TouchableOpacity>
                                                    //                     // ) :
                                                    //                     //     cellIndex == 0 ? (
                                                    //                     //         <TouchableOpacity
                                                    //                     //             style={{
                                                    //                     //                 flexDirection: 'row',
                                                    //                     //                 justifyContent: 'center',
                                                    //                     //                 alignItems: 'center'
                                                    //                     //             }}
                                                    //                     //             onPress={() => getNftData(rowIndex)}
                                                    //                     //         >
                                                    //                     //             <Image
                                                    //                     //                 style={{ height: hp(5.5), width: hp(5.5), borderRadius: 3 }}
                                                    //                     //                 source={{ uri: cellData }}
                                                    //                     //             />

                                                    //                     //         </TouchableOpacity>) :
                                                    //                     //         cellIndex === 3 ?
                                                    //                     //             (
                                                    //                     //                 cellData
                                                    //                     //             ) :
                                                    //                     //             cellIndex === 4 ?
                                                    //                     //                 (
                                                    //                     //                     cellData && cellData.substring(0, 12)
                                                    //                     //                 ) :
                                                    //                     //                 cellIndex === 5 ? (
                                                    //                     //                     cellData && cellData.substring(0, 12)
                                                    //                     //                 ) :
                                                    //                     //                     cellIndex === 6 ? (
                                                    //                     //                         setDate(cellData)
                                                    //                     //                     ) :
                                                    //                     //                         cellIndex === 2 && (
                                                    //                     //                             <Text
                                                    //                     //                                 numberOfLines={1}
                                                    //                     //                                 style={[
                                                    //                     //                                     styles.text,
                                                    //                     //                                     {
                                                    //                     //                                         color: 'black',
                                                    //                     //                                         marginLeft: hp(0.5),
                                                    //                     //                                         marginRight: hp(0.5)
                                                    //                     //                                     },
                                                    //                     //                                 ]}>
                                                    //                     //                                 {cellData}
                                                    //                     //                             </Text>
                                                    //                     //                         )
                                                    //                 }
                                                    //                 // cellIndex === 3 ? element(cellData, index) :
                                                    //                 // textStyle={styles.text}
                                                    //                 // textStyle={{ margin: SIZE(10), fontSize: SIZE(12) }}
                                                    //                 // width={wid}
                                                    //                 // height={hp(6.5)}

                                                    //                 // textStyle={styles.text}
                                                    //                 textStyle={styles.textStyle}
                                                    //                 width={wid}
                                                    //                 height={hp(6.5)}
                                                    //             />
                                                    //             // <Cell
                                                    //             //     key={cellIndex}
                                                    //             //     data={
                                                    //             //         // cellIndex == 0 
                                                    //             //         cellIndex == 1 ? (
                                                    //             //             <TouchableOpacity onPress={() => getNftData(rowIndex)}>
                                                    //             //                 <Text
                                                    //             //                     numberOfLines={1}
                                                    //             //                     style={[
                                                    //             //                         styles.text,
                                                    //             //                         {
                                                    //             //                             color: 'black',
                                                    //             //                             marginLeft: hp(0.5),
                                                    //             //                             marginRight: hp(0.5)
                                                    //             //                         },
                                                    //             //                     ]}>
                                                    //             //                      {cellData !== 'Null Address' && cellData
                                                    //             //                     }
                                                    //             //                 </Text>
                                                    //             //             </TouchableOpacity>
                                                    //             //         ) :
                                                    //             //             cellIndex == 0 ? (
                                                    //             //                 <TouchableOpacity
                                                    //             //                     style={{
                                                    //             //                         flexDirection: 'row',
                                                    //             //                         justifyContent: 'center',
                                                    //             //                         alignItems: 'center'
                                                    //             //                     }}
                                                    //             //                     onPress={() => getNftData(rowIndex)}
                                                    //             //                 >
                                                    //             //                     <Image
                                                    //             //                         style={{ height: hp(5.5), width: hp(5.5), borderRadius: 3 }}
                                                    //             //                         source={{ uri: cellData }}
                                                    //             //                     />

                                                    //             //                 </TouchableOpacity>) :
                                                    //             //                 cellIndex === 3 ?
                                                    //             //                     (
                                                    //             //                         cellData
                                                    //             //                     ) :
                                                    //             //                     cellIndex === 4 ?
                                                    //             //                         (
                                                    //             //                             cellData && cellData.substring(0, 12)
                                                    //             //                         ) :
                                                    //             //                         cellIndex === 5 ? (
                                                    //             //                             cellData && cellData.substring(0, 12)
                                                    //             //                         ) :
                                                    //             //                             cellIndex === 6 ? (
                                                    //             //                                 setDate(cellData)
                                                    //             //                             ) :
                                                    //             //                                 cellIndex === 2 && (
                                                    //             //                                     <Text
                                                    //             //                                         numberOfLines={1}
                                                    //             //                                         style={[
                                                    //             //                                             styles.text,
                                                    //             //                                             {
                                                    //             //                                                 color: 'black',
                                                    //             //                                                 marginLeft: hp(0.5),
                                                    //             //                                                 marginRight: hp(0.5)
                                                    //             //                                             },
                                                    //             //                                         ]}>
                                                    //             //                                         {cellData}
                                                    //             //                                     </Text>
                                                    //             //                                 )
                                                    //             //     }
                                                    //             //     // cellIndex === 3 ? element(cellData, index) :
                                                    //             //     // textStyle={styles.text}
                                                    //             //     textStyle={{ margin: SIZE(10), fontSize: SIZE(12) }}
                                                    //             //     width={wid}
                                                    //             //     height={hp(6.5)}
                                                    //             // />
                                                    //         );
                                                    //     })}
                                                    // </TableWrapper>
                                                );
                                            })
                                        ) :
                                            <></>
                                        }
                                    </Table>) :
                                    (
                                        <View style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height,
                                            justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            <Text>
                                                {translate('common.noDataFound')}
                                            </Text>
                                        </View>

                                    ))
                            }
                        </View>
                        {/* <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text>
                                    {translate('common.noDataFound')}
                                </Text>
                            </View> */}
                    </ScrollView>
                </View>
            </View>

            {collectionList.length > 0 && <PaginationContainer width={'60%'}
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
                        getNFTlist(num.toString(), filterTableValue)
                        setPageNum(num.toString())
                        setPageInput(num.toString())
                    } else if (arg === 'next') {
                        num = Number(pageNum)
                        num = num + 1
                        getNFTlist(num.toString(), filterTableValue)
                        setPageNum(num.toString())
                        setPageInput(num.toString())
                    } else if (arg) {
                        num = arg
                        getNFTlist(num, filterTableValue)
                    }

                    dispatch(activityNftListPageChange(num));
                    dispatch(activityNftListStart(tabTitle));
                    dispatch(activityNftListReset());
                }}
            />}
        </KeyboardAwareScrollView>
    );
};

export default Activity;