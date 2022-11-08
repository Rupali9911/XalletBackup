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
  nftDataOnSaleCollectionListReset,
  nftDataCollectionLoadStart,
  nftDataCollectionPageChange,
  nftDataOnSaleCollectionPageChange
} from '../../store/actions/nftDataCollectionAction';
import { translate } from '../../walletUtils';
import styles from './styles';

const { height } = Dimensions.get('window');

const OnSaleTab = (props) => {
  const { collection, tabTitle, tabStatus, isLaunchPad } = props;

  const { NftDataCollectionReducer } = useSelector(state => state);
  const { userData } = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isDetailScreen, setDetailScreen] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const isLoading = NftDataCollectionReducer.nftDataCollectionLoading;
  const collectionList = NftDataCollectionReducer.nftDataOnSaleCollectionList;
  const page = NftDataCollectionReducer.nftDataOnSaleCollectionPage;
  const totalCount = NftDataCollectionReducer.nftDataOnSaleCollectionTotalCount;
  const reducerTabTitle = NftDataCollectionReducer.tabTitle;

  useEffect(() => {
    if (isFocused && !isDetailScreen && isFirstRender) {
      dispatch(nftDataCollectionLoadStart(tabTitle));
      dispatch(nftDataCollectionListReset());
      dispatch(nftDataOnSaleCollectionListReset());
      getNFTlist(1);
      setIsFirstRender(false);
      dispatch(nftDataOnSaleCollectionPageChange(1));
    } else {
      isFocused && setDetailScreen(false);
    }
  }, [isFocused]);

  const getNFTlist = useCallback(page => {
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
        false,
      ),
    );
  }, []);

  const refreshFunc = () => {
    dispatch(nftDataCollectionListReset());
    dispatch(nftDataOnSaleCollectionListReset());
    getNFTlist(1);
    dispatch(nftDataOnSaleCollectionPageChange(1));
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
        screenName="gallery"
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
    // console.log("@@@ On sale tab refresh function =====>", page === 1 && isLoading)
    dispatch(nftDataCollectionLoadStart());
    refreshFunc();
  };

  const keyExtractor = (item, index) => {
    return 'item_' + index;
  };

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {isFirstRender ? (
        isFirstRender
      ) : (page === 1 && isLoading) ? (
        <View style={{ marginTop: height / 8 }}>
          <Loader />
        </View>
      ) : collectionList.length !== 0 ? (
        <FlatList
          data={collectionList}
          nestedScrollEnabled={true}
          horizontal={false}
          numColumns={2}
          initialNumToRender={6}
          onRefresh={handleFlatlistRefresh}
          refreshing={page === 1 && isLoading}
          renderItem={memoizedValue}
          onEndReached={() => {
            // console.log("@@@ On sale tab onEndReached ======>", isLoading, collectionList.length, totalCount)
            if (!isLoading && collectionList.length !== totalCount) {
              let num = page + 1;

              dispatch(nftDataCollectionLoadStart(tabTitle));
              getNFTlist(num);
              dispatch(nftDataOnSaleCollectionPageChange(num));
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

export default React.memo(OnSaleTab);
