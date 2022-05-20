import { Divider } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'src/styles/common.styles';
import { BASE_URL } from '../../common/constants';
import { Loader } from '../../components';
import AppSearch from '../../components/appSearch';
import { hp } from '../../constants/responsiveFunct';
import { colors } from '../../res';
import { getNFTList, nftListReset, nftLoadStart, pageChange } from '../../store/actions/nftTrendList';
import NftItem from './nftItems';
function ExploreScreen() {
  const { wallet, data } = useSelector(state => state.UserReducer);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [discoverNFTList, setDiscoverNFTList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isFetching, toggleFetching] = useState(false);
  const owner = wallet?.address || data?.user?._id;

  useEffect(() => {
    setLoader(true)
    loadNFTList(1, true)
  }, []);

  const loadNFTList = (p, refresh) => {
    let url = `${BASE_URL}/xanalia/discover?page=${p}&limit=10&owner=${owner}`;
    let fetch_data_body = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    fetch(url, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        console.log('json discover', json)
        if (json.data === "No record found") {
          setNoMore(true)
        } else {
          if (json.success) {
            if (refresh) {
              setDiscoverNFTList([...json.data])
            } else {
              setDiscoverNFTList([...discoverNFTList, ...json.data])
            }
            setCount(json.count)
          }
        }
        setLoader(false)
        toggleFetching(false)
        setFooterLoader(false)
      })
      .catch(err => {
        setLoader(false)
        setFooterLoader(false);
        toggleFetching(false)
        console.log(err, "error discover")
      });
  }

  const renderFooter = () => {
    if (!footerLoader) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    if (item && item.hasOwnProperty("metaData") && item.metaData) {
      return <NftItem item={item} />;
    }
  };

  const onRefresh = () => {
    toggleFetching(true);
    setPage(1)
    loadNFTList(1, true)
  }

  const memoizedValue = useMemo(() => renderItem, [discoverNFTList]);
  console.log(discoverNFTList, "discoverNFTList")

  const handleFlastListEndReached = () => {
    if (!noMore) {
      if (!footerLoader && discoverNFTList.length !== count) {
        setFooterLoader(true)
        let pageI = page + 1;
        setPage(pageI)
        loadNFTList(pageI)
      }
    }
  }
  const keyExtractor = (item, index) => { return 'item_' + index }

  return (
    <Container>
      <View style={{ flex: 1 }}>
        <View style={styles.listContainer}>
          {loader ? (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          ) : (
            <FlatList
              data={discoverNFTList}
              renderItem={memoizedValue}
              onRefresh={onRefresh}
              refreshing={isFetching}
              onEndReached={handleFlastListEndReached}
              ItemSeparatorComponent={() => <Divider />}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.1}
              keyExtractor={keyExtractor}
            />
          )}
        </View>
        <AppSearch />
      </View>
    </Container>
  );
}

export default ExploreScreen;

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: hp('6%'),
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
