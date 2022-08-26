import { Divider } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'src/styles/common.styles';
import { BASE_URL, NEW_BASE_URL } from '../../common/constants';
import { Loader } from '../../components';
import AppSearch from '../../components/appSearch';
import { hp } from '../../constants/responsiveFunct';
import { colors } from '../../res';
import { getNFTList, nftListReset, nftLoadStart, pageChange } from '../../store/actions/nftTrendList';
import DiscoverItem from './discoverItem';
import { networkType } from "../../common/networkType";
import { nftDataCollectionLoadSuccess } from "../../store/actions/nftDataCollectionAction";
import axios from 'axios';

function ExploreScreen() {
  const { wallet, userData } = useSelector(state => state.UserReducer);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [discoverNFTList, setDiscoverNFTList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [isFetching, toggleFetching] = useState(false);
  const owner = wallet?.address || userData?.user?.id;

  useEffect(() => {
    setLoader(true)
    loadNFTList(1, true)
    // discoverApi(1, true)
  }, []);

  const loadNFTList = (page, refresh) => {
    const userId = '3708'
    const url = `${NEW_BASE_URL}/nfts/nfts-discover?page=${page}&limit=12&userId=${userId}`
    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log("🚀 ~ file: index.js ~ line 45 ~ discoverApi ~ ", json)

        if (json?.data === "No record found") {
          setNoMore(true)
        } else {
          if (json?.list?.length > 0) {
            const selectedPack = json?.list
            if (refresh) {
              setDiscoverNFTList([...selectedPack])
            } else {
              setDiscoverNFTList([...discoverNFTList, ...selectedPack])
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
    return <DiscoverItem item={item} />;
  };

  const onRefresh = () => {
    toggleFetching(true);
    setPage(1)
    loadNFTList(1, true)
  }

  const memoizedValue = useMemo(() => renderItem, [discoverNFTList]);

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
  const itemSeparator = () => (<View style={{
    height: 10,
  }} />)

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
              ItemSeparatorComponent={itemSeparator}
              ListFooterComponent={renderFooter}
              keyExtractor={keyExtractor}
              initialNumToRender={10}
              horizontal={false}
              pagingEnabled={false}
              legacyImplementation={false}
              onEndReached={handleFlastListEndReached}
              onEndReachedThreshold={0.4}
              style={{ paddingHorizontal: 7 }}
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
    paddingTop: hp('8%'),
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
