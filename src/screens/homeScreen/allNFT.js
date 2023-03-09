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
import {CATEGORY_VALUE} from '../../constants';

import {translate} from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';

const AllNFT = ({sortOption, screen}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // =============== Getting data from reducer ========================
  const {NewNFTListReducer} = useSelector(state => state);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [end, setEnd] = useState();

  let category = CATEGORY_VALUE.allNft;
  let limit = 10;
  let sortCategory = 0;

  // ===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && isFirstRender) {
      dispatch(newNftLoadStart());
      dispatch(newNftListReset(category));
      getNFTlist(category, sortCategory, limit, 1);
      setIsFirstRender(false);
    } else {
      if (
        NewNFTListReducer.newAllNftCurrentFilter != sortCategory &&
        screen === category
      ) {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset(category));
        getNFTlist(category, sortCategory, limit, 1);
      }
    }
  }, [screen]);

  //===================== Dispatch Action to Fetch Award NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData(category, sort, pageSize, pageNum));
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
    handleRefresh();
  };

  const handleFlastListEndReached = () => {
    if (
      !NewNFTListReducer.newNftListLoading &&
      NewNFTListReducer.newAllNftTotalCount !==
        NewNFTListReducer.newAllNftList.length
    ) {
      getNFTlist(category, sortOption, limit, NewNFTListReducer.newAllNftPage);
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
    return (
      <NFTItem
        screenName="allNft"
        item={item}
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
    [NewNFTListReducer.newAllNftList],
  );

  //=================== Other Functions ====================
  const handleRefresh = () => {
    dispatch(newNftListReset(category));
    getNFTlist(category, sortOption, limit, 1);
  };

  const renderItemFIndIndex = item => {
    let findIndex = NewNFTListReducer.newAllNftList.findIndex(
      x => x.id === item.id,
    );
    return findIndex;
  };

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ||
      (NewNFTListReducer.newAllNftPage === 1 &&
        NewNFTListReducer.newNftListLoading) ? (
        <Loader />
      ) : NewNFTListReducer.newAllNftList.length !== 0 ? (
        renderAllNFTList()
      ) : (
        renderNoNFT()
      )}
    </View>
  );
};
export default React.memo(AllNFT);
