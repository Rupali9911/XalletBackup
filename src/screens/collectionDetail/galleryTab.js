import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import NFTItem from '../../components/NFTItem';
import { colors } from '../../res';
import {
  nftDataCollectionList,
  nftDataCollectionListReset,
  nftDataCollectionLoadStart,
  nftDataCollectionPageChange,
  nftDataGalarryCollectionPageChange
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';

const { height } = Dimensions.get('window');

const GalleryTab = (props) => {
  const { tabTitle, collection, tabStatus, isLaunchPad } = props;

  const { NftDataCollectionReducer } = useSelector(state => state);
  const { userData } = useSelector(state => state.UserReducer);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isDetailScreen, setDetailScreen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const isLoading = NftDataCollectionReducer.nftDataCollectionLoading;
  const collectionList = NftDataCollectionReducer.nftDataGalleryCollectionList;
  const page = NftDataCollectionReducer.nftDataGalleryCollectionPage;
  const totalCount = NftDataCollectionReducer.nftDataCollectionTotalCount;
  const reducerTabTitle = NftDataCollectionReducer.tabTitle;

  useEffect(() => {
    if (isFocused && !isDetailScreen && isFirstRender) {
      dispatch(nftDataCollectionLoadStart(tabTitle));
      dispatch(nftDataCollectionListReset());
      getNFTlist(1);
      setIsFirstRender(false);
      dispatch(nftDataGalarryCollectionPageChange(1));
    } else {
      isFocused && setDetailScreen(false);
    }
  }, [isFocused]);

  const getNFTlist = useCallback(page => {
    if (isLaunchPad) {
      dispatch(
        nftDataCollectionList(
          page,
          tabTitle,
          null,
          null,
          isLaunchPad,
          null,
          null,
          null,
          collection?.id,
        ),
      );
    } else {
      dispatch(
        nftDataCollectionList(
          page,
          tabTitle,
          collection?.network?.networkName,
          collection?.contractAddress,
          isLaunchPad,
          tabStatus,
          userData?.id,
          null,
          null,
        ),
      );
    }
  }, []);

  const refreshFunc = () => {
    dispatch(nftDataCollectionLoadStart());
    dispatch(nftDataCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataGalarryCollectionPageChange(1));
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let imageUri = item?.mediaUrl;
    return (
      <NFTItem
        item={item}
        screenName="soldOut"
        image={imageUri}
        onPress={() => {
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
      />
    );
  };

  const memoizedValue = useMemo(() => renderItem, [collectionList]);

  const handleFlatlistRefresh = () => {
    dispatch(nftDataCollectionLoadStart());
    refreshFunc();
  };

  const keyExtractor = (item, index) => {
    return 'item_' + index;
  };

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender || (page === 1 && isLoading) ? (
        <View style={{ marginTop: height / 8 }}>
          <Loader />
        </View>
      ) : collectionList.length !== 0 ? (
        <FlatList
          data={collectionList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={6}
          nestedScrollEnabled={true}
          onRefresh={handleFlatlistRefresh}
          refreshing={page === 1 && isLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            if (!isLoading && collectionList.length !== totalCount) {
              let num = page + 1;
              dispatch(nftDataCollectionLoadStart(tabTitle));
              getNFTlist(num);
              dispatch(nftDataGalarryCollectionPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={keyExtractor}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>
              {translate('common.noNFTsFound')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(GalleryTab);
