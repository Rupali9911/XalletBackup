import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
import CollectionItem from '../../components/CollectionItem';
import {
  collectionListReset,
  collectionLoadStart,
  collectionPageChange,
  collectionList,
} from '../../store/actions/collectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';

const Collection = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let timer = null;

  // =============== Getting data from reducer ========================
  const { CollectionReducer } = useSelector(state => state);

  //================== Components State Declaration ===================
  const [isSelectTab, setSelectTab] = useState(true);

  //===================== UseEffect Function =========================
  useEffect(() => {
    timer = setTimeout(() => {
      dispatch(collectionLoadStart());
      dispatch(collectionListReset());
      getCollection(1, isSelectTab);
      dispatch(collectionPageChange(1));
    }, 100);

    return () => clearTimeout(timer)
  }, [isSelectTab]);

  //===================== Dispatch Action to Fetch Collection NFT List =========================
  const getCollection = useCallback((page, isSelectTab) => {
    dispatch(collectionList(page, isSelectTab));
  }, []);

  // ===================== Render Collection Tab ===================================
  const renderCollectionTab = () => {
    return (
      <View style={styles.collectionTab}>
        {renderSelectedTab(true)}
        {renderSelectedTab(false)}
      </View>
    )
  }

  const renderSelectedTab = (isCollectionTab) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectTab(isCollectionTab)}
        style={[styles.collectionTabItem, { borderTopColor: isCollectionTab ? isSelectTab ? colors.BLUE4 : 'transparent' : !isSelectTab ? colors.BLUE4 : 'transparent' }]}>
        {isCollectionTab && <Text style={[styles.collectionTabItemLabel, { color: isSelectTab ? colors.BLUE4 : colors.GREY1 }]}>
          {translate('wallet.common.collection')}
        </Text>}
        {!isCollectionTab && <Text style={[styles.collectionTabItemLabel, { color: !isSelectTab ? colors.BLUE4 : colors.GREY1 }]}>
          {translate('common.blindboxCollections')}
        </Text>}
      </TouchableOpacity>
    )
  }

  // ===================== Render Hot Collectio NFT Flatlist ===================================
  const renderHotCollectioNFTList = () => {
    return (
      <FlatList
        data={CollectionReducer.collectionList}
        horizontal={false}
        numColumns={2}
        initialNumToRender={14}
        onRefresh={handleFlatlistRefresh}
        refreshing={
          CollectionReducer.collectionPage === 1 &&
          CollectionReducer.collectionLoading
        }
        renderItem={renderItem}
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
    dispatch(collectionLoadStart());
    handleRefresh();
  }
  const handleRefresh = () => {
    dispatch(collectionListReset());
    getCollection(1);
    dispatch(collectionPageChange(1));
  };

  const handleFlastListEndReached = () => {
    if (
      !CollectionReducer.collectionLoading &&
      CollectionReducer.collectionTotalCount !==
      CollectionReducer.collectionList.length && isSelectTab
    ) {
      let num = CollectionReducer.collectionPage + 1;
      getCollection(num, isSelectTab);
      dispatch(collectionPageChange(num));
    } else if (
      !CollectionReducer.collectionLoading &&
      CollectionReducer.collectionTotalCount !==
      CollectionReducer.collectionList.length - 2 && !isSelectTab
    ) {
      let num = CollectionReducer.collectionPage + 1;
      getCollection(num, isSelectTab);
      dispatch(collectionPageChange(num));
    }
  }

  const keyExtractor = (item, index) => { return 'item_' + index }

  const renderFooter = () => {
    if (!CollectionReducer.collectionLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    return (
      <CollectionItem
        bannerImage={item.bannerImage}
        chainType={item.chainType || 'polygon'}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.collectionName}
        creator={item.creator}
        creatorInfo={item.creatorInfo}
        blind={item.blind}
        colId={item._id}
        onPress={() => {
          if (item.redirect === '/collection/underground_city') {
            navigation.push('CollectionDetail', {
              isBlind: true,
              collectionId: item?.collectionId,
              nftId: item._id,
              // isHotCollection: !item.blind,
            });
          } else
            if (item.redirect) {
              navigation.push('CollectionDetail',
                {
                  isBlind: false,
                  collectionId: item._id,
                  isHotCollection: true,
                  isStore: item.redirect,
                });
            } else if (item.blind) {
              // navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: false, nftId: item._id});
              navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: false });
            } else {
              navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: true });
            }
          // if (!isSelectTab) {
          //   navigation.push('CollectionDetail',
          //   {
          //     isBlind: false,
          //     collectionId: item._id,
          //     isHotCollection: true,
          //     isStore: item.redirect,
          //   });
          // } else if (item.blind) {
          //   console.log('========collection tab => blind1', item.blind, item.collectionId)
          //   navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: true });
          // } else {
          //   console.log("Else ")
          //   navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: false });
          // }
        }}
      />
    );
  };

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {renderCollectionTab()}
      {CollectionReducer.collectionPage === 1 &&
        CollectionReducer.collectionLoading ? (
        <Loader />
      ) : CollectionReducer.collectionList.length !== 0 ? renderHotCollectioNFTList() : renderNoNFT()}
    </View >
  );
};

export default React.memo(Collection);