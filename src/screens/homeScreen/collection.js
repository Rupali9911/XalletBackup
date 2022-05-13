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
  const { CollectionReducer } = useSelector(state => state);
  const [isSelectTab, setSelectTab] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(collectionLoadStart());
    dispatch(collectionListReset());
    getCollection(1, isSelectTab);
    dispatch(collectionPageChange(1));
  }, [isSelectTab]);

  const getCollection = useCallback((page, isSelectTab) => {
    dispatch(collectionList(page, isSelectTab));
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
      <CollectionItem
        bannerImage={item.bannerImage}
        chainType={item.chainType || 'polygon'}
        items={item.items}
        iconImage={item.iconImage}
        collectionName={item.collectionName}
        creator={item.creator}
        creatorInfo={item.creatorInfo}
        blind={item.blind}
        onPress={() => {
          console.log('========', item, item.redirect, item.isBlind, isSelectTab);
          if (item.redirect) {
            navigation.push('CollectionDetail',
              {
                isBlind: false,
                collectionId: item._id,
                isHotCollection: true,
                isStore: item.redirect,
              });
          } else if (item.blind) {
            console.log('========collection tab => blind1', item.blind, item.collectionId)
            // navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: false, nftId: item._id});
            navigation.push('CollectionDetail', { isBlind: true, collectionId: item.collectionId, isHotCollection: false});
          } else {
          console.log("🚀 ~ file: collection.js ~ line 77 ~ renderItem ~ else")
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
      <View style={styles.collectionTab}>
        <TouchableOpacity
          onPress={() => setSelectTab(true)}
          style={[styles.collectionTabItem, { borderTopColor: isSelectTab ? colors.BLUE4 : 'transparent' }]}>
          <Text style={[styles.collectionTabItemLabel, { color: isSelectTab ? colors.BLUE4 : colors.GREY1 }]}>
            {translate('wallet.common.collection')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectTab(false)}
          style={[styles.collectionTabItem, { borderTopColor: !isSelectTab ? colors.BLUE4 : 'transparent' }]}>
          <Text style={[styles.collectionTabItemLabel, { color: !isSelectTab ? colors.BLUE4 : colors.GREY1 }]}>
            {translate('common.blindboxCollections')}
          </Text>
        </TouchableOpacity>
      </View>
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
          renderItem={renderItem}
          onEndReached={() => {
            if (
              !CollectionReducer.collectionLoading &&
              CollectionReducer.collectionTotalCount !==
              CollectionReducer.collectionList.length
            ) {
              let num = CollectionReducer.collectionPage + 1;
              getCollection(num, isSelectTab);
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
