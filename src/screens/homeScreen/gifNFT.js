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
  gifNFTList,
  nftListReset,
  nftLoadStart,
  pageChange,
} from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';

const GifNFT = () => {
  const { ListReducer } = useSelector(state => state);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSort, setIsSort] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== ListReducer.sort)) {
      console.log("gifnft")
      dispatch(nftLoadStart());
      dispatch(nftListReset('gif'));
      getNFTlist(1, null, ListReducer.sort);
      dispatch(pageChange(1));
      setIsFirstRender(false)
      setIsSort(ListReducer.sort)
    }
  }, [ListReducer.sort, isFocused]);

  const getNFTlist = useCallback((page, limit, _sort) => {
    // console.log('__sort',_sort);
    dispatch(gifNFTList(page, limit, _sort));
  }, []);

  const refreshFunc = () => {
    dispatch(nftListReset('gif'));
    getNFTlist(1, null, ListReducer.sort);
    dispatch(pageChange(1));
  };

  const renderFooter = () => {
    if (!ListReducer.isGifNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = ListReducer.gifList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          item={item}
          image={imageUri}
          onPress={() => {
            dispatch(changeScreenName('gitNFT'));
            navigation.push('DetailItem', { index: findIndex });
          }}
        />
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.gifList]);

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : ListReducer.page === 1 && ListReducer.isGifNftLoading ? (
        <Loader />
      ) : ListReducer.gifList.length !== 0 ? (
        <FlatList
          data={ListReducer.gifList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          onRefresh={() => {
            dispatch(nftLoadStart());
            refreshFunc();
          }}
          refreshing={ListReducer.page === 1 && ListReducer.isGifNftLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !ListReducer.isGifNftLoading &&
              ListReducer.gifList.length !== ListReducer.totalCount
            ) {
              let num = ListReducer.page + 1;
              getNFTlist(num);
              dispatch(pageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default GifNFT;
