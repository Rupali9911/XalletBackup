import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'src/styles/common.styles';
import { Loader } from '../../components';
import AppSearch from '../../components/appSearch';
import { hp } from '../../constants/responsiveFunct';
import { BASE_URL } from '../../helpers/ApiRequest';
import { colors } from '../../res';
import { getNFTList, nftListReset, nftLoadStart, pageChange } from '../../store/actions/nftTrendList';
import NftItem from '../detailScreen/nftItem';

function ExploreScreen() {
  const { ListReducer } = useSelector(state => state);
  const [nftIndex, setNftIndex] = useState(2);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [discoverNFTList, setDiscoverNFTList] = useState([]);
  const [isFirsRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // let url = `${BASE_URL}/xanalia/discover?page=${page}&limit=18`;
    let url = "https://testapi.xanalia.com/xanalia/discover?page=1&limit=18";
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
        if(json.success){
          setDiscoverNFTList(json.data)
          setCount(json.count)
        }
      })
      .catch(err => {
        console.log(err, "error discover")
      });
    // if (ListReducer?.nftList?.length == 0 && isFirsRender) {
    //   dispatch(nftLoadStart());
    //   dispatch(nftListReset('hot'));
    //   getNFTlistData(1);
    //   dispatch(pageChange(1));
    //   setIsFirstRender(false)
    // } else {
    //   setIsFirstRender(false)
    // }
  }, [ListReducer?.nftList]);

  const dispatch = useDispatch();

  const getNFTlistData = React.useCallback(page => {
    dispatch(getNFTList(page));
  }, []);

  // const handlePageChange = page => {
  //   dispatch(pageChange(page));
  // };

  const renderFooter = () => {
    if (!ListReducer.nftListLoading) return null;
    return <ActivityIndicator size="small" color={colors.themeR} />;
  };

  const renderItem = ({ item }) => {
    let findIndex = ListReducer.nftList.findIndex(x => x.id === item.id);
    if (item.metaData) {
      return <NftItem item={item} index={findIndex} minHeight={true} />;
    }
  };

  const memoizedValue = useMemo(() => renderItem, [ListReducer.nftList]);
  console.log(ListReducer?.nftList, "ListReducer?.nftList")
  return (
    <Container>
      <View style={{ flex: 1 }}>
        <View style={styles.listContainer}>
          {/* {isFirsRender ? isFirsRender : ListReducer.page === 1 && ListReducer.nftListLoading ? (
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
          ) : (
            <FlatList
              data={ListReducer?.nftList?.slice(0, nftIndex)}
              renderItem={memoizedValue}
              onEndReached={() => {
                let tempIndex = nftIndex + 2;
                setNftIndex(tempIndex)

                if (ListReducer?.nftList?.length == tempIndex && !ListReducer.nftListLoading) {
                  let num = ListReducer.page + 1;
                  getNFTlistData(num);
                  handlePageChange(num);
                }
              }}
              ListFooterComponent={renderFooter}
              onEndReachedThreshold={0.1}
              keyExtractor={(v, i) => 'item_' + i}
            />
          )} */}
          {
            discoverNFTList.length !== 0 &&
            <FlatList
                data={discoverNFTList}
                renderItem={memoizedValue}
                onEndReached={() => {
                  // let tempIndex = nftIndex + 2;
                  // setNftIndex(tempIndex)
  
                  // if (ListReducer?.nftList?.length == tempIndex && !ListReducer.nftListLoading) {
                  //   let num = ListReducer.page + 1;
                  //   getNFTlistData(num);
                  //   handlePageChange(num);
                  // }
                }}
                ListFooterComponent={renderFooter}
                onEndReachedThreshold={0.1}
                keyExtractor={(v, i) => 'item_' + i}
              />
          }
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
