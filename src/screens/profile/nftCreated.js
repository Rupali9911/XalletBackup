import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {translate} from '../../walletUtils';
import {
  myNftCreatedListingReset,
  myNftCreatedPageChange,
  myNFTList,
  myNftLoadFail,
} from '../../store/actions/myNFTaction';
import styles from './styles';
import {Tabs} from 'react-native-collapsible-tab-view';
import AppBackground from '../../components/appBackground';

const NFTCreated = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  let pageNum = 1;
  let limit = 10;
  let tab = 1;

  const id = '0x3cc51779881e3723d5aa23a2adf0b215124a177d';

  // console.log('IDDDD : ', id);

  useEffect(() => {
    // dispatch(myNftCreatedListingReset());
    if (props.isFocused) {
      if (!MyNFTReducer?.myNftCreatedList?.length) {
        pressToggle();
      } else if (
        props.id &&
        props.id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()
      ) {
        dispatch(myNftLoadFail());
      }
    }
  }, []);

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(1, 10, props.id, 1);
  };

  const renderFooter = () => {
    if (
      MyNFTReducer.myNftCreatedListLoading &&
      MyNFTReducer.myNftCreatedListPage > 1
    )
      return <ActivityIndicator size="small" color={colors.themeR} />;
    return null;
  };

  const renderItem = ({item, index}) => {
    return (
      // <View style={styles.trendCont}>
      //   {MyNFTReducer.myNftCreatedListLoading &&
      //   MyNFTReducer.myNftCreatedListPage == 1 ? (
      //     <View style={styles.sorryMessageCont}>
      //       <Loader />
      //     </View>
      //   ) : MyNFTReducer.myNftCreatedList.length ? (
      //     <NFTItem
      //       screenName="movieNFT"
      //       item={item}
      //       // image={imageUri}
      //       profile={true}
      //       onPress={() => {
      //         // dispatch(changeScreenName('movieNFT'));
      //         navigation.push('CertificateDetail', {
      //           networkName: item?.network?.networkName,
      //           collectionAddress: item?.collection?.address,
      //           nftTokenId: item?.tokenId,
      //         });
      //       }}
      //     />
      //   ) : (
      //     <View style={styles.sorryMessageCont}>
      //       <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
      //     </View>
      //   )}
      // </View>

      <NFTItem
        screenName="movieNFT"
        item={item}
        profile={true}
        onPress={() => {
          navigation.push('CertificateDetail', {
            networkName: item?.network?.networkName,
            collectionAddress: item?.collection?.address,
            nftTokenId: item?.tokenId,
          });
        }}
      />
    );
  };

  const handlePullRefresh = () => {
    dispatch(myNftCreatedListingReset());
    getNFTlist(1, 10, props.id, 1);
  };

  return (
    <View style={styles.trendCont}>
      {isFirstRender ? (
        isFirstRender
      ) : MyNFTReducer.myNftCreatedListPage === 1 &&
        MyNFTReducer.myNftListLoading ? (
        <View style={styles.sorryMessageCont}>
          <Loader />
        </View>
      ) : MyNFTReducer?.myNftCreatedList?.length ? (
        <View>
          <Tabs.FlatList
            key={1}
            // scrollEnabled={scrollEnabled}
            data={MyNFTReducer?.myNftCreatedList}
            horizontal={false}
            // numColumns={2}
            initialNumToRender={15}
            // nestedScrollEnabled={true}
            onRefresh={handlePullRefresh}
            refreshing={
              MyNFTReducer.myNftCreatedListPage === 1 &&
              MyNFTReducer.myNftListLoading
            }
            renderItem={memoizedValue}
            onEndReached={() => {
              if (
                !MyNFTReducer.myNftListLoading &&
                MyNFTReducer.myNftCreatedList.length !==
                  MyNFTReducer.myNftTotalCount
              ) {
                let num = MyNFTReducer.myNftCreatedListPage + 1;
                getNFTlist(num, limit, id, tab);
                dispatch(myNftCreatedPageChange(num));
              }
            }}
            // onScrollBeginDrag={s => {
            //   // console.log(
            //   //   '🚀 ~ ~ onScrollBeginDrag ~ ~',
            //   //   s?.nativeEvent?.contentOffset,
            //   // );
            //   setChildScroll(s?.nativeEvent?.contentOffset?.y);
            // }}
            // onScroll={s => {
            //   // console.log(
            //   //   '🚀 ~ c ~ onScroll ~ ~',
            //   //   s?.nativeEvent?.contentOffset,
            //   // );
            //   setChildScroll(s?.nativeEvent?.contentOffset?.y);
            // }}
            // onScrollEndDrag={s => {
            //   // console.log(
            //   //   '🚀 ~ ~ onScrollEndDrag ~ ~',
            //   //   s?.nativeEvent?.contentOffset,
            //   // );
            //   setChildScroll(s?.nativeEvent?.contentOffset?.y);
            // }}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.4}
            keyExtractor={(v, i) => 'item_' + i}
          />
        </View>
      ) : (
        <Tabs.ScrollView>
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        </Tabs.ScrollView>
      )}
    </View>
  );
};

export default React.memo(NFTCreated);

// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import React, {useCallback, useEffect, useMemo, useState} from 'react';
// import {ActivityIndicator, FlatList, Text, View} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {Loader} from '../../components';
// import NFTItem from '../../components/NFTItem';
// import {colors} from '../../res';
// import {translate} from '../../walletUtils';
// import {
//   myNftCreatedListingReset,
//   myNftCreatedPageChange,
//   myNFTList,
//   myNftLoadFail,
// } from '../../store/actions/myNFTaction';
// import styles from './styles';
// import {Tabs} from 'react-native-collapsible-tab-view';

// const NFTCreated = props => {
//   const {id} = props;

//   console.log('****** ', id);
//   const isFocusedHistory = useIsFocused();

//   const {MyNFTReducer} = useSelector(state => state);
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [isFirstRender, setIsFirstRender] = useState(true);

//   // const id = '0x3cc51779881e3723d5aa23a2adf0b215124a177d';

//   // console.log('ID : ', id);

//   let pageNum = 1;
//   let limit = 10;
//   let tab = 1;

//   useEffect(() => {
//     dispatch(myNftCreatedListingReset());
//     if (isFocusedHistory) {
//       if (!MyNFTReducer?.myNftCreatedList?.length) {
//         pressToggle();
//       } else {
//         if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
//           dispatch(myNftLoadFail());
//         } else {
//           pressToggle();
//         }
//       }
//       setIsFirstRender(false);
//     }
//   }, [isFocusedHistory, id]);

//   const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
//     dispatch(myNFTList(pageIndex, pageSize, address, category));
//   }, []);

//   const pressToggle = () => {
//     getNFTlist(pageNum, limit, id, tab);
//   };

//   const renderItem = ({item, index}) => {
//     return (
//       <NFTItem
//         screenName="movieNFT"
//         item={item}
//         // image={imageUri}
//         profile={true}
//         onPress={() => {
//           // dispatch(changeScreenName('movieNFT'));
//           navigation.push('CertificateDetail', {
//             networkName: item?.network?.networkName,
//             collectionAddress: item?.collection?.address,
//             nftTokenId: item?.tokenId,
//           });
//         }}
//       />
//     );
//   };

//   const handlePullRefresh = () => {
//     dispatch(myNftCreatedListingReset());
//     pressToggle();
//   };

//   const renderFooter = () => {
//     if (MyNFTReducer.myNftListLoading && MyNFTReducer.myNftCreatedListPage > 1)
//       return <ActivityIndicator size="small" color={colors.themeR} />;
//     return null;
//   };

//   const RenderHeader = () => {
//     return (
//       <View style={styles.trendCont}>
//         {MyNFTReducer.myNftListLoading ? (
//           <View style={styles.sorryMessageCont}>
//             <Loader />
//           </View>
//         ) : MyNFTReducer?.myNftCreatedList?.length > 0 ? null : (
//           <View style={styles.sorryMessageCont}>
//             <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
//           </View>
//         )}

//         {/* {(MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftCreatedListPage === 1) ||
//         (!MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftCreatedList?.length == 0) ? (
//           <View style={styles.sorryMessageCont}>
//             <Loader />
//           </View>
//         ) : !MyNFTReducer.myNftListLoading &&
//           MyNFTReducer?.myNftCreatedList?.length == 0 ? (
//           <View style={styles.sorryMessageCont}>
//             <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
//           </View>
//         ) : null} */}
//       </View>
//     );
//   };

//   const RenderFlatlist = () => {
//     return (
//       <Tabs.FlatList
//         key={1}
//         data={MyNFTReducer?.myNftCreatedList}
//         renderItem={renderItem}
//         keyExtractor={(v, i) => 'item_' + i}
//         horizontal={false}
//         numColumns={2}
//         initialNumToRender={10}
//         ListHeaderComponent={RenderHeader}
//         onRefresh={handlePullRefresh}
//         refreshing={
//           MyNFTReducer.myNftCreatedListPage === 1 &&
//           MyNFTReducer.myNftListLoading
//         }
//         onEndReached={() => {
//           if (
//             !MyNFTReducer.myNftListLoading &&
//             MyNFTReducer.myNftCreatedList.length !==
//               MyNFTReducer.myNftTotalCount
//           ) {
//             let num = MyNFTReducer.myNftCreatedListPage + 1;
//             getNFTlist(num, limit, id, tab);
//             dispatch(myNftCreatedPageChange(num));
//           }
//         }}
//         ListFooterComponent={renderFooter}
//         onEndReachedThreshold={0.4}
//       />
//     );
//   };

//   return RenderFlatlist();
// };

// export default React.memo(NFTCreated);
