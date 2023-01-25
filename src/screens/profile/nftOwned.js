import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {
  myNFTList,
  myNftLoadFail,
  myNftOwnedListingReset,
} from '../../store/actions/myNFTaction';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTOwned = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [ownedRefreshing, setOwnedRefreshing] = useState(false);

  useEffect(() => {
    if (props.isFocused) {
      if (!MyNFTReducer?.myNftOwnedList?.length) {
        pressToggle();
      } else if (
        props.id &&
        props.id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()
      ) {
        dispatch(myNftLoadFail());
      }
    }
  }, []);

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(1, 10, props.id, 2);
  };

  const renderFooter = () => {
    if (
      MyNFTReducer.myNftOwnedListLoading &&
      MyNFTReducer.myNftOwnedListPage > 1
    )
      return <ActivityIndicator size="small" color={colors.themeR} />;
    return null;
  };

  const renderEmptyComponent = () => {
    if (
      !ownedRefreshing &&
      MyNFTReducer.myNftOwnedListLoading &&
      MyNFTReducer.myNftOwnedListPage == 1
    ) {
      return (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      );
    } else if (ownedRefreshing) {
      return <View style={styles.sorryMessageCont} />;
    } else {
      return (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      );
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <NFTItem
        screenName="movieNFT"
        item={item}
        profile={true}
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

  const handlePullRefresh = useCallback(() => {
    setOwnedRefreshing(true);
    dispatch(myNftOwnedListingReset());
    pressToggle();
  }, []);

  return (
    <View style={styles.trendCont}>
      <Tabs.FlatList
        key={2}
        data={MyNFTReducer?.myNftOwnedList}
        numColumns={2}
        keyExtractor={(v, i) => 'owned_item' + i}
        initialNumToRender={10}
        renderItem={renderItem}
        onEndReached={() => {
          if (
            !MyNFTReducer.myNftOwnedListLoading &&
            MyNFTReducer.myNftOwnedList.length !==
              MyNFTReducer.myNftOwnedTotalCount
          ) {
            let num = MyNFTReducer.myNftOwnedListPage + 1;
            getNFTlist(num, 10, props.id, 2);
          }
        }}
        onEndReachedThreshold={0.01}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftOwnedListPage === 1 &&
          MyNFTReducer.myNftOwnedListLoading
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default React.memo(NFTOwned);
