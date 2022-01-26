import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader, Loader } from '../../components';
import { colors } from '../../res';
import {
  awardsNftPageChange,
  getAwardsNftList,
} from '../../store/actions/awardsAction';
import {
  myCollectionList,
  myCollectionPageChange,
} from '../../store/actions/myCollection';
import { myNFTList, myPageChange } from '../../store/actions/myNFTaction';
import { newNFTList, newPageChange } from '../../store/actions/newNFTActions';
import { getNFTList, pageChange } from '../../store/actions/nftTrendList';
import NftItem from './nftItem';
import styles from './styles';

const DetailItemScreen = ({ route }) => {
  const {
    ListReducer,
    AuthReducer,
    NewNFTListReducer,
    MyNFTReducer,
    MyCollectionReducer,
    AwardsNFTReducer,
  } = useSelector(state => state);
  const { sort } = useSelector(state => state.ListReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [listIndex, setListIndex] = React.useState(route.params.index || 0);
  const [owner, setOwner] = React.useState(route.params.owner);
  const [stopVideos, setStopVideos] = React.useState(true);

  const getNFTlistData = React.useCallback(page => {
    AuthReducer.screenName == 'Hot'
      ? dispatch(getNFTList(page, 24, sort))
      : AuthReducer.screenName == 'newNFT'
        ? dispatch(newNFTList(page, null, owner))
        : AuthReducer.screenName == 'myNFT'
          ? dispatch(myNFTList(page, owner))
          : AuthReducer.screenName == 'myCollection'
            ? dispatch(myCollectionList(page, owner))
            : AuthReducer.screenName == 'awards'
              ? dispatch(getAwardsNftList(page, null, sort))
              : null;
  }, []);

  const getPage = React.useCallback(page => {
    AuthReducer.screenName == 'Hot'
      ? dispatch(pageChange(page))
      : AuthReducer.screenName == 'newNFT'
        ? dispatch(newPageChange(page))
        : AuthReducer.screenName == 'myNFT'
          ? dispatch(myPageChange(page))
          : AuthReducer.screenName == 'myCollection'
            ? dispatch(myCollectionPageChange(page))
            : AuthReducer.screenName == 'awards'
              ? dispatch(awardsNftPageChange(page))
              : null;
  });

  let loading =
    AuthReducer.screenName == 'Hot'
      ? ListReducer.nftListLoading
      : AuthReducer.screenName == 'newNFT'
        ? NewNFTListReducer.newNftListLoading
        : AuthReducer.screenName == 'myNFT'
          ? MyNFTReducer.myNftListLoading
          : AuthReducer.screenName == 'myCollection'
            ? MyCollectionReducer.myCollectionListLoading
            : AuthReducer.screenName == 'awards'
              ? AwardsNFTReducer.awardsNftLoading
              : false;

  let page =
    AuthReducer.screenName == 'Hot'
      ? ListReducer.page
      : AuthReducer.screenName == 'newNFT'
        ? NewNFTListReducer.newListPage
        : AuthReducer.screenName == 'myNFT'
          ? MyNFTReducer.myListPage
          : AuthReducer.screenName == 'myCollection'
            ? MyCollectionReducer.myCollectionPage
            : AuthReducer.screenName == 'awards'
              ? AwardsNFTReducer.awardsNftPage
              : 1;

  let totalCount =
    AuthReducer.screenName == 'Hot'
      ? ListReducer.totalCount
      : AuthReducer.screenName == 'newNFT'
        ? NewNFTListReducer.newTotalCount
        : AuthReducer.screenName == 'myNFT'
          ? MyNFTReducer.myNftTotalCount
          : AuthReducer.screenName == 'myCollection'
            ? MyCollectionReducer.myCollectionTotalCount
            : AuthReducer.screenName == 'awards'
              ? AwardsNFTReducer.awardsTotalCount
              : 1;

  const data =
    AuthReducer.screenName == 'Hot'
      ? ListReducer.nftList
      : AuthReducer.screenName == 'newNFT'
        ? NewNFTListReducer.newNftList
        : AuthReducer.screenName == 'myNFT'
          ? MyNFTReducer.myList
          : AuthReducer.screenName == 'myCollection'
            ? MyCollectionReducer.myCollection
            : AuthReducer.screenName == 'awards'
              ? AwardsNFTReducer.awardsNftList
              : [];

  console.log(data)

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item, index }) => {
    let findIndex = data.findIndex(x => x.id === item.id);
    if (item.metaData) {
      return <NftItem videoStatus={stopVideos} item={item} index={findIndex} />;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.modalCont}>
        <AppHeader
          showBackButton
          titleComponent={
            <View style={styles.headerTextView}>
              <Text style={styles.topHeaderText}>{'LALALA'}</Text>
              <Text style={styles.bottomHeaderText}>{'NFTs'}</Text>
            </View>
          }
        />
        {page === 1 && loading ? (
          <Loader />
        ) : (
          <FlatList
            initialNumToRender={5}
            data={data.slice(route.params.index)}
            renderItem={renderItem}
            onEndReached={() => {
              if (!loading && totalCount - route.params.index !== data.length) {
                let num =
                  AuthReducer.screenName == 'Hot'
                    ? ListReducer.page + 1
                    : AuthReducer.screenName == 'newNFT'
                      ? NewNFTListReducer.newListPage + 1
                      : AuthReducer.screenName == 'myNFT'
                        ? MyNFTReducer.myListPage + 1
                        : AuthReducer.screenName == 'myCollection'
                          ? MyCollectionReducer.myCollectionPage + 1
                          : AuthReducer.screenName == 'awards'
                            ? AwardsNFTReducer.awardsNftPage + 1
                            : null;
                getNFTlistData(num);
                getPage(num);
              }
            }}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            keyExtractor={(v, i) => 'item_' + i}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default DetailItemScreen;
