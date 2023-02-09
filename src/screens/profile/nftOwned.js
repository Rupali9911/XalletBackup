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
import {setProfilePullToRefresh} from '../../store/reducer/userReducer';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTOwned = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [ownedRefreshing, setOwnedRefreshing] = useState({
    refreshing: false,
    loader: false,
  });

  useEffect(() => {
    if (!MyNFTReducer?.myNftOwnedList?.length) {
      dispatch(myNftOwnedListingReset());
      pressToggle();
    } else {
      if (
        props.id &&
        props.id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()
      ) {
        dispatch(myNftLoadFail());
      } else {
        dispatch(myNftOwnedListingReset());
        pressToggle();
      }
    }
  }, [props.isFocused]);

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
      !ownedRefreshing.refreshing &&
      MyNFTReducer.myNftOwnedListLoading &&
      MyNFTReducer.myNftOwnedListPage == 1
    ) {
      return (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      );
    } else if (ownedRefreshing.loader) {
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
    dispatch(setProfilePullToRefresh());
    setOwnedRefreshing({
      ...ownedRefreshing,
      refreshing: true,
      loader: true,
    });
    dispatch(myNftOwnedListingReset());
    pressToggle();
    setTimeout(() => {
      setOwnedRefreshing({
        ...ownedRefreshing,
        loader: false,
      });
    }, 1500);
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
        onEndReachedThreshold={0.6}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftOwnedListPage === 1 &&
          MyNFTReducer.myNftOwnedListLoading &&
          ownedRefreshing.refreshing
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default React.memo(NFTOwned);
