import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
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
import HotcollectionItem from '../../components/HotCollectionItem';
import {
  collectionListReset,
  collectionLoadStart,
  collectionPageChange,
  collectionList,
} from '../../store/actions/collectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';

const Collection = () => {
  const { CollectionReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(collectionLoadStart());
    dispatch(collectionListReset());
    getCollection(1);
    dispatch(collectionPageChange(1));
  }, []);

  const getCollection = useCallback((page) => {
    dispatch(collectionList(page));
  }, []);

  const handleRefresh = () => {
    dispatch(collectionListReset());
    getCollection(1);
    dispatch(collectionPageChange(1));
  };

  const renderFooter = () => {
    if (!CollectionReducer.collectionLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
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
        onPress={() => {
          if (item.blind) {
            navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId });
          } else {
            navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id });
          }
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [CollectionReducer.collectionList],
  );

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {CollectionReducer.collectionPage === 1 &&
        CollectionReducer.collectionLoading ? (
        <Loader />
      ) : CollectionReducer.collectionList.length !== 0 ? (
        <FlatList
          data={CollectionReducer.collectionList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          onRefresh={() => {
            dispatch(collectionLoadStart());
            handleRefresh();
          }}
          refreshing={
            CollectionReducer.collectionPage === 1 &&
            CollectionReducer.collectionLoading
          }
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !CollectionReducer.collectionLoading &&
              CollectionReducer.collectionTotalCount !==
              CollectionReducer.collectionList.length
            ) {
              let num = CollectionReducer.collectionPage + 1;
              getCollection(num);
              dispatch(collectionPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default Collection;
