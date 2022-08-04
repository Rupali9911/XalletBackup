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
import {networkType} from "../../common/networkType";
import {nftDataCollectionLoadSuccess} from "../../store/actions/nftDataCollectionAction";
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
      let body_data = {
        approveStaus: 'approve',
        limit: 12,
        networkType: networkType,
        page: p,
        token: 'HubyJ*%qcqR0',
        type: 'hot'
      };
      let fetch_data_body = {
        method: 'POST',
        body: JSON.stringify(body_data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      fetch(`${BASE_URL}/xanaWallet/getDemuxData`, fetch_data_body)
          .then(response => response.json())
          .then(json => {
            console.log('json discover', json)
            if (json.data === "No record found") {
              setNoMore(true)
            } else {
              if (json.success) {
                let temp = json.data
                const selectedPack = json.data
                const nftData = [];
                for (let i = 0; i < selectedPack?.length; i++) {
                  if (selectedPack?.length > 0) {
                    nftData.push({
                      ...selectedPack[i],
                      en_nft_description: selectedPack[i]?.metaData?.description,
                      ja_nft_description: selectedPack[i]?.metaData?.description,
                      ko_nft_description: selectedPack[i]?.metaData?.description,
                      zh_nft_description: selectedPack[i]?.metaData?.description,
                      zh_ch_nft_description: selectedPack[i]?.metaData?.description,
                      en_nft_name: selectedPack[i]?.metaData?.name,
                      ja_nft_name: selectedPack[i]?.metaData?.name,
                      ko_nft_name: selectedPack[i]?.metaData?.name,
                      zh_nft_name: selectedPack[i]?.metaData?.name,
                      zh_ch_nft_name: selectedPack[i]?.metaData?.name
                    });
                  }
                }

                if (refresh) {
                  setDiscoverNFTList([...nftData])
                } else {
                  setDiscoverNFTList([...discoverNFTList, ...nftData])
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
      return <NftItem item={item}  />;}
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
    paddingTop: hp('8%'),
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
