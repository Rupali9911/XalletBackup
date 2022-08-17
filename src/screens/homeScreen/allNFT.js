import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
// import {
//   awardsNftListReset,
//   awardsNftLoadStart,
//   awardsNftPageChange,
//   getAwardsNftList,
// } from '../../store/actions/awardsAction';
import { newNftLoadStart, newNFTData, newNftListReset } from '../../store/actions/newNFTActions';

import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';

const AllNFT = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { NewNFTListReducer } = useSelector(state => state);

  const { sort } = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSort, setIsSort] = useState(null);
  const [page, setPage] = useState(1);

  const [end, setEnd] = useState()

  // ===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== sort)) {
      timer = setTimeout(() => {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset());
        getNFTlist(6, 0, 10, page);
        // dispatch(awardsNftPageChange(1));
        setIsFirstRender(false)
        setIsSort(sort)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [sort, isFocused]);



  //===================== Dispatch Action to Fetch Award NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData('all', category, sort, pageSize, pageNum));
  }, []);

  // ===================== Render Award NFT Flatlist ===================================
  const renderAllNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.newAllNftList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={NewNFTListReducer.newListPage === 1 && NewNFTListReducer.newNftListLoading}
        renderItem={memoizedValue}
        onEndReached={() => {
          if (!end) {
            handleFlastListEndReached()
            setEnd(true)
          }
        }}
        onEndReachedThreshold={0.4}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        pagingEnabled={false}
        legacyImplementation={false}
        onMomentumScrollBegin={() => setEnd(false)}
      // removeClippedSubviews={true}
      // maxToRenderPerBatch = {30}
      // windowSize = {30}
      // updateCellsBatchingPeriod={70}
      // disableVirtualization={false}
      // legacyImplementation={true}
      />
    )
  }

  // ===================== Render No NFT Function ===================================
  const renderNoNFT = () => {
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
      </View>
    )
  }

  //=================== Flatlist Functions ====================
  const handleFlatlistRefresh = () => {
    dispatch(newNftLoadStart());
    handleRefresh();
  }


  const handleFlastListEndReached = () => {
    if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newAllNftList.length) {
      let pageNum = page + 1
      getNFTlist(6, 0, 10, pageNum);
      // dispatch(newPageChange(pageNum))
      setPage(pageNum)
    }
  }


  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newAllNftList.length) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    // let findIndex = AwardsNFTReducer.awardsNftList.findIndex(
    //   x => x.id === item.id,
    // );
    let imageUri = item?.mediaUrl
    return (
      <NFTItem
        screenName="allNft"
        item={item}
        image={imageUri}
        onPress={() => {
          // dispatch(changeScreenName('awards'));
          navigation.push('DetailItem', { index: renderItemFIndIndex(item), sName: "allNft" });
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [NewNFTListReducer.newAllNftList],
  );

  //=================== Other Functions ====================
  const handleRefresh = () => {
    dispatch(newNftListReset());
    getNFTlist(6, 0, 10, 1);
    setPage(1)
  }



  const renderItemFIndIndex = (item) => {
    let findIndex = NewNFTListReducer.newAllNftList.findIndex(
      x => x.id === item.id,
    );
    return findIndex
  }

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : page === 1 &&
        NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.newAllNftList.length !== 0 ? renderAllNFTList()
        : renderNoNFT()
      }
    </View >
  );
};
export default React.memo(AllNFT);
