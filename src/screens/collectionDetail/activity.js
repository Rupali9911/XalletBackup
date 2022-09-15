import { useNavigation, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
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
import { FILTER_TRADING_HISTORY_OPTIONS } from '../../constants';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';

const Activity = ({ route }) => {
    const {
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
    const NumOfPages = NftDataCollectionReducer.nftActivityTotalCount;
    const reducerTabTitle = NftDataCollectionReducer.tabTitle;
    const collectionItem = NftDataCollectionReducer.nftActivityItems;

    const limit = 6;

    const isArray = Array.isArray(collectionList[0])


    useEffect(() => {
        if (isFocused) {

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

    const formatAddress = (address) => {
        if (!address) return ''
        return address.slice(0, 6)
    }

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
                    ((cellIndex === 3 || cellIndex === 4) && cellData !== 'Null Address') ? (
                    //  cellIndex === 3 || cellIndex === 4 ? (
                        <TouchableOpacity
                        onPress={() => getNftData(rowIndex)}
                        >
                        <Text
                          numberOfLines={1}
                          style={[styles.text, styles.themeColor]}>
                          {formatAddress(cellData)}
                        </Text>
                      </TouchableOpacity>

                    ) : cellData

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
                                                console.log('Collection List : ===========> ', collectionList)
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