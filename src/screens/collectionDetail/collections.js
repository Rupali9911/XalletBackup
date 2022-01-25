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
import { SIZE } from '../../constants';
import { colors } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import {
  nftDataCollectionList,
  nftDataCollectionListReset,
  nftDataCollectionLoadStart,
  nftDataCollectionPageChange,
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import { SVGS } from 'src/constants';

const COLLECTION_TYPES = ['onsale', 'notonsale', 'owned', 'gallery'];

const Collections = (props) => {
  const { collectionAddress, collectionType } = props;
  const { NftDataCollectionReducer } = useSelector(state => state);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    PolygonIcon,
    Ethereum,
    BitmapIcon,
  } = SVGS;

  useEffect(() => {
    dispatch(nftDataCollectionLoadStart());
    dispatch(nftDataCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataCollectionPageChange(1));
  }, [collectionType]);

  const getNFTlist = useCallback((page) => {
    dispatch(nftDataCollectionList(page, collectionAddress, COLLECTION_TYPES[collectionType]));
  }, [collectionType]);

  const refreshFunc = () => {
    dispatch(nftDataCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataCollectionPageChange(1));
  };

  const chainType = (type) => {
    if (type === 'polygon') return <PolygonIcon />
    if (type === 'ethereum') return <Ethereum />
    if (type === 'binance') return <BitmapIcon />
  };

  const renderFooter = () => {
    if (!NftDataCollectionReducer.nftDataCollectionLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = NftDataCollectionReducer.nftDataCollectionList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <TouchableOpacity
          onLongPress={() => {
            item.index = index;
            setModalData(item);
            setModalVisible(true);
          }}
          onPress={() => {
            dispatch(changeScreenName('dataCollection'));
            navigation.push('DetailItem', {
              index: findIndex,
              collectionType: COLLECTION_TYPES[collectionType],
              collectionAddress,
            });
          }}
          style={styles.listItem}>
          <View style={styles.listItemContainer}>
            <C_Image
              type={
                item.metaData.image.split('.')[
                item.metaData.image.split('.').length - 1
                ]
              }
              uri={imageUri}
              imageStyle={styles.listImage}
            />
            <View style={{
              padding: SIZE(10),
              backgroundColor: 'white',
              borderBottomRightRadius: SIZE(12),
              borderBottomLeftRadius: SIZE(12),
            }}>
              <Text>{item.metaData?.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* {chainType(item.newPrice?.mainChina || item.tokenId.split('-')[0])} */}
                <Text style={{ color: '#60c083', marginVertical: SIZE(10) }}>
                  {item.price}
                </Text>
              </View>
              {chainType(item.tokenId.split('-')[0])}
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  const memoizedValue = useMemo(() => renderItem, [NftDataCollectionReducer.nftDataCollectionList]);

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {NftDataCollectionReducer.nftDataCollectionPage === 1 && NftDataCollectionReducer.nftDataCollectionLoading ? (
        <Loader />
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
          scrollEnabled={!isModalVisible}
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
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
      {modalData && (
        <DetailModal
          index={modalData.index}
          data={modalData}
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

export default Collections;
