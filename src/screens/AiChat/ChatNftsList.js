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
    isOtherLoading,
    otherList,
    otherPageChange,
    otherTotalCount,
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
      getDataCollection(1);
      dispatch(ownedNftPageChange(1));
    } else {
      dispatch(otherNftLoadStart());
      dispatch(otherNftListReset());
      getDataCollection(1);
      dispatch(otherNftPageChange(1));
    }
  }, []);

  // ========================== API call =================================
  const getDataCollection = useCallback(page => {
    dispatch(getNftCollections(page, owner, tabTitle));
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
        getDataCollection(num);
        dispatch(ownedNftPageChange(num));
      } else {
        dispatch(otherNftLoadStart());
        getDataCollection(num);
        dispatch(otherNftPageChange(num));
      }
    }
  };

  // ========================== On Refresh of Flatlist =================================
  const handleFlatlistRefresh = () => {
    if (!searchText) {
      if (tabTitle === 'Owned') {
        dispatch(ownedNftLoadStart());
        dispatch(ownedNftListReset());
        getDataCollection(1);
        dispatch(ownedNftPageChange(1));
      } else {
        dispatch(otherNftLoadStart());
        dispatch(otherNftListReset());
        getDataCollection(1);
        dispatch(otherNftPageChange(1));
      }
    }
  };

  // ========================== Flatlist KeyExtractor(Unique Key) =================================
  const keyExtractor = (item, index) => {
    return `_${index}`;
  };

  // ========================== Reender Item of Flatlist ==========================================
  const renderItem = ({item, index}) => {
    const renderImg = item?.smallImage;
    const imgUrl = renderImg?.slice(0, renderImg?.lastIndexOf('.'));
    const imgExtension = renderImg?.slice(renderImg?.lastIndexOf('.'));
    const ImgNfts = imgUrl + '-thumb' + imgExtension + '?tr=w-120,tr=h-120';
    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setTabTitle(tabTitle));
          navigation.navigate('ChatDetail', {
            nftDetail: item,
            nftImage: ImgNfts,
          });
        }}>
        <View style={styles.nftItemContainer}>
          <View>
            <C_Image
              imageType={'profile'}
              size={ImagekitType.AVATAR}
              uri={ImgNfts}
              imageStyle={styles.cImageContainer}
            />
          </View>
          <Text style={styles.nftTextShow}>
            {item?.name.slice(item?.name.lastIndexOf('#'))}
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
            onEndReachedThreshold={0.5}
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
