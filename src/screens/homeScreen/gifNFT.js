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
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // =============== Getting data from reducer ========================
  const { ListReducer } = useSelector(state => state);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSort, setIsSort] = useState(null);

  //===================== UseEffect Function =========================
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isFocused && (isFirstRender || isSort !== ListReducer.sort)) {
        dispatch(nftLoadStart());
        dispatch(nftListReset('gif'));
        getNFTlist(1, null, ListReducer.sort);
        dispatch(pageChange(1));
        setIsFirstRender(false)
        setIsSort(ListReducer.sort)
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [ListReducer.sort, isFocused]);

  //===================== Dispatch Action to Fetch Gif NFT List =========================
  const getNFTlist = useCallback((page, limit, _sort) => {
    dispatch(gifNFTList(page, limit, _sort));
  }, []);

  // ===================== Render Gif NFT Flatlist ===================================
  const renderGifNFTList = () => {
    return (
      <FlatList
        data={ListReducer.gifList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={ListReducer.page === 1 && ListReducer.isGifNftLoading}
        renderItem={memoizedValue}
        onEndReached={handleFlastListEndReached}
        onEndReachedThreshold={0.4}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        pagingEnabled={false}
        legacyImplementation={false}
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
    dispatch(nftLoadStart());
    refreshFunc();
  }

  const refreshFunc = () => {
    dispatch(nftListReset('gif'));
    getNFTlist(1, null, ListReducer.sort);
    dispatch(pageChange(1));
  };

  const handleFlastListEndReached = () => {
    if (
      !ListReducer.isGifNftLoading &&
      ListReducer.gifList.length !== ListReducer.totalCount
    ) {
      let num = ListReducer.page + 1;
      getNFTlist(num);
      dispatch(pageChange(num));
    }
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!ListReducer.isGifNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = ListReducer.gifList.findIndex(x => x.id === item.id);
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          screenName="gitNFT"
          item={item}
          image={imageUri}
          onPress={() => {
            // dispatch(changeScreenName('gitNFT'));
            navigation.push('DetailItem', { index: findIndex, sName: "gitNFT" });
          }}
        />
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.gifList]);

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : ListReducer.page === 1 && ListReducer.isGifNftLoading ? (
        <Loader />
      ) : ListReducer.gifList.length !== 0 ? renderGifNFTList() : renderNoNFT()
      }
    </View >
  );
};

export default React.memo(GifNFT);
