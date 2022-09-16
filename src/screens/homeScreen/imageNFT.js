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
  newNftListReset,
  newNftLoadStart,
  newNFTData
} from '../../store/actions/newNFTActions';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';
import { CATEGORY_VALUE } from '../../constants'

const ImageNFT = ({ screen, sortOption, setSortOption, page, setPage }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { NewNFTListReducer } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true)
  // const [isSort, setIsSort] = useState(null);

  const [end, setEnd] = useState()

  let category = CATEGORY_VALUE.image;
  let limit = 10;
  let sortCategory = 0;


  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && (isFirstRender)) {
      timer = setTimeout(() => {
        dispatch(newNftListReset(category));
        dispatch(newNftLoadStart());
        getNFTlist(category, sortCategory, limit, 1);
        setIsFirstRender(false)
        setSortOption(0)
        setPage(1)
        screen(category)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [sortOption, isFocused]);


  //===================== Dispatch Action to Fetch Photo NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData(category, sort, pageSize, pageNum));
  }, []);

  // ===================== Render Photo NFT Flatlist ===================================
  const renderPhotoNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.newImageNftList}
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

  const handleRefresh = () => {
    dispatch(newNftListReset(category));
    getNFTlist(category, sortCategory, limit, 1);
    setPage(1)
  };

  const handleFlastListEndReached = () => {
    if (!NewNFTListReducer.newNftListLoading && NewNFTListReducer.newTotalCount !== NewNFTListReducer.newImageNftList.length) {
      let pageNum = page + 1
      getNFTlist(category, sortOption, limit, pageNum);
      setPage(pageNum)
    }
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!NewNFTListReducer.newNftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let findIndex = NewNFTListReducer.newImageNftList.findIndex(
      x => x.id === item.id,
    );
    let imageUri = item?.mediaUrl

    return (
      <NFTItem
        item={item}
        screenName="imageNFT"
        image={imageUri}
        onPress={() => {
          // dispatch(changeScreenName('photoNFT'));
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
    [NewNFTListReducer.newImageNftList],
  );



  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : page === 1 &&
        NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.newImageNftList.length !== 0 ? renderPhotoNFTList()
        : renderNoNFT()
      }
    </View >
  );
};

export default React.memo(ImageNFT);
