import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {
  myNftCreatedListingReset,
  myNftCreatedPageChange,
  myNFTList,
  myNftLoadFail,
} from '../../store/actions/myNFTaction';
import {translate} from '../../walletUtils';
import styles from './styles';

const NFTCreated = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // dispatch(myNftCreatedListingReset());
    if (props.isFocused) {
      if (!MyNFTReducer?.myNftCreatedList?.length) {
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
    getNFTlist(1, 10, props.id, 1);
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
    dispatch(myNftCreatedListingReset());
    getNFTlist(1, 10, props.id, 1);
  };

  return (
    <View style={styles.trendCont}>
      {MyNFTReducer.myNftCreatedListLoading &&
      MyNFTReducer.myNftCreatedListPage == 1 ? (
        <Tabs.ScrollView>
          <View style={styles.sorryMessageCont}>
            <Loader />
          </View>
        </Tabs.ScrollView>
      ) : (
        <Tabs.FlatList
          key={1}
          data={MyNFTReducer?.myNftCreatedList}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(v, i) => 'item_' + i}
          initialNumToRender={10}
          onEndReached={() => {
            if (
              !MyNFTReducer.myNftCreatedListLoading &&
              MyNFTReducer.myNftCreatedList.length !=
                MyNFTReducer.myNftCreatedTotalCount
            ) {
              let num = MyNFTReducer.myNftCreatedListPage + 1;
              getNFTlist(num, 10, props.id, 1);
              dispatch(myNftCreatedPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          onRefresh={handlePullRefresh}
          refreshing={
            MyNFTReducer.myNftCreatedListPage === 1 &&
            MyNFTReducer.myNftCreatedListLoading
          }></Tabs.FlatList>
      )}
    </View>
  );
};

export default React.memo(NFTCreated);
