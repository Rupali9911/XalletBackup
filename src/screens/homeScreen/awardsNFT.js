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
import { changeScreenName } from '../../store/actions/authAction';
import {
  awardsNftListReset,
  awardsNftLoadStart,
  awardsNftPageChange,
  getAwardsNftList,
} from '../../store/actions/awardsAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';
const AwardsNFT = () => {
  const { AwardsNFTReducer } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSort, setIsSort] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== sort)) {
      console.log("award nft")
      dispatch(awardsNftLoadStart());
      dispatch(awardsNftListReset());
      getNFTlist(1, null, sort);
      dispatch(awardsNftPageChange(1));
      setIsFirstRender(false)
      setIsSort(sort)
    }
  }, [sort, isFocused]);
  const getNFTlist = useCallback((page, limit, _sort) => {
    // console.log('__sort',_sort);
    dispatch(getAwardsNftList(page, limit, _sort));
  }, []);
  const handleRefresh = () => {
    dispatch(awardsNftListReset());
    getNFTlist(1, null, sort);
    dispatch(awardsNftPageChange(1));
  };
  const renderFooter = () => {
    if (!AwardsNFTReducer.awardsNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };
  const renderItemFIndIndex = (item) => {
    let findIndex = AwardsNFTReducer.awardsNftList.findIndex(
      x => x.id === item.id,
    );
    return findIndex
  }
  const renderItem = ({ item }) => {
    // let findIndex = AwardsNFTReducer.awardsNftList.findIndex(
    //   x => x.id === item.id,
    // );
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          screenName="awards"
          item={item}
          // image={imageUri}
          onPress={() => {
            // dispatch(changeScreenName('awards'));
            // console.log("#####Award NFT Navigation######")
            navigation.push('DetailItem', { index: renderItemFIndIndex(item), sName: "awards" });
          }}
        />
      );
    }
  };
  const memoizedValue = useMemo(
    () => renderItem,
    [AwardsNFTReducer.awardsNftList],
  );
  const handleFlatlistRefresh = () => {
    dispatch(awardsNftLoadStart());
    handleRefresh();
  }
  const handleFlastListEndReached = () => {
    if (
      !AwardsNFTReducer.awardsNftLoading &&
      AwardsNFTReducer.awardsTotalCount !==
      AwardsNFTReducer.awardsNftList.length
    ) {
      let num = AwardsNFTReducer.awardsNftPage + 1;
      getNFTlist(num);
      dispatch(awardsNftPageChange(num));
    }
  }
  const keyExtractor = (item, index) => { return 'item_' + index }

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {AwardsNFTReducer.awardsNftPage === 1 &&
        AwardsNFTReducer.awardsNftLoading ? (
        <Loader />
      ) : AwardsNFTReducer.awardsNftList.length !== 0 ? (
        <FlatList
          data={AwardsNFTReducer.awardsNftList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          onRefresh={handleFlatlistRefresh}
          refreshing={
            AwardsNFTReducer.awardsNftPage === 1 &&
            AwardsNFTReducer.awardsNftLoading
          }
          renderItem={memoizedValue}
          onEndReached={handleFlastListEndReached}
          onEndReachedThreshold={0.4}
          keyExtractor={keyExtractor}
          ListFooterComponent={renderFooter}
          pagingEnabled={false}
          legacyImplementation={false}
          // removeClippedSubviews={true}
          // maxToRenderPerBatch = {30}
          // windowSize = {30}
          // updateCellsBatchingPeriod={70}
          // disableVirtualization={false}
          // legacyImplementation={true}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};
export default React.memo(AwardsNFT);
