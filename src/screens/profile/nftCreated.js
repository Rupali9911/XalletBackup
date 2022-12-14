import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {translate} from '../../walletUtils';
import {
  myNftCreatedListingReset,
  myNftCreatedPageChange,
  myNFTList,
  myNftLoadFail,
} from '../../store/actions/myNFTaction';
import styles from './styles';

const NFTCreated = props => {
  const {route, id, setChildScroll, scrollEnabled} = props;
  const isFocusedHistory = useIsFocused();

  // const { id } = route?.params;
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFirstRender, setIsFirstRender] = useState(true);

  let pageNum = 1;
  let limit = 10;
  let tab = 1;

  useEffect(() => {
    dispatch(myNftCreatedListingReset());
    if (isFocusedHistory) {
      if (!MyNFTReducer?.myNftCreatedList?.length) {
        pressToggle();
      } else {
        if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
          dispatch(myNftLoadFail());
        } else {
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
        profile={true}
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

  const memoizedValue = useMemo(
    () => renderItem,
    [MyNFTReducer.myNftCreatedList],
  );

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(pageNum, limit, id, tab);
  };

  const handlePullRefresh = () => {
    dispatch(myNftCreatedListingReset());
    pressToggle();
  };
  return (
    <View style={styles.trendCont}>
      {isFirstRender ? (
        isFirstRender
      ) : MyNFTReducer.myNftCreatedListPage === 1 &&
        MyNFTReducer.myNftListLoading ? (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      ) : MyNFTReducer?.myNftCreatedList?.length ? (
        <View>
          <FlatList
            key={1}
            // scrollEnabled={scrollEnabled}
            data={MyNFTReducer?.myNftCreatedList}
            horizontal={false}
            numColumns={2}
            initialNumToRender={15}
            nestedScrollEnabled={true}
            onRefresh={handlePullRefresh}
            refreshing={
              MyNFTReducer.myNftCreatedListPage === 1 &&
              MyNFTReducer.myNftListLoading
            }
            renderItem={memoizedValue}
            onEndReached={() => {
              if (
                !MyNFTReducer.myNftListLoading &&
                MyNFTReducer.myNftCreatedList.length !==
                  MyNFTReducer.myNftTotalCount
              ) {
                let num = MyNFTReducer.myNftCreatedListPage + 1;
                getNFTlist(num, limit, id, tab);
                dispatch(myNftCreatedPageChange(num));
              }
            }}
            onScrollBeginDrag={s => {
              // console.log(
              //   '🚀 ~ c ~ onScrollBeginDrag ~ ~',
              //   s?.nativeEvent?.contentOffset,
              // );
              // setChildScroll(s?.nativeEvent?.contentOffset?.y);
            }}
            onScroll={s => {
              // console.log(
              //   '🚀 ~ c ~ onScroll ~ ~',
              //   s?.nativeEvent?.contentOffset,
              // );
              // setChildScroll(s?.nativeEvent?.contentOffset?.y);
            }}
            onScrollEndDrag={s => {
              // console.log(
              //   '🚀 ~ c ~ onScrollEndDrag ~ ~',
              //   s?.nativeEvent?.contentOffset,
              // );
              // setChildScroll(s?.nativeEvent?.contentOffset?.y);
            }}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            keyExtractor={(v, i) => 'item_' + i}
          />
        </View>
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(NFTCreated);
