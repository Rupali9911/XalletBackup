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
  favoriteNFTList,
  newNftListReset,
  newNftLoadStart,
  newPageChange,
} from '../../store/actions/newNFTActions';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';

const PhotoNFT = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { NewNFTListReducer } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isSort, setIsSort] = useState(null);

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== sort)) {
      timer = setTimeout(() => {
        console.log("PhotoNFT")
        dispatch(newNftLoadStart('photo'));
        dispatch(newNftListReset('photo'));
        getNFTlist(1, null, sort);
        setIsFirstRender(false)
        dispatch(newPageChange(1));
        setIsSort(sort)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [sort, isFocused]);

  //===================== Dispatch Action to Fetch Photo NFT List =========================
  const getNFTlist = useCallback((page, limit, _sort) => {
    dispatch(favoriteNFTList(page, limit, _sort));
  }, []);

  // ===================== Render Photo NFT Flatlist ===================================
  const renderPhotoNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.favoriteNftList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={
          NewNFTListReducer.newListPage === 1 &&
          NewNFTListReducer.isPhotoNftLoading
        }
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
    dispatch(newNftLoadStart('photo'));
    handleRefresh();
  }

  const handleRefresh = () => {
    dispatch(newNftListReset());
    getNFTlist(1, null, sort);
    dispatch(newPageChange(1));
  };

  const handleFlastListEndReached = () => {
    if (
      !NewNFTListReducer.isPhotoNftLoading &&
      NewNFTListReducer.newTotalCount !==
      NewNFTListReducer.favoriteNftList.length
    ) {
      let num = NewNFTListReducer.newListPage + 1;
      getNFTlist(num);
      dispatch(newPageChange(num));
    }
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!NewNFTListReducer.isPhotoNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let findIndex = NewNFTListReducer.favoriteNftList.findIndex(
      x => x.id === item.id,
    );
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          item={item}
          screenName="photoNFT"
          image={imageUri}
          onPress={() => {
            // dispatch(changeScreenName('photoNFT'));
            navigation.push('DetailItem', { index: findIndex, sName: "photoNFT" });
          }}
        />
      );
    }
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [NewNFTListReducer.favoriteNftList],
  );

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : NewNFTListReducer.newListPage === 1 &&
        NewNFTListReducer.isPhotoNftLoading ? (
        <Loader />
      ) : NewNFTListReducer.favoriteNftList.length !== 0 ? renderPhotoNFTList() : renderNoNFT()}
    </View>
  );
};

export default React.memo(PhotoNFT);
