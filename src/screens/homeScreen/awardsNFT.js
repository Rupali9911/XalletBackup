import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '../../components';
import { colors } from '../../res';
import { changeScreenName } from '../../store/actions/authAction';
import {
  awardsNftListReset,
  awardsNftLoadStart,
  awardsNftPageChange,
  getAwardsNftList,
} from '../../store/actions/awardsAction';
import { translate } from '../../walletUtils';
import styles from './styles';
import NFTItem from '../../components/NFTItem';

const AwardsNFT = () => {
  const { AwardsNFTReducer } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSort, setIsSort] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== sort)) {
      console.log("award nft")
      dispatch(awardsNftLoadStart());
      dispatch(awardsNftListReset());
      getNFTlist(1, null, sort);
      dispatch(awardsNftPageChange(1));
      setIsFirstRender(false)
      setIsSort(sort)
    }
  }, [sort, isFocused]);

  const getNFTlist = useCallback((page, limit, _sort) => {
    // console.log('__sort',_sort);
    dispatch(getAwardsNftList(page, limit, _sort));
  }, []);

  const handleRefresh = () => {
    dispatch(awardsNftListReset());
    getNFTlist(1, null, sort);
    dispatch(awardsNftPageChange(1));
  };

  const renderFooter = () => {
    if (!AwardsNFTReducer.awardsNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let findIndex = AwardsNFTReducer.awardsNftList.findIndex(
      x => x.id === item.id,
    );
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;

      return (
        <NFTItem
          item={item}
          image={imageUri}
          onPress={() => {
            dispatch(changeScreenName('awards'));
            navigation.push('DetailItem', { index: findIndex });
          }}
        />
      );
    }
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [AwardsNFTReducer.awardsNftList],
  );

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      {AwardsNFTReducer.awardsNftPage === 1 &&
        AwardsNFTReducer.awardsNftLoading ? (
        <Loader />
      ) : AwardsNFTReducer.awardsNftList.length !== 0 ? (
        <FlatList
          data={AwardsNFTReducer.awardsNftList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          onRefresh={() => {
            dispatch(awardsNftLoadStart());
            handleRefresh();
          }}
          refreshing={
            AwardsNFTReducer.awardsNftPage === 1 &&
            AwardsNFTReducer.awardsNftLoading
          }
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !AwardsNFTReducer.awardsNftLoading &&
              AwardsNFTReducer.awardsTotalCount !==
              AwardsNFTReducer.awardsNftList.length
            ) {
              let num = AwardsNFTReducer.awardsNftPage + 1;
              getNFTlist(num);
              dispatch(awardsNftPageChange(num));
            }
          }}
          onEndReachedThreshold={0.4}
          keyExtractor={(v, i) => 'item_' + i}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      )}
    </View>
  );
};

export default AwardsNFT;
