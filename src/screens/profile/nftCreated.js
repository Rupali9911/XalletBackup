import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {
  myNftCreatedListingReset,
  myNFTList,
  myNftLoadFail,
} from '../../store/actions/myNFTaction';
import {setProfilePullToRefresh} from '../../store/reducer/userReducer';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTCreated = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [createdRefreshing, setCreatedRefreshing] = useState({
    refreshing: false,
    loader: false,
  });

  useEffect(() => {
    if (!MyNFTReducer?.myNftCreatedList?.length) {
      dispatch(myNftCreatedListingReset());
      pressToggle();
    } else {
      if (
        props.id &&
        props.id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()
      ) {
        dispatch(myNftLoadFail());
      } else {
        dispatch(myNftCreatedListingReset());
        pressToggle();
      }
    }
  }, [props.isFocused]);

  const getNFTlist = useCallback((pageIndex, pageSize, address, category, userId) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category, userId));
  }, []);

  const pressToggle = () => {
    getNFTlist(1, 10, props.id, 1, props.userId);
  };

  const renderFooter = () => {
    if (
      MyNFTReducer.myNftCreatedListLoading &&
      MyNFTReducer.myNftCreatedListPage > 1
    )
      return <ActivityIndicator size="small" color={colors.themeR} />;
    return null;
  };

  const renderEmptyComponent = () => {
    if (
      !createdRefreshing.refreshing &&
      MyNFTReducer.myNftCreatedListLoading &&
      MyNFTReducer.myNftCreatedListPage == 1
    ) {
      return (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      );
    } else if (createdRefreshing.loader) {
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
    setCreatedRefreshing({
      ...createdRefreshing,
      refreshing: true,
      loader: true,
    });
    dispatch(myNftCreatedListingReset());
    pressToggle();
    setTimeout(() => {
      setCreatedRefreshing({
        ...createdRefreshing,
        loader: false,
      });
    }, 1500);
  }, []);

  return (
    <View style={styles.trendCont}>
      <Tabs.FlatList
        key={1}
        data={MyNFTReducer?.myNftCreatedList}
        numColumns={2}
        keyExtractor={(v, i) => 'created_item' + i}
        initialNumToRender={10}
        renderItem={renderItem}
        onEndReached={() => {
          if (
            !MyNFTReducer.myNftCreatedListLoading &&
            MyNFTReducer.myNftCreatedList.length !==
              MyNFTReducer.myNftCreatedTotalCount
          ) {
            let num = MyNFTReducer.myNftCreatedListPage + 1;
            getNFTlist(num, 10, props.id, 1, props.userId);
          }
        }}
        onEndReachedThreshold={0.6}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftCreatedListPage === 1 &&
          MyNFTReducer.myNftCreatedListLoading &&
          createdRefreshing.refreshing
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyComponent}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export default React.memo(NFTCreated);
