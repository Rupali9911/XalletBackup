import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {C_Image, DetailModal, Loader} from '../../components';
import {colors} from '../../res';
import {changeScreenName} from '../../store/actions/authAction';
import {
  favoriteNFTList,
  newNftListReset,
  newNftLoadStart,
  newPageChange,
} from '../../store/actions/newNFTActions';
import getLanguage from '../../utils/languageSupport';
import {translate} from '../../walletUtils';
import styles from './styles';

const langObj = getLanguage();

const Favorite = () => {
  const {NewNFTListReducer} = useSelector(state => state);
  const {sort} = useSelector(state => state.ListReducer);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(newNftLoadStart());
    dispatch(newNftListReset());
    getNFTlist(1, null, sort);
    dispatch(newPageChange(1));
  }, [sort]);

  const getNFTlist = useCallback((page, limit, _sort) => {
    // console.log('____sort',_sort);
    dispatch(favoriteNFTList(page, limit, _sort));
  }, []);

  const handleRefresh = () => {
    dispatch(newNftListReset());
    getNFTlist(1, null, sort);
    dispatch(newPageChange(1));
  };

  const renderItem = ({item}) => {
    let findIndex = NewNFTListReducer.favoriteNftList.findIndex(
      x => x.id === item.id,
    );
    if (item.metaData) {
      let imageUri =
        item.thumbnailUrl !== undefined || item.thumbnailUrl
          ? item.thumbnailUrl
          : item.metaData.image;

      return (
        <TouchableOpacity
          onLongPress={() => {
            setModalData(item);
            setModalVisible(true);
          }}
          onPress={() => {
            dispatch(changeScreenName('newNFT'));
            navigation.push('DetailItem', {index: findIndex});
          }}
          style={styles.listItem}>
          <C_Image
            type={
              item.metaData.image.split('.')[
                item.metaData.image.split('.').length - 1
              ]
            }
            uri={imageUri}
            imageStyle={styles.listImage}
          />
        </TouchableOpacity>
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
      {NewNFTListReducer.newListPage === 1 &&
      NewNFTListReducer.newNftListLoading ? (
        <Loader />
      ) : NewNFTListReducer.favoriteNftList.length !== 0 ? (
        <FlatList
          data={NewNFTListReducer.favoriteNftList}
          horizontal={false}
          numColumns={3}
          initialNumToRender={15}
          onRefresh={() => {
            dispatch(newNftLoadStart());
            handleRefresh();
          }}
          scrollEnabled={!isModalVisible}
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
      {modalData && (
        <DetailModal
          data={modalData}
          isModalVisible={isModalVisible}
          toggleModal={() => setModalVisible(false)}
        />
      )}
    </View>
  );
};

export default Favorite;
