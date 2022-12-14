import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {C_Image, Loader} from '../../components';
import Colors from '../../constants/Colors';
import React, {useEffect, useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  getNftCollections,
  setTabTitle,
  ownedNftLoadStart,
  otherNftLoadStart,
  ownedNftListReset,
  otherNftListReset,
  ownedNftPageChange,
  otherNftPageChange,
  ownedNftCursorChange,
  otherNftCursorChange,
} from '../../store/actions/chatAction';
import {translate} from '../../walletUtils';
import styles from './style';
import {ActivityIndicator} from 'react-native-paper';
import {ImagekitType} from '../../common/ImageConstant';

const ChatNftsList = ({tabTitle}) => {
  // =============== Getting data from States =========================
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // =============== Getting data from reducer ========================
  const {
    searchText,
    searchLoading,
    searchList,
    isOwnedLoading,
    ownerList,
    ownedPageChange,
    ownedTotalCount,
    ownedCursor,
    isOtherLoading,
    otherList,
    otherPageChange,
    otherTotalCount,
    otherCursor,
  } = useSelector(state => state.chatReducer);

  const {userData} = useSelector(state => state.UserReducer);
  let owner = userData.userWallet.address;
  const isNftLoading = searchText
    ? searchLoading
    : tabTitle === 'Owned'
    ? isOwnedLoading
    : isOtherLoading;
  const nftTotalCount =
    tabTitle === 'Owned' ? ownedTotalCount : otherTotalCount;
  const nftPageChange =
    tabTitle === 'Owned' ? ownedPageChange : otherPageChange;
  const nftCursor = tabTitle === 'Owned' ? ownedCursor : otherCursor;
  const searchListing =
    tabTitle === 'Owned' ? searchList.ownerNFTS : searchList.otherNFTs;
  const nftCollectionList = searchText
    ? searchListing
    : tabTitle === 'Owned'
    ? ownerList.ownerNFTS
    : otherList.otherNFTs;

  // ===================== Use-effect call =================================
  useEffect(() => {
    if (tabTitle === 'Owned') {
      dispatch(ownedNftLoadStart());
      dispatch(ownedNftListReset());
      getDataCollection(ownedPageChange, '');
      dispatch(ownedNftPageChange(1));
    } else {
      dispatch(otherNftLoadStart());
      dispatch(otherNftListReset());
      getDataCollection(otherPageChange, '');
      dispatch(otherNftPageChange(1));
    }
  }, []);

  // ========================== API call =================================
  const getDataCollection = useCallback((page, cursor) => {
    dispatch(getNftCollections(page, owner, cursor, tabTitle));
  }, []);

  // ========================== Footer call =================================
  const renderFooter = () => {
    if (!isNftLoading) return null;
    return <ActivityIndicator size="small" color={Colors.themeColor} />;
  };

  // ========================== On-End Reached of Flatlist =================================
  const handleFlatListEndReached = () => {
    if (
      !isNftLoading &&
      nftCollectionList.length !== nftTotalCount &&
      !searchText
    ) {
      let num = nftPageChange + 1;
      if (tabTitle === 'Owned') {
        dispatch(ownedNftLoadStart());
        getDataCollection(num, nftCursor);
        dispatch(ownedNftPageChange(num));
        dispatch(ownedNftCursorChange(nftCursor));
      } else {
        dispatch(otherNftLoadStart());
        getDataCollection(num, nftCursor);
        dispatch(otherNftPageChange(num));
        dispatch(otherNftCursorChange(nftCursor));
      }
    }
  };

  // ========================== On Refresh of Flatlist =================================
  const handleFlatlistRefresh = () => {
    if (!searchText) {
      if (tabTitle === 'Owned') {
        dispatch(ownedNftLoadStart());
        dispatch(ownedNftListReset());
        getDataCollection(1, '');
        dispatch(ownedNftPageChange(1));
        dispatch(ownedNftCursorChange(''));
      } else {
        dispatch(otherNftLoadStart());
        dispatch(otherNftListReset());
        getDataCollection(1, '');
        dispatch(otherNftPageChange(1));
        dispatch(otherNftCursorChange(''));
      }
    }
  };

  // ========================== Flatlist KeyExtractor(Unique Key) =================================
  const keyExtractor = (item, index) => {
    return `_${index}`;
  };

  // ========================== Reender Item of Flatlist ==========================================
  const renderItem = ({item, index}) => {
    let metaData = item?.metadata;
    const ItemDetail = JSON.parse(metaData);
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setTabTitle(tabTitle));
          navigation.navigate('ChatDetail', {
            nftDetail: ItemDetail,
            tokenId: item.token_id,
          });
        }}>
        <View style={styles.nftItemContainer}>
          <View>
            <C_Image
              size={ImagekitType.AVATAR}
              uri={ItemDetail?.image}
              imageStyle={styles.cImageContainer}
            />
          </View>
          <Text style={styles.nftTextShow}>
            {ItemDetail?.name.slice(ItemDetail?.name.lastIndexOf('#'))}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(() => renderItem, [nftCollectionList]);

  //=====================(Main return Function)=============================
  return (
    <View style={styles.mainListContainer}>
      {isNftLoading && nftPageChange == 1 ? (
        <View style={styles.centerViewStyle}>
          <Loader />
        </View>
      ) : //else
      nftCollectionList.length !== 0 ? (
        <View style={styles.nftListContainer}>
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
      ) : (
        <View style={styles.centerViewStyle}>
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>
              {translate('common.noNFTsFound')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatNftsList;
