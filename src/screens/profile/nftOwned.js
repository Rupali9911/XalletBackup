import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors, fonts} from '../../res';
import {changeScreenName} from '../../store/actions/authAction';
import {translate} from '../../walletUtils';
import {
  myNftListReset,
  myNFTList,
  myNftLoadStart,
  myPageChange,
  myNftOwnedPageChange,
  myNftLoadFail,
  myNftOwnedListingReset,
} from '../../store/actions/myNFTaction';
// import { myCollectionList, myCollectionLoadFail, myCollectionPageChange, myCollectionListReset } from '../../store/actions/myCollection';

const NFTOwned = ({route, navigation, id}) => {
  const isFocusedHistory = useIsFocused();

  // const { id } = route?.params;
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
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
    console.log('getNFTlist, id', id);
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
      {/* { isFocusedHistory &&console.log("🚀 ~ file: nftOwned.js ~ line 85 ~ NFTOwned ~ MyCollectionReducer", MyCollectionReducer)} */}
      {isFirstRender ? (
        isFirstRender
      ) : MyNFTReducer.myNftOwnedListPage === 1 &&
        MyNFTReducer.myNftListLoading ? (
        <Loader />
      ) : MyNFTReducer.myNftOwnedList?.length ? (
        <FlatList
          key={2}
          data={MyNFTReducer?.myNftOwnedList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
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

const styles = StyleSheet.create({
  sorryMessageCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    fontFamily: fonts.SegoeUIRegular,
  },
  trendCont: {
    backgroundColor: 'white',
    flex: 1,
  },
  leftToggle: {
    width: '30%',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightToggle: {
    width: '30%',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  saveBtnGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default React.memo(NFTOwned);
