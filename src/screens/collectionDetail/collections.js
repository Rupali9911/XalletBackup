import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
  Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import {
  nftBlindDataCollectionList,
  nftDataCollectionList,
  nftDataCollectionListReset,
  nftDataCollectionLoadStart,
  nftDataCollectionPageChange,
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';
import HotcollectionItem from '../../components/HotCollectionItem';

const COLLECTION_TYPES = ['onsale', 'notonsale', 'owned', 'gallery'];
const { height } = Dimensions.get('window');

const Collections = (props) => {
  const { collectionAddress, collectionType, isBlind, isHotCollection } = props;
  const { NftDataCollectionReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(nftDataCollectionLoadStart());
    dispatch(nftDataCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataCollectionPageChange(1));
  }, [collectionType]);

  const getNFTlist = useCallback((page) => {
    if (!isBlind) {
      dispatch(nftDataCollectionList(page, collectionAddress, COLLECTION_TYPES[collectionType], collectionAddress));
    } else {
      dispatch(nftBlindDataCollectionList(collectionAddress));
    }
    // dispatch(nftDataCollectionList(page, collectionAddress, COLLECTION_TYPES[collectionType], collectionId));
  }, [collectionType]);

  const refreshFunc = () => {
    dispatch(nftDataCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataCollectionPageChange(1));
  };

  const renderFooter = () => {
    if (!NftDataCollectionReducer.nftDataCollectionLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = NftDataCollectionReducer.nftDataCollectionList.findIndex(x => x.id === item.id);
    if (isHotCollection) {
      return (
        <NFTItem
          item={item}
          index={index}
          image={item.iconImage}
          onPress={() => {
            dispatch(changeScreenName('dataCollection'));
            navigation.push('DetailItem', {
              index: findIndex,
              collectionType: COLLECTION_TYPES[collectionType],
              collectionAddress,
            });
          }}
          isCollection
          isBlind
        />
        )
    }
    return (
      <HotcollectionItem
        bannerImage={item.bannerImage}
        chainType={item.chainType || 'polygon'}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.collectionName}
        creator={item.creator}
        creatorInfo={item.creatorInfo}
        blind={item.blind}
        isCollection={!isHotCollection}
        onPress={() => {
          if (item.blind) {
            navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: !item.blind });
          } else {
            console.log('======blind', item._id, item.collectionId, item.blind, isHotCollection)
              if (item.collectionId) {
                  navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: true });
              }
          }
        }}
      />
    );
  };

  const memoizedValue = useMemo(() => renderItem, [NftDataCollectionReducer.nftDataCollectionList]);

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {NftDataCollectionReducer.nftDataCollectionPage === 1 && NftDataCollectionReducer.nftDataCollectionLoading ? (
        <View style={{ marginTop: height / 8 }}>
          <Loader />
        </View>
      ) : NftDataCollectionReducer.nftDataCollectionList.length !== 0 ? (
        <FlatList
          data={NftDataCollectionReducer.nftDataCollectionList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={15}
          onRefresh={() => {
            dispatch(nftDataCollectionLoadStart());
            refreshFunc();
          }}
          refreshing={NftDataCollectionReducer.nftDataCollectionPage === 1 && NftDataCollectionReducer.nftDataCollectionLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !NftDataCollectionReducer.nftDataCollectionLoading &&
              NftDataCollectionReducer.nftDataCollectionList.length !== NftDataCollectionReducer.nftDataCollectionTotalCount
            ) {
              let num = NftDataCollectionReducer.nftDataCollectionPage + 1;
              getNFTlist(num);
              dispatch(nftDataCollectionPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={{ marginTop: height / 8 }}>
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Collections;
