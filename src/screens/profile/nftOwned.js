import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Loader} from '../../components';
import NFTItem from '../../components/NFTItem';
import {colors} from '../../res';
import {
  myNFTList,
  myNftListReset,
  myNftLoadFail,
  myNftOwnedListingReset,
  myNftOwnedPageChange,
} from '../../store/actions/myNFTaction';
import {translate} from '../../walletUtils';
import styles from './styles';
import {Tabs} from 'react-native-collapsible-tab-view';
import AppBackground from '../../components/appBackground';

const NFTOwned = props => {
  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    // dispatch(myNftOwnedListingReset());

    if (props.isFocused) {
      if (!MyNFTReducer?.myNftOwnedList?.length) {
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
    getNFTlist(1, 10, props.id, 2);
  };

  const renderFooter = () => {
    if (
      MyNFTReducer.myNftOwnedListLoading &&
      MyNFTReducer.myNftOwnedListPage > 1
    )
      return <ActivityIndicator size="small" color={colors.themeR} />;
    return null;
  };

  const renderItem = ({item, index}) => {
    return (
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
    dispatch(myNftOwnedListingReset());
    pressToggle();
  };

  const renderHeader = () => {
    return (
      <View style={styles.trendCont}>
        {MyNFTReducer.myNftOwnedListLoading &&
        MyNFTReducer.myNftOwnedListPage == 1 ? (
          <View style={styles.sorryMessageCont}>
            <Loader />
          </View>
        ) : null}
      </View>
    );
  };

  const EmptyListMessage = () => {
    return (
      <View style={styles.trendCont}>
        <View style={styles.sorryMessageCont}>
          <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
        </View>
      </View>
    );
  };

  return (
    <Tabs.FlatList
      key={2}
      data={MyNFTReducer?.myNftCreatedList}
      renderItem={renderItem}
      numColumns={2}
      keyExtractor={(v, i) => 'item_' + i}
      onEndReached={() => {
        if (
          !MyNFTReducer.myNftOwnedListLoading &&
          MyNFTReducer.myNftOwnedList.length !==
            MyNFTReducer.myNftOwnedTotalCount
        ) {
          let num = MyNFTReducer.myNftOwnedListPage + 1;
          getNFTlist(num, 10, props.id, 2);
          dispatch(myNftOwnedPageChange(num));
        }
      }}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={EmptyListMessage}
      onEndReachedThreshold={0.4}
      onRefresh={handlePullRefresh}
      refreshing={
        MyNFTReducer.myNftOwnedListPage === 1 &&
        MyNFTReducer.myNftOwnedListLoading
      }
    />
  );
};

export default React.memo(NFTOwned);

// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import React, {useCallback, useEffect, useState} from 'react';
// import {ActivityIndicator, FlatList, Text, View} from 'react-native';
// import {useDispatch, useSelector} from 'react-redux';
// import {Loader} from '../../components';
// import NFTItem from '../../components/NFTItem';
// import {colors} from '../../res';
// import {
//   myNFTList,
//   myNftListReset,
//   myNftLoadFail,
//   myNftOwnedListingReset,
//   myNftOwnedPageChange,
// } from '../../store/actions/myNFTaction';
// import {translate} from '../../walletUtils';
// import styles from './styles';
// import {Tabs} from 'react-native-collapsible-tab-view';

// const NFTOwned = props => {
//   const {id} = props;
//   const isFocusedHistory = useIsFocused();

//   console.log('ID : ', id);

//   // const { id } = route?.params;
//   const {MyNFTReducer} = useSelector(state => state);
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [isFirstRender, setIsFirstRender] = useState(true);

//   let pageNum = 1;
//   let limit = 10;
//   let tab = 2;
//   // const id = '0x3cc51779881e3723d5aa23a2adf0b215124a177d';

//   useEffect(() => {
//     dispatch(myNftOwnedListingReset());
//     if (isFocusedHistory) {
//       if (MyNFTReducer?.myNftOwnedList?.length === 0) {
//         dispatch(myNftListReset());
//         pressToggle();
//       } else {
//         if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
//           dispatch(myNftLoadFail());
//         } else {
//           dispatch(myNftListReset());
//           pressToggle();
//         }
//       }
//       setIsFirstRender(false);
//     }
//   }, [isFocusedHistory, id]);

//   const renderFooter = () => {
//     if (MyNFTReducer.myNftListLoading && MyNFTReducer.myNftOwnedListPage > 1)
//       return <ActivityIndicator size="small" color={colors.themeR} />;
//     return null;
//   };

//   const renderItem = ({item}) => {
//     return (
//       <NFTItem
//         screenName="movieNFT"
//         item={item}
//         // image={imageUri}
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

//   const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
//     dispatch(myNFTList(pageIndex, pageSize, address, category));
//   }, []);

//   const pressToggle = () => {
//     getNFTlist(pageNum, limit, id, tab);
//   };

//   const handlePullRefresh = () => {
//     dispatch(myNftOwnedListingReset());
//     pressToggle();
//   };

//   const RenderHeader = () => {
//     return (
//       <View style={styles.trendCont}>
//         {(MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftOwnedListPage === 1) ||
//         (!MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftOwnedList?.length == 0) ? (
//           <View style={styles.sorryMessageCont}>
//             <Loader />
//           </View>
//         ) : !MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftOwnedList?.length == 0 ? (
//           <View style={styles.sorryMessageCont}>
//             <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
//           </View>
//         ) : null}
//         {/* {isFirstRender ? (
//           isFirstRender
//         ) : MyNFTReducer.myNftOwnedListPage === 1 &&
//           MyNFTReducer.myNftListLoading ? (
//           <View style={styles.sorryMessageCont}>
//             <Loader />
//           </View>
//         ) : MyNFTReducer.myNftOwnedList?.length == 0 ? (
//           <View style={styles.sorryMessageCont}>
//             <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
//           </View>
//         ) : null} */}
//       </View>
//     );
//   };

//   // console.log('MyNFTReducer?.myNftOwnedList : ', MyNFTReducer?.myNftOwnedList);

//   return (
//     <Tabs.FlatList
//       key={2}
//       data={MyNFTReducer?.myNftOwnedList}
//       horizontal={false}
//       numColumns={2}
//       initialNumToRender={10}
//       nestedScrollEnabled={true}
//       onRefresh={handlePullRefresh}
//       ListHeaderComponent={RenderHeader}
//       refreshing={
//         MyNFTReducer.myNftOwnedListPage === 1 &&
//         MyNFTReducer.myNftListLoading &&
//         isFirstRender
//       }
//       renderItem={renderItem}
//       onEndReached={() => {
//         if (
//           !MyNFTReducer.myNftListLoading &&
//           MyNFTReducer.myNftOwnedList.length !== MyNFTReducer.myNftTotalCount
//         ) {
//           let num = MyNFTReducer.myNftOwnedListPage + 1;
//           getNFTlist(num, limit, id, tab);
//           dispatch(myNftOwnedPageChange(num));
//         }
//       }}
//       ListFooterComponent={renderFooter}
//       onEndReachedThreshold={1}
//       keyExtractor={(v, i) => 'item_' + i}
//     />
//   );
// };

// export default React.memo(NFTOwned);
