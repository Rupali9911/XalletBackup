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

const MovieNFT = ({ sortOption, screen }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // =============== Getting data from reducer ========================
  const {NewNFTListReducer} = useSelector(state => state);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);

  const [end, setEnd] = useState();

  let category = CATEGORY_VALUE.movie;
  let limit = 10;
  let sortCategory = 0;

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && isFirstRender) {
      dispatch(newNftLoadStart());
      dispatch(newNftListReset(category));
      getNFTlist(category, sortCategory, limit, 1);
      setIsFirstRender(false);
    
    }
    else {
      if ((NewNFTListReducer.newMovieNftCurrentFilter != sortCategory) && (screen === category)) {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset(category));
        getNFTlist(category, sortCategory, limit, 1);
      }
    }
  }, [screen]);

  //===================== Dispatch Action to Fetch Movie NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData(category, sort, pageSize, pageNum));
  }, []);

  // ===================== Render Movie NFT Flatlist ===================================
  const renderMovieNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.newMovieNftList}
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
  };

  const handleFlastListEndReached = () => {
    if (
      !NewNFTListReducer.newNftListLoading &&
      NewNFTListReducer.newMovieNftTotalCount !==
        NewNFTListReducer.newMovieNftList.length
    ) {
      
      getNFTlist(
        category,
        sortOption,
        limit,
        NewNFTListReducer.newMovieNftPage,
      );
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
        screenName="movieNFT"
        item={item}
        image={imageUri}
        onPress={() => {
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [NewNFTListReducer.newMovieNftList],
  );

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ||
      (NewNFTListReducer.newMovieNftPage === 1 &&
        NewNFTListReducer.newNftListLoading) ? (
        <Loader />
      ) : NewNFTListReducer.newMovieNftList.length !== 0 ? (
        renderMovieNFTList()
      ) : (
        renderNoNFT()
      )}
    </View>
  );
};

export default React.memo(MovieNFT);
