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
  console.log('props Id : ', props.id);
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    pressToggle();
  }, []);

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(1, 10, props.id, 1);
  };

  // console.log('Created MyNFTReducer : ', MyNFTReducer);
  // console.log('Created Page : ', MyNFTReducer.myNftCreatedListPage);
  // console.log('Created Loading : ', MyNFTReducer.myNftCreatedListLoading);
  // console.log('Created Count : ', MyNFTReducer.myNftCreatedTotalCount);
  // console.log('Created List : ', MyNFTReducer.myNftCreatedList);

  const renderFooter = () => {
    // console.log(
    //   'Render Loading Status : ',
    //   MyNFTReducer.myNftCreatedListLoading,
    //   MyNFTReducer.myNftCreatedListPage,
    // );
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
        // image={imageUri}
        profile={true}
        onPress={() => {
          // dispatch(changeScreenName('movieNFT'));
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
    pressToggle();
  };

  const renderHeader = () => {
    console.log('C Loading : ', MyNFTReducer.myNftCreatedListLoading);
    console.log('C Page : ', MyNFTReducer.myNftCreatedListPage);
    console.log('C Length : ', MyNFTReducer.myNftCreatedList.length);

    return (
      <View style={styles.trendCont}>
        {MyNFTReducer.myNftCreatedListLoading &&
        MyNFTReducer.myNftCreatedListPage == 1 ? (
          <View style={styles.sorryMessageCont}>
            <Loader />
          </View>
        ) : MyNFTReducer.myNftCreatedList.length ? null : (
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        )}
      </View>
    );
  };

  // console.log('Created Loading : ', MyNFTReducer.myNftCreatedListLoading);

  const renderList = () => {
    return (
      <Tabs.FlatList
        key={1}
        data={MyNFTReducer?.myNftCreatedList}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(v, i) => 'item_' + i}
        initialNumToRender={10}
        onEndReached={() => {
          if (
            !MyNFTReducer.myNftCreatedListLoading &&
            MyNFTReducer.myNftCreatedList.length !=
              MyNFTReducer.myNftCreatedTotalCount
          ) {
            let num = MyNFTReducer.myNftCreatedListPage + 1;
            getNFTlist(num, 10, props.id, 1);
            dispatch(myNftCreatedPageChange(num));
          }
        }}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.4}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftCreatedListPage === 1 &&
          MyNFTReducer.myNftCreatedListLoading
        }
      />
    );
  };

  return (
    <AppBackground>
      <Tabs.FlatList
        key={1}
        data={MyNFTReducer?.myNftCreatedList}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(v, i) => 'item_' + i}
        initialNumToRender={10}
        onEndReached={() => {
          if (
            !MyNFTReducer.myNftCreatedListLoading &&
            MyNFTReducer.myNftCreatedList.length !=
              MyNFTReducer.myNftCreatedTotalCount
          ) {
            let num = MyNFTReducer.myNftCreatedListPage + 1;
            getNFTlist(num, 10, props.id, 1);
            dispatch(myNftCreatedPageChange(num));
          }
        }}
        // ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.4}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftCreatedListPage === 1 &&
          MyNFTReducer.myNftCreatedListLoading
        }
      />
    </AppBackground>

    // <View style={styles.trendCont}>
    //   {MyNFTReducer.myNftCreatedListLoading &&
    //   MyNFTReducer.myNftCreatedListPage == 1 ? (
    //     <View style={styles.sorryMessageCont}>
    //       <Loader />
    //     </View>
    //   ) : MyNFTReducer.myNftCreatedList.length ? (
    //     renderList()
    //   ) : (
    //     <View style={styles.sorryMessageCont}>
    //       <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
    //     </View>
    //   )}
    // </View>
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
