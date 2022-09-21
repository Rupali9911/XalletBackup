import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
import CollectionItem from '../../components/CollectionItem';
import {
  hotCollectionListReset,
  hotCollectionLoadStart,
  hotCollectionPageChange,
  hotCollectionList,
} from '../../store/actions/hotCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';

const HotCollection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { HotCollectionReducer } = useSelector(state => state);

  const isLoading = HotCollectionReducer.hotCollectionLoading
    const hotCollectionData = HotCollectionReducer.hotCollectionList
    const page = HotCollectionReducer.hotCollectionPage;
    const totalCount = HotCollectionReducer.hotCollectionTotalCount;

  //================== Components State Declaration ===================
  const [isFirstRender, setIsFirstRender] = useState(true);
  

  //===================== UseEffect Function =========================
  useEffect(() => {
    if (isFocused && isFirstRender) {
      timer = setTimeout(() => {
        console.log("hot collection",)
        dispatch(hotCollectionLoadStart());
        dispatch(hotCollectionListReset());
        getHotCollection(1,totalCount);
        dispatch(hotCollectionPageChange(1));
        setIsFirstRender(false)
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [isFocused]);

  //===================== Dispatch Action to Fetch Hot Collection NFT List =========================
  const getHotCollection = useCallback((page,totalCount) => {
    dispatch(hotCollectionList(page,totalCount));
  }, []);

  // ===================== Render Hot Collectio NFT Flatlist ===================================
  const renderHotCollectioNFTList = () => {
    return (
      <FlatList
        data={HotCollectionReducer.hotCollectionList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={
          HotCollectionReducer.hotCollectionPage === 1 &&
          HotCollectionReducer.hotCollectionLoading
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
        <Text style={styles.sorryMessage}>{translate('common.noDataFound')}</Text>
      </View>
    )
  }

  //=================== Flatlist Functions ====================
  const handleFlatlistRefresh = () => {
    dispatch(hotCollectionLoadStart());
    handleRefresh();
  }

  const handleRefresh = () => {
    dispatch(hotCollectionListReset());
    getHotCollection(1,totalCount);
    dispatch(hotCollectionPageChange(1));
  };

  //============= This function is not calling from anywhere (Unused) ============
  const handleFlastListEndReached = () => {
    if (
      !HotCollectionReducer.hotCollectionLoading &&
      HotCollectionReducer.hotCollectionTotalCount !== 
      HotCollectionReducer.hotCollectionList.length
    ) {
      let num = HotCollectionReducer.hotCollectionPage + 1;
      getHotCollection(num, totalCount); 
      dispatch(hotCollectionPageChange(num)); 
    }
  }
  //=====================================================
  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    console.log(HotCollectionReducer.hotCollectionLoading, 'Login Data')
    if (!HotCollectionReducer.hotCollectionLoading) return null;
    return <ActivityIndicator size="small" color={'red'} />;
  };
  
  const renderItem = ({ item }) => {
    return (
      <CollectionItem
        bannerImage={item.bannerImage}
        creator={item.owner}
        chainType={item.chainType}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.name}
        creatorInfo={item.creatorInfo} 
        isHotCollection={item.isHot}
        blind={item.blind}
        count={item.totalNft}
        network={item.network}
        colId={item._id}
        onPress={() => {
          if (item.collectionName !== 'NFTART AWARD 2021') { 
            navigation.push('CollectionDetail', { networkName: item?.network?.networkName, contractAddress: item?.contractAddress,  launchpadId: null});
            // navigation.push('CollectionDetail', { networkName: item.network.networkName, contractAddress: item.contractAddress  });
          } else {
            Linking.openURL('https://www.xanalia.com/xanalia_nftart_award_2021')
              .catch(err => {
                console.error("Failed opening page because: ", err)
              })
          } 
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [HotCollectionReducer.hotCollectionList],
  );

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : HotCollectionReducer.hotCollectionPage === 1 &&
        HotCollectionReducer.hotCollectionLoading ? (
        <Loader />
      ) : HotCollectionReducer.hotCollectionList.length !== 0 ? renderHotCollectioNFTList() : renderNoNFT()}
    </View>
  );
};

export default React.memo(HotCollection);