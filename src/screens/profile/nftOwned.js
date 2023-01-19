import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
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
  myNftOwnedPageChange,
} from '../../store/actions/myNFTaction';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTOwned = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let pageNum = 1;
  let limit = 10;
  let tab = 1;

  useEffect(() => {
    // dispatch(myNftOwnedListingReset());
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
    return (
      <View style={styles.sorryMessageCont}>
        <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
      </View>
    );
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

  const handlePullRefresh = () => {
    dispatch(myNftOwnedListingReset());
    pressToggle();
  };

  return (
    <View style={styles.trendCont}>
      {MyNFTReducer.myNftOwnedListLoading &&
      MyNFTReducer.myNftOwnedListPage == 1 ? (
        <Tabs.ScrollView>
          <View style={styles.sorryMessageCont}>
            <Loader />
          </View>
        </Tabs.ScrollView>
      ) : (
        <Tabs.FlatList
          key={2}
          data={MyNFTReducer?.myNftOwnedList}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(v, i) => 'item_' + i}
          initialNumToRender={10}
          onEndReached={() => {
            if (
              !MyNFTReducer.myNftOwnedListLoading &&
              MyNFTReducer.myNftOwnedList.length !=
                MyNFTReducer.myNftOwnedTotalCount
            ) {
              let num = MyNFTReducer.myNftOwnedListPage + 1;
              getNFTlist(num, 10, props.id, 1);
              dispatch(myNftOwnedPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          onRefresh={handlePullRefresh}
          refreshing={
            MyNFTReducer.myNftOwnedListPage === 1 &&
            MyNFTReducer.myNftOwnedListLoading
          }></Tabs.FlatList>
      )}
    </View>
  );
};

export default React.memo(NFTOwned);
