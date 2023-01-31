import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {FlatList, StatusBar, Text, View, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import {colors} from '../../res';
import {
  getLaunchpadNftList,
  launchpadNftListReset,
  launchpadNftLoadStart,
  launchpadNftPageChange,
} from '../../store/actions/launchpadAction';
import {translate} from '../../walletUtils';
import LaunchPadItemData from '../LaunchPadDetail/LaunchPadItemData';
import styles from './styles';
import {CORPORATE_COLLAB_URL, CORPORATE_NAME} from '../../common/constants';

const LaunchPad = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // =============== Getting data from reducer ========================
  const {LaunchpadReducer} = useSelector(state => state);

  const isLoading = LaunchpadReducer.launchpadLoading;
  const launchData = LaunchpadReducer.launchpadList;
  const page = LaunchpadReducer.launchpadPage;
  const totalCount = LaunchpadReducer.launchpadTotalCount;

  const getLaunchpadNft = useCallback((page, limit) => {
    dispatch(getLaunchpadNftList(page, limit));
  }, []);

  useEffect(() => {
    getLaunchpadNft(page, totalCount);
  }, []);

  //=================== Flatlist Functions ====================
  const handleFlatlistRefresh = () => {
    dispatch(launchpadNftLoadStart());
    handleRefresh();
  };

  const handleRefresh = () => {
    dispatch(launchpadNftListReset());
    getLaunchpadNft(page, totalCount);
    dispatch(launchpadNftPageChange(1));
  };

  // ===================== Render No NFT Function ===================================
  const renderNoNFT = () => {
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>
          {translate('common.noDataFound')}
        </Text>
      </View>
    );
  };

  //=====================(Render Flatlist Item Function)=============================
  const renderItem = ({item}) => {
    let bannerImage = item?.bannerImage
      ? item.bannerImage
      : item?.thumbCollectionImage;
    return (
      <LaunchPadItemData
        bannerImage={bannerImage}
        chainType={item?.chainType || 'polygon'}
        items={item?.items}
        iconImage={item?.iconImage}
        collectionName={item?.name}
        creator={item?.owner.name}
        network={item?.networks}
        count={item?.totalNft}
        status={item?.status}
        creatorInfo={item?.owner.description}
        blind={item?.blind}
        collectionId={item?._id}
        // disabled={item.totalNft === 0}
        onPress={() => {
          item?.description === CORPORATE_NAME && item?.id === 1
            ? Linking.openURL(CORPORATE_COLLAB_URL)
            : item?.description === CORPORATE_NAME && item?.id === 3
            ? Linking.openURL(CORPORATE_COLLAB_URL)
            : navigation.push('CollectionDetail', {
                networkName: null,
                contractAddress: null,
                launchpadId: item?.id,
                isLaunchPad: true,
              });
        }}
      />
    );
  };

  //=====================(Main return Function)=============================
  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {isLoading ? (
        <Loader />
      ) : launchData.length ? (
        <FlatList
          data={launchData}
          horizontal={false}
          numColumns={2}
          renderItem={launchData.length !== 0 ? renderItem : renderNoNFT()}
          keyExtractor={(v, i) => 'item_' + i}
          pagingEnabled={false}
          legacyImplementation={false}
          onRefresh={handleFlatlistRefresh}
          refreshing={
            LaunchpadReducer.launchpadPage === 1 &&
            LaunchpadReducer.launchpadLoading
          }
        />
      ) : (
        renderNoNFT()
      )}
    </View>
  );
};

export default React.memo(LaunchPad);
