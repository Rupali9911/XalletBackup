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
  awardsNftListReset,
  awardsNftLoadStart,
  awardsNftPageChange,
  getAwardsNftList,
} from '../../store/actions/awardsAction';
import {translate} from '../../walletUtils';
import styles from './styles';

const Awards = () => {
  const {AwardsNFTReducer,ListReducer} = useSelector(state => state);
  const {sort} = useSelector(state => state.ListReducer);
  const [modalData, setModalData] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(awardsNftLoadStart());
    dispatch(awardsNftListReset());
    getNFTlist(1,null,sort);
    dispatch(awardsNftPageChange(1));
  }, [sort]);

  const getNFTlist = useCallback((page, limit, _sort) => {
    console.log('__sort',_sort);
    dispatch(getAwardsNftList(page, limit, _sort));
  }, []);

  const handleRefresh = () => {
    dispatch(awardsNftListReset());
    getNFTlist(1);
    dispatch(awardsNftPageChange(1));
  };

  const renderFooter = () => {
    if (!AwardsNFTReducer.awardsNftLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({item}) => {
    let findIndex = AwardsNFTReducer.awardsNftList.findIndex(
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
            dispatch(changeScreenName('awards'));
            navigation.navigate('DetailItem', {index: findIndex});
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
          numColumns={3}
          initialNumToRender={15}
          onRefresh={() => {
            dispatch(awardsNftLoadStart());
            handleRefresh();
          }}
          scrollEnabled={!isModalVisible}
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

export default Awards;
