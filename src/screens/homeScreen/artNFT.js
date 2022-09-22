import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {ActivityIndicator, View, Text, StatusBar, FlatList} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  newNftLoadStart,
  newNFTData,
  newPageChange,
  newNftListReset,
} from '../../store/actions/newNFTActions';
import styles from './styles';
import {colors} from '../../res';
import {Loader} from '../../components';
import {translate} from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import {CATEGORY_VALUE} from '../../constants';

const ArtNFT = ({screen, sortOption, setSortOption, page, setPage}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const {NewNFTListReducer} = useSelector(state => state);
  // const { sort } = useSelector(state => state.ListReducer);

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  // const [isSort, setIsSort] = useState(0);

  const [end, setEnd] = useState();

  let category = CATEGORY_VALUE.art;
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
  }, [sortOption, isFocused]);

  //===================== Dispatch Action to Fetch Art NFT List =========================
  const getNFTlist = useCallback((category, sort, pageSize, pageNum) => {
    dispatch(newNFTData(category, sort, pageSize, pageNum));
  }, []);

  // ===================== Render Art NFT Flatlist ===================================
  const renderArtNFTList = () => {
    return (
      <FlatList
        data={NewNFTListReducer.newArtNftList}
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

  const handleRefresh = () => {
    dispatch(newNftListReset(category));
    getNFTlist(category, sortOption, limit, 1);
  };

  const handleFlastListEndReached = () => {
    if (
      !NewNFTListReducer.newNftListLoading &&
      NewNFTListReducer.newTotalCount !== NewNFTListReducer.newArtNftList.length
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
    let findIndex = NewNFTListReducer.newArtNftList.findIndex(
      x => item.id === x.id,
    );
    let imageUri = item?.mediaUrl;

    return (
      <NFTItem
        screenName="newNFT"
        item={item}
        image={imageUri}
        onPress={() => {
          // dispatch(changeScreenName('newNFT'));
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
    [NewNFTListReducer.newArtNftList],
  );

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? (
        isFirstRender
      ) : page === 1 && NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.newArtNftList.length !== 0 ? (
        renderArtNFTList()
      ) : (
        renderNoNFT()
      )}
    </View>
  );
};

export default React.memo(ArtNFT);
