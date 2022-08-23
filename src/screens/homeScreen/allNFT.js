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
import { newNftLoadStart, newNFTData, newNftListReset } from '../../store/actions/newNFTActions';
import { CATEGORY_VALUE } from '../../constants'

import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';

const AllNFT = ({ screen, sortOption, setSortOption, page, setPage }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { NewNFTListReducer } = useSelector(state => state);

  // const { sort } = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  // const [isSort, setIsSort] = useState(null);
  const [end, setEnd] = useState()

  let category = CATEGORY_VALUE.allNft;
  let limit = 10;
  let sortCategory = 0;

  // ===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && (isFirstRender )) {
      timer = setTimeout(() => {
        dispatch(newNftLoadStart());
        dispatch(newNftListReset(category));
        getNFTlist(category, sortCategory, limit, 1);
        setSortOption(0)
        setPage(1)
        setIsFirstRender(false)
        screen(category)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [sortOption, isFocused]);



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
      />
    )
  }

  // ===================== Render No NFT Function ===================================
  const renderNoNFT = () => {
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>{translate('common.noDataFound')}</Text>
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
      getNFTlist(category, sortOption, limit, pageNum);
      setPage(pageNum)
    }
  }


  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newAllNftList.length) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let imageUri = item?.mediaUrl
    return (
      <NFTItem
        screenName="allNft"
        item={item}
        image={imageUri}
        onPress={() => {
          navigation.push('CertificateDetail', { item: item });
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
    getNFTlist(category, sortCategory, limit, 1);
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
