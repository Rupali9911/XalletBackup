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
  const { HotCollectionReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFocused && isFirstRender) {
      console.log("hot collection",)
      dispatch(hotCollectionLoadStart());
      dispatch(hotCollectionListReset());
      getHotCollection(1);
      dispatch(hotCollectionPageChange(1))
      setIsFirstRender(false)
    }
  }, [isFocused]);

  const getHotCollection = useCallback((page) => {
    dispatch(hotCollectionList(page));
  }, []);

  const handleRefresh = () => {
    dispatch(hotCollectionListReset());
    getHotCollection(1);
    dispatch(hotCollectionPageChange(1));
  };

  const renderFooter = () => {
    if (!HotCollectionReducer.hotCollectionLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    return (
      <CollectionItem
        bannerImage={item.bannerImage}
        chainType={item.chainType}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.collectionName}
        creatorInfo={item.creatorInfo}
        blind={item.blind}
        onPress={() => {
          navigation.push('CollectionDetail', { isBlind: false, collectionId: item._id, isHotCollection: true });
        }}
      />
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [HotCollectionReducer.hotCollectionList],
  );

  const handleFlatlistRefresh = () => {
    dispatch(hotCollectionLoadStart());
    handleRefresh();
  }
  const handleFlastListEndReached = () => {
    if (
      !HotCollectionReducer.hotCollectionLoading &&
      HotCollectionReducer.hotCollectionTotalCount !==
      HotCollectionReducer.hotCollectionList.length
    ) {
      let num = HotCollectionReducer.hotCollectionPage + 1;
      getHotCollection(num);
      dispatch(hotCollectionPageChange(num));
    }
  }
  const keyExtractor = (item, index) => { return 'item_' + index }

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? isFirstRender : HotCollectionReducer.hotCollectionPage === 1 &&
        HotCollectionReducer.hotCollectionLoading ? (
        <Loader />
      ) : HotCollectionReducer.hotCollectionList.length !== 0 ? (
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
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default HotCollection;
