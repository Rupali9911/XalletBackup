import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {
  myNFTList,
  myNftListReset,
  myNftLoadFail,
  myNftOwnedListingReset,
  myNftOwnedPageChange,
} from '../../store/actions/myNFTaction';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTOwned = props => {
  const {route, id, setChildScroll, scrollEnabled} = props;
  const isFocusedHistory = useIsFocused();

  // const { id } = route?.params;
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFirstRender, setIsFirstRender] = useState(true);

  let pageNum = 1;
  let limit = 10;
  let tab = 2;

  useEffect(() => {
    dispatch(myNftOwnedListingReset());
    if (isFocusedHistory) {
      if (MyNFTReducer?.myNftOwnedList?.length === 0) {
        dispatch(myNftListReset());
        pressToggle();
      } else {
        if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
          dispatch(myNftLoadFail());
        } else {
          dispatch(myNftListReset());
          pressToggle();
        }
      }
      setIsFirstRender(false);
    }
  }, [isFocusedHistory, id]);

  const renderFooter = () => {
    if (!MyNFTReducer.myNftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({item}) => {
    return (
      <NFTItem
        screenName="movieNFT"
        item={item}
        // image={imageUri}
        onPress={() => {
          // dispatch(changeScreenName('movieNFT'));
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
      />
    );
  };

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(pageNum, limit, id, tab);
  };

  const handlePullRefresh = () => {
    dispatch(myNftOwnedListingReset());
    pressToggle();
  };

  return (
    <View style={styles.trendCont}>
      {isFirstRender ? (
        isFirstRender
      ) : MyNFTReducer.myNftOwnedListPage === 1 &&
        MyNFTReducer.myNftListLoading ? (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      ) : MyNFTReducer.myNftOwnedList?.length ? (
        <FlatList
          key={2}
          scrollEnabled={scrollEnabled}
          data={MyNFTReducer?.myNftOwnedList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          nestedScrollEnabled={true}
          onRefresh={handlePullRefresh}
          refreshing={
            MyNFTReducer.myNftOwnedListPage === 1 &&
            MyNFTReducer.myNftListLoading
          }
          renderItem={renderItem}
          onEndReached={() => {
            if (
              !MyNFTReducer.myNftListLoading &&
              MyNFTReducer.myNftOwnedList.length !==
                MyNFTReducer.myNftTotalCount
            ) {
              let num = MyNFTReducer.myNftOwnedListPage + 1;
              getNFTlist(num, limit, id, tab);
              dispatch(myNftOwnedPageChange(num));
            }
          }}
          onScrollBeginDrag={s => {
            setChildScroll(s?.nativeEvent?.contentOffset?.y);
          }}
          onScroll={s => {
            setChildScroll(s?.nativeEvent?.contentOffset?.y);
          }}
          onScrollEndDrag={s => {
            setChildScroll(s?.nativeEvent?.contentOffset?.y);
          }}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={1}
          keyExtractor={(v, i) => 'item_' + i}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(NFTOwned);
