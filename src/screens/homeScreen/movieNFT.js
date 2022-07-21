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
  movieNFTList,
  nftListReset,
  nftLoadStart,
  pageChange,
} from '../../store/actions/nftTrendList';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';

const MovieNFT = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { ListReducer } = useSelector(state => state);

  //================== Components State Declaration ===================
  const [isSort, setIsSort] = useState(null);
  const [isFirstRender, setIsFirstRender] = useState(true);

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== ListReducer.sort)) {
      timer = setTimeout(() => {
        console.log('MovieNFT')
        dispatch(nftLoadStart());
        dispatch(nftListReset('movie'));
        getNFTlist(1, null, ListReducer.sort);
        dispatch(pageChange(1));
        setIsFirstRender(false)
        setIsSort(ListReducer.sort)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [ListReducer.sort, isFocused]);

  //===================== Dispatch Action to Fetch Movie NFT List =========================
  const getNFTlist = useCallback((page, limit, _sort) => {
    dispatch(movieNFTList(page, limit, _sort));
  }, []);

  // ===================== Render Movie NFT Flatlist ===================================
  const renderMovieNFTList = () => {
    return (
      <FlatList
        data={ListReducer.movieList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={ListReducer.page === 1 && ListReducer.isMovieNftLoading}
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
    dispatch(nftListReset('movie'));
    getNFTlist(1, null, ListReducer.sort);
    dispatch(pageChange(1));
  };

  const handleFlastListEndReached = () => {
    if (
      !ListReducer.isMovieNftLoading &&
      ListReducer.movieList.length !== ListReducer.totalCount
    ) {
      let num = ListReducer.page + 1;
      getNFTlist(num);
      dispatch(pageChange(num));
    }
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!ListReducer.isMovieNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = ListReducer.movieList.findIndex(x => x.id === item.id);
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          screenName="movieNFT"
          item={item}
          image={imageUri}
          onPress={() => {
            // dispatch(changeScreenName('movieNFT'));
            navigation.push('DetailItem', { index: findIndex, sName: "movieNFT" });
          }}
        />
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.movieList]);

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : ListReducer.page === 1 && ListReducer.isMovieNftLoading ? (
        <Loader />
      ) : ListReducer.movieList.length !== 0 ? renderMovieNFTList() : renderNoNFT()}
    </View>
  );
};

export default React.memo(MovieNFT);
