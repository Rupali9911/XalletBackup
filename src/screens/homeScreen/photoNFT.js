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
  favoriteNFTList,
  newNftListReset,
  newNftLoadStart,
  newPageChange,
} from '../../store/actions/newNFTActions';
import { translate } from '../../walletUtils';
import NFTItem from '../../components/NFTItem';
import styles from './styles';


const PhotoNFT = () => {
  const { NewNFTListReducer } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);
  const [isFirstRender, setIsFirstRender] = useState(true)
  const [isSort, setIsSort] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && (isFirstRender || isSort !== sort)) {
      console.log("PhotoNFT")
      dispatch(newNftLoadStart());
      dispatch(newNftListReset('photo'));
      getNFTlist(1, null, sort);
      setIsFirstRender(false)
      dispatch(newPageChange(1));
      setIsSort(sort)
    }
  }, [sort, isFocused]);

  const getNFTlist = useCallback((page, limit, _sort) => {
    dispatch(favoriteNFTList(page, limit, _sort));
  }, []);

  const handleRefresh = () => {
    dispatch(newNftListReset());
    getNFTlist(1, null, sort);
    dispatch(newPageChange(1));
  };

  const renderItem = ({ item }) => {
    let findIndex = NewNFTListReducer.favoriteNftList.findIndex(
      x => x.id === item.id,
    );
    if (item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;
      return (
        <NFTItem
          item={item}
          image={imageUri}
          onPress={() => {
            dispatch(changeScreenName('photoNFT'));
            navigation.push('DetailItem', { index: findIndex });
          }}
        />
      );
    }
  };

  const renderFooter = () => {
    if (!NewNFTListReducer.newNftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const memoizedValue = useMemo(
    () => renderItem,
    [NewNFTListReducer.favoriteNftList],
  );

  return (
    <View style={styles.trendCont}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      { isFirstRender ? isFirstRender : NewNFTListReducer.newListPage === 1 &&
        NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.favoriteNftList.length !== 0 ? (
        <FlatList
          data={NewNFTListReducer.favoriteNftList}
          horizontal={false}
          numColumns={2}
          initialNumToRender={14}
          onRefresh={() => {
            dispatch(newNftLoadStart());
            handleRefresh();
          }}
          refreshing={
            NewNFTListReducer.newListPage === 1 &&
            NewNFTListReducer.newNftListLoading
          }
          renderItem={memoizedValue}
          onEndReached={() => {
            if (
              !NewNFTListReducer.newNftListLoading &&
              NewNFTListReducer.newTotalCount !==
              NewNFTListReducer.favoriteNftList.length
            ) {
              let num = NewNFTListReducer.newListPage + 1;
              getNFTlist(num);
              dispatch(newPageChange(num));
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

export default PhotoNFT;
