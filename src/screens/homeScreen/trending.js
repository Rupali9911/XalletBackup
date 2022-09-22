import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StatusBar, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import {colors} from '../../res';
import {
  newNftLoadStart,
  newNFTData,
  newNftListReset,
} from '../../store/actions/newNFTActions';

import {translate} from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';
import {CATEGORY_VALUE} from '../../constants';

const Trending = ({screen, sortOption, setSortOption, page, setPage}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  let timer = null;

  // =============== Getting data from reducer ========================
  const {NewNFTListReducer} = useSelector(state => state);
  const {sort} = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  // const [isSort, setIsSort] = useState(null);

  const [end, setEnd] = useState();

  let category = CATEGORY_VALUE.trending;
  let limit = 10;
  let sortCategory = 0;

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && isFirstRender) {
      timer = setTimeout(() => {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset(category));
        getNFTlist(category, sortCategory, limit, 1);
        setIsFirstRender(false);
        setSortOption(0);
        setPage(1);
        screen(category);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [isFocused]);

  //===================== Dispatch Action to Fetch Hot NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData(category, sort, pageSize, pageNum));
  }, []);

  // ===================== Render Hot NFT Flatlist ===================================
  const renderTrendingNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.newTrendingNftList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={
          NewNFTListReducer.newListPage === 1 &&
          NewNFTListReducer.newNftListLoading
        }
        renderItem={memoizedValue}
        onEndReached={() => {
          if (!end) {
            handleFlastListEndReached();
            setEnd(true);
          }
        }}
        onEndReachedThreshold={0.4}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        pagingEnabled={false}
        legacyImplementation={false}
        onMomentumScrollBegin={() => setEnd(false)}
      />
    );
  };

  // ===================== Render No NFT Function ===================================
  const renderNoNFT = () => {
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>
          {translate('common.noDataFound')}
        </Text>
      </View>
    );
  };

  //=================== Flatlist Functions ====================
  const handleFlatlistRefresh = () => {
    dispatch(newNftLoadStart());
    refreshFunc();
  };

  const refreshFunc = () => {
    dispatch(newNftListReset(category));
    getNFTlist(category, sortOption, limit, 1);
    setPage(1);
  };

  const handleFlastListEndReached = () => {
    if (
      !NewNFTListReducer.newNftListLoading &&
      NewNFTListReducer.newTotalCount !==
        NewNFTListReducer.newTrendingNftList.length
    ) {
      let pageNum = page + 1;
      getNFTlist(category, sortOption, limit, pageNum);
      setPage(pageNum);
    }
  };

  const keyExtractor = (item, index) => {
    return 'item_' + index;
  };

  const renderFooter = () => {
    if (!NewNFTListReducer.newNftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({item}) => {
    let imageUri = item?.mediaUrl;
    return (
      <NFTItem
        item={item}
        screenName="trending"
        image={imageUri}
        onPress={() => {
          // dispatch(changeScreenName('Hot'));
          navigation.push('CertificateDetail', {item: item});
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [NewNFTListReducer.newTrendingNftList],
  );

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? (
        isFirstRender
      ) : page === 1 && NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.newTrendingNftList.length !== 0 ? (
        renderTrendingNFTList()
      ) : (
        renderNoNFT()
      )}
    </View>
  );
};

export default React.memo(Trending);
