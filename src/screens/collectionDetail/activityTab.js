import {useNavigation, useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  StatusBar,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {C_Image, Loader} from '../../components';
import {colors} from '../../res';
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
import {translate} from '../../walletUtils';
import styles from './styles';
import {hp} from '../../constants/responsiveFunct';
import Colors from '../../constants/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import PaginationContainer from '../../components/PaginationContainer';
import {FILTER_TRADING_HISTORY_OPTIONS} from '../../constants';
import {ImagekitType} from '../../common/ImageConstant';

const ActivityTab = props => {
  const {tabTitle, collection} = props;

  const {NftDataCollectionReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isDetailScreen, setDetailScreen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [filterTableList, setFilterTableList] = useState([]);
  const [pageNum, setPageNum] = useState('1');
  const [pageInput, setPageInput] = useState(pageNum);
  const [filterTableValue, setFilterTableValue] = useState([]);
  const [tradingTableHead, setTradingTableHead] = useState([
    translate('common.NFT'),
    translate('common.event'),
    translate('common.price'),
    translate('common.from'),
    translate('common.to'),
    translate('common.date'),
  ]);

  const isLoading = NftDataCollectionReducer.nftActivityLoading;
  const collectionList = NftDataCollectionReducer.nftActivityList;
  const page = NftDataCollectionReducer.nftActivityPage;
  const NumOfPages = NftDataCollectionReducer.nftActivityTotalCount;
  const reducerTabTitle = NftDataCollectionReducer.tabTitle;
  const collectionItem = NftDataCollectionReducer.nftActivityItems;

  const TRADING_HISTORY_DROPDOWN_OPTIONS = [
    {
      label: translate('common.minted'),
      value: 15,
    },
    {
      label: translate('common.sales'),
      value: 0,
    },
    {
      label: translate('common.OnAuction'),
      value: 19,
    },
    {
      label: translate('common.cancelListingFixed'),
      value: 2,
    },
    {
      label: translate('common.soldFixed'),
      value: 3,
    },
    {
      label: translate('common.bidPlaced'),
      value: 20,
    },
    {
      label: translate('common.bidAccepted'),
      value: 25,
    },
    {
      label: translate('common.cancelListingAuction'),
      value: 22,
    },
    {
      label: translate('common.bidReclaimed'),
      value: 24,
    },
    {
      label: translate('common.offerMade'),
      value: 1,
    },
    {
      label: translate('common.offerAccepted'),
      value: 4,
    },
    {
      label: translate('common.offerCanceled'),
      value: 9,
    },
    {
      label: translate('common.offerReclaimed'),
      value: 10,
    },
    {
      label: translate('common.NFTReclaimed'),
      value: 26,
    },
    {
      label: translate('common.cancelAuction'),
      value: 18,
    },
  ];

  const limit = 6;

  const isArray = Array.isArray(collectionList[0]);

  useEffect(() => {
    if (isFocused) {
      if ((isFocused && !isDetailScreen) || isFirstRender) {
        dispatch(activityNftListStart(tabTitle));
        dispatch(activityNftListReset());
        if (filterTableValue.length > 0) {
<<<<<<< HEAD
          // setValues(filterTableValue);
=======
         // setValues(filterTableValue);
>>>>>>> 8c2afac9187530f4e4e5f11b8a55e9c293672671
          getNFTlist(1, filterTableValue);
        } else {
          getNFTlist(1, []);
        }
        setPageNum('1');
        setPageInput('1');
        setIsFirstRender(false);
        dispatch(activityNftListPageChange(1));
      } else {
        isFocused && setDetailScreen(false);
      }
    }
  }, [isFocused, filterTableValue]);

  const formatAddress = address => {
    if (!address) return '';
    return address.slice(0, 6);
  };

  const renderCell = (cellIndex, cellData, rowIndex) => {
    return (
      <Cell
        key={rowIndex}
        data={
          cellIndex === 0 ? (
            <TouchableOpacity
              onPress={() => getNftData(rowIndex)}
              style={styles.tableCellImageView}>
              <C_Image
                style={{width: hp(5.5)}}
                size={ImagekitType.AVATAR}
                uri={cellData.image}
                imageStyle={styles.cellImage}
              />
              <Text style={{flex: 1, flexWrap: 'wrap'}}>
                {cellData.imageName}
              </Text>
            </TouchableOpacity>
          ) : (cellIndex === 3 || cellIndex === 4) &&
            cellData !== 'Null Address' ? (
            <TouchableOpacity onPress={() => getNftData(rowIndex)}>
              <Text numberOfLines={1} style={[styles.text, styles.themeColor]}>
                {formatAddress(cellData)}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              numberOfLines={1}
              style={[styles.text, styles.blackTextColor]}>
              {cellData}
            </Text>
          )
        }
        textStyle={styles.textStyle}
        width={
          cellIndex === 1 || cellIndex === 5
            ? 180
            : cellIndex === 2 || cellIndex === 3 || cellIndex === 4
            ? 100
            : 200
        }
        height={hp(6.5)}
      />
    );
  };

  const getNFTlist = useCallback((page, v) => {
    dispatch(activityHistoryList(page, collection.id, limit, tabTitle, v));
    setFilterTableList(TRADING_HISTORY_DROPDOWN_OPTIONS);
  }, []);

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
        listMode={'SCROLLVIEW'}
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        setOpen={setOpen}
        setValue={setFilterTableValue}
        setItems={setFilterTableList}
        closeAfterSelecting={true}
        style={styles.tokenPicker}
        dropDownDirection={'BOTTOM'}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder={translate('wallet.common.filter')}
        maxHeight={hp(45)}
      />
    );
  };

  const getNftData = index => {
    let nftDetail = collectionItem[index]?.nft;

    navigation.push('CertificateDetail', {
      networkName: nftDetail?.network?.name,
      collectionAddress: nftDetail?.collections?.contractAddress,
      nftTokenId: nftDetail?.tokenId,
    });

    setDetailScreen(true);
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.containerStyle}
      nestedScrollEnabled={true}
      style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View style={{flex: 1}}>
        <Filters />

        <View
          style={{
            margin: hp(1),
            marginVertical: collectionList.length > 0 ? hp(3) : hp(0),
          }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.tableView}>
              {isFirstRender || isLoading ? (
                <View style={styles.loaderParentActivity}>
                  <Loader />
                </View>
              ) : !isLoading && collectionList.length > 0 ? (
                <Table
                  borderStyle={{borderWidth: 1, borderColor: Colors.GREY9}}>
                  <Row
                    data={tradingTableHead}
                    style={{marginBottom: hp(0.5)}}
                    textStyle={{marginLeft: 10}}
                    widthArr={[200, 180, 100, 100, 100, 180]}
                    height={hp(2.5)}
                  />
                  {isArray && !isLoading && collectionList.length > 0 ? (
                    collectionList.map((rowData, rowIndex) => {
                      return (
                        <TableWrapper
                          key={rowIndex}
                          style={{flexDirection: 'row'}}>
                          {rowData?.map((cellData, cellIndex) => {
                            return renderCell(cellIndex, cellData, rowIndex);
                          })}
                        </TableWrapper>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </Table>
              ) : (
                <View style={styles.sorryMessageActivity}>
                  <Text style={styles.sorryMessage}>
                    {translate('common.noDataFound')}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      {collectionList.length > 0 && (
        <PaginationContainer
          width={'60%'}
          height={'10%'}
          inputWidth={'70%'}
          iconSize={20}
          margin={10}
          fontSize={12}
          marginBottomInput={'5%'}
          inputColor="black"
          pageNum={pageNum}
          setPageNum={setPageNum}
          pageInput={pageInput}
          setPageInput={setPageInput}
          totalPage={NumOfPages}
          onPress={arg => {
            let num;
            if (arg === 'prev') {
              num = Number(pageNum);
              num = num - 1;
              getNFTlist(num.toString(), filterTableValue);
              setPageNum(num.toString());
              setPageInput(num.toString());
            } else if (arg === 'next') {
              num = Number(pageNum);
              num = num + 1;
              getNFTlist(num.toString(), filterTableValue);
              setPageNum(num.toString());
              setPageInput(num.toString());
            } else if (arg) {
              num = arg;
              getNFTlist(num, filterTableValue);
            }

            dispatch(activityNftListPageChange(num));
            dispatch(activityNftListStart(tabTitle));
            dispatch(activityNftListReset());
          }}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default React.memo(ActivityTab);
