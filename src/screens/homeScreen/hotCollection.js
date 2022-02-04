import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { C_Image, DetailModal, Loader } from '../../components';
import { colors } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
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
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(hotCollectionLoadStart());
    dispatch(hotCollectionListReset());
    getHotCollection(1);
    dispatch(hotCollectionPageChange(1));
  }, []);

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
      <TouchableOpacity
        onPress={() => {
          navigation.push('CollectionDetail', { collectionId: item._id });
        }}
        style={styles.listItem}>
        <C_Image
          type={
            item.bannerImage.split('.')[
            item.bannerImage.split('.').length - 1
            ]
          }
          uri={item.bannerImage}
          imageStyle={styles.listImage}
        />
      </TouchableOpacity>
    );
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [HotCollectionReducer.hotCollectionList],
  );

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {HotCollectionReducer.hotCollectionPage === 1 &&
        HotCollectionReducer.hotCollectionLoading ? (
        <Loader />
      ) : HotCollectionReducer.hotCollectionList.length !== 0 ? (
        <FlatList
          data={HotCollectionReducer.hotCollectionList}
          horizontal={false}
          numColumns={3}
          initialNumToRender={14}
          onRefresh={() => {
            dispatch(hotCollectionLoadStart());
            handleRefresh();
          }}
          scrollEnabled={!isModalVisible}
          refreshing={
            HotCollectionReducer.hotCollectionPage === 1 &&
            HotCollectionReducer.hotCollectionLoading
          }
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !HotCollectionReducer.hotCollectionLoading &&
              HotCollectionReducer.hotCollectionTotalCount !==
              HotCollectionReducer.hotCollectionList.length
            ) {
              let num = HotCollectionReducer.hotCollectionPage + 1;
              getHotCollection(num);
              dispatch(hotCollectionPageChange(num));
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
      {modalData && (
        <DetailModal
          data={modalData}
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

export default HotCollection;
