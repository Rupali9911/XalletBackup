import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {Container} from 'src/styles/common.styles';
import {NEW_BASE_URL} from '../../common/constants';
import {Loader} from '../../components';
import AppSearch from '../../components/appSearch';
import {SIZE} from '../../constants';
import {hp} from '../../constants/responsiveFunct';
import sendRequest from '../../helpers/AxiosApiRequest';
import {colors} from '../../res';
import DiscoverItem from './discoverItem';

const ExploreScreen = () => {
  console.log('@@@ Discover screen (Tab) =======>');
  const isFocused = useIsFocused();

  //=================== Getting data from reducer ======================
  const {userData} = useSelector(state => state.UserReducer);

  //=================== Component Level State ======================
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [discoverNFTList, setDiscoverNFTList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isFetching, toggleFetching] = useState(false);

  //=================== useEffect (API call) ======================
  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      loadNFTList(1, true);
    }
  }, []);

  //=================== Discover API call function ======================
  const loadNFTList = (page, refresh) => {
    const url = `${NEW_BASE_URL}/nfts/nfts-discover`;
    sendRequest({
      url,
      params: {
        page,
        limit: 12,
        userId: userData?.id,
      },
    })
      .then(json => {
        if (json?.data === 'No record found') {
          setNoMore(true);
        } else {
          if (json?.list?.length > 0) {
            const selectedPack = json?.list;
            if (refresh) {
              setDiscoverNFTList([...selectedPack]);
            } else {
              setDiscoverNFTList([...discoverNFTList, ...selectedPack]);
            }
            setCount(json.count);
          }
        }
        setLoader(false);
        toggleFetching(false);
        setFooterLoader(false);
      })
      .catch(err => {
        setLoader(false);
        setFooterLoader(false);
        toggleFetching(false);
        console.log(err, 'error discover');
      });
  };

  //=================== Flatlist Footer Component (Activity Indicator) ======================
  const renderFooter = () => {
    if (!footerLoader) return null;
    return (
      <ActivityIndicator
        size="small"
        color={colors.themeR}
        style={{paddingBottom: SIZE(5)}}
      />
    );
  };

  //=================== Flatlist Render Component ======================
  const renderItem = ({item}) => {
    return <DiscoverItem item={item} />;
  };

  const memoizedValue = useMemo(() => renderItem, [discoverNFTList]);

  //=================== Flatlist Refresh & Pagination ======================
  const onRefresh = () => {
    toggleFetching(true);
    setPage(1);
    loadNFTList(1, true);
  };

  const handleFlastListEndReached = () => {
    if (!noMore) {
      if (!footerLoader && discoverNFTList.length !== count) {
        setFooterLoader(true);
        let pageI = page + 1;
        setPage(pageI);
        loadNFTList(pageI);
      }
    }
  };

  const keyExtractor = (item, index) => {
    return 'item_' + index;
  };

  const itemSeparator = () => (
    <View
      style={{
        height: 10,
      }}
    />
  );

  return (
    <Container>
      <View style={{flex: 1}}>
        <View style={styles.listContainer}>
          {loader ? (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          ) : (
            <FlatList
              data={discoverNFTList}
              renderItem={memoizedValue}
              keyExtractor={keyExtractor}
              initialNumToRender={10}
              refreshing={isFetching}
              onRefresh={onRefresh}
              horizontal={false}
              pagingEnabled={false}
              removeClippedSubviews={true}
              legacyImplementation={false}
              onEndReached={handleFlastListEndReached}
              onEndReachedThreshold={0.4}
              ItemSeparatorComponent={itemSeparator}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>
        <AppSearch />
      </View>
    </Container>
  );
};

export default React.memo(ExploreScreen);

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: hp('8%'),
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
