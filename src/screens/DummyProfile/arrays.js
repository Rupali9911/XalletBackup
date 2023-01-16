import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import * as Tabs from 'react-native-collapsible-tab-view';
const {height} = Dimensions.get('window');

const Item = [
  {name: 'Marissa Castillo', number: 7766398169},
  {name: 'Denzel Curry', number: 9394378449},
  {name: 'Miles Ferguson', number: 8966872888},
  {name: 'Desiree Webster', number: 6818656371},
  {name: 'Samantha Young', number: 6538288534},
  {name: 'Irene Hunter', number: 2932176249},
  {name: 'Annie Ryan', number: 4718456627},
  {name: 'Sasha Oliver', number: 9743195919},
  {name: 'Jarrod Avila', number: 8339212305},
  {name: 'Griffin Weaver', number: 6059349721},
  {name: 'Emilee Moss', number: 7382905180},
  {name: 'Angelique Oliver', number: 9689298436},
  {name: 'Emanuel Little', number: 6673376805},
  {name: 'Wayne Day', number: 6918839582},
  {name: 'Lauren Reese', number: 4652613201},
  {name: 'Kailey Ward', number: 2232609512},
  {name: 'Gabrielle Newman', number: 2837997127},
  {name: 'Luke Strickland', number: 8404732322},
  {name: 'Payton Garza', number: 7916140875},
  {name: 'Anna Moss', number: 3504954657},
  {name: 'Kailey Vazquez', number: 3002136330},
  {name: 'Jennifer Coleman', number: 5469629753},
  {name: 'Cindy Casey', number: 8446175026},
  {name: 'Dillon Doyle', number: 5614510703},
  {name: 'Savannah Garcia', number: 5634775094},
  {name: 'Kailey Hudson', number: 3289239675},
  {name: 'Ariel Green', number: 2103492196},
  {name: 'Weston Perez', number: 2984221823},
  {name: 'Kari Juarez', number: 9502125065},
  {name: 'Sara Sanders', number: 7696668206},
  {name: 'Griffin Le', number: 3396937040},
  {name: 'Fernando Valdez', number: 9124257306},
  {name: 'Taylor Marshall', number: 9656072372},
  {name: 'Elias Dunn', number: 9738536473},
  {name: 'Diane Barrett', number: 6886824829},
  {name: 'Samuel Freeman', number: 5523948094},
  {name: 'Irene Garza', number: 2077694008},
  {name: 'Devante Alvarez', number: 9897002645},
  {name: 'Sydney Floyd', number: 6462897254},
  {name: 'Toni Dixon', number: 3775448213},
  {name: 'Anastasia Spencer', number: 4548212752},
  {name: 'Reid Cortez', number: 6668056507},
  {name: 'Ramon Duncan', number: 8889157751},
  {name: 'Kenny Moreno', number: 5748219540},
  {name: 'Shelby Craig', number: 9473708675},
  {name: 'Jordyn Brewer', number: 7552277991},
  {name: 'Tanya Walker', number: 4308189657},
  {name: 'Nolan Figueroa', number: 9173443776},
  {name: 'Sophia Gibbs', number: 6435942770},
  {name: 'Vincent Sandoval', number: 2606111495},
  {name: 'Marissa Castillo', number: 7766398169},
  {name: 'Denzel Curry', number: 9394378449},
  {name: 'Miles Ferguson', number: 8966872888},
  {name: 'Desiree Webster', number: 6818656371},
  {name: 'Samantha Young', number: 6538288534},
  {name: 'Irene Hunter', number: 2932176249},
  {name: 'Annie Ryan', number: 4718456627},
  {name: 'Sasha Oliver', number: 9743195919},
  {name: 'Jarrod Avila', number: 8339212305},
  {name: 'Griffin Weaver', number: 6059349721},
  {name: 'Emilee Moss', number: 7382905180},
  {name: 'Angelique Oliver', number: 9689298436},
  {name: 'Emanuel Little', number: 6673376805},
  {name: 'Wayne Day', number: 6918839582},
  {name: 'Lauren Reese', number: 4652613201},
  {name: 'Kailey Ward', number: 2232609512},
  {name: 'Gabrielle Newman', number: 2837997127},
  {name: 'Luke Strickland', number: 8404732322},
  {name: 'Payton Garza', number: 7916140875},
  {name: 'Anna Moss', number: 3504954657},
  {name: 'Kailey Vazquez', number: 3002136330},
  {name: 'Jennifer Coleman', number: 5469629753},
  {name: 'Cindy Casey', number: 8446175026},
  {name: 'Dillon Doyle', number: 5614510703},
  {name: 'Savannah Garcia', number: 5634775094},
  {name: 'Kailey Hudson', number: 3289239675},
  {name: 'Ariel Green', number: 2103492196},
  {name: 'Weston Perez', number: 2984221823},
  {name: 'Kari Juarez', number: 9502125065},
  {name: 'Sara Sanders', number: 7696668206},
  {name: 'Griffin Le', number: 3396937040},
  {name: 'Fernando Valdez', number: 9124257306},
  {name: 'Taylor Marshall', number: 9656072372},
  {name: 'Elias Dunn', number: 9738536473},
  {name: 'Diane Barrett', number: 6886824829},
  {name: 'Samuel Freeman', number: 5523948094},
  {name: 'Irene Garza', number: 2077694008},
  {name: 'Devante Alvarez', number: 9897002645},
  {name: 'Sydney Floyd', number: 6462897254},
  {name: 'Toni Dixon', number: 3775448213},
  {name: 'Anastasia Spencer', number: 4548212752},
  {name: 'Reid Cortez', number: 6668056507},
  {name: 'Ramon Duncan', number: 8889157751},
  {name: 'Kenny Moreno', number: 5748219540},
  {name: 'Shelby Craig', number: 9473708675},
  {name: 'Jordyn Brewer', number: 7552277991},
  {name: 'Tanya Walker', number: 4308189657},
  {name: 'Nolan Figueroa', number: 9173443776},
  {name: 'Sophia Gibbs', number: 6435942770},
  {name: 'Vincent Sandoval', number: 2606111495},
  {name: 'Marissa Castillo', number: 7766398169},
  {name: 'Denzel Curry', number: 9394378449},
  {name: 'Miles Ferguson', number: 8966872888},
  {name: 'Desiree Webster', number: 6818656371},
  {name: 'Samantha Young', number: 6538288534},
  {name: 'Irene Hunter', number: 2932176249},
  {name: 'Annie Ryan', number: 4718456627},
  {name: 'Sasha Oliver', number: 9743195919},
  {name: 'Jarrod Avila', number: 8339212305},
  {name: 'Griffin Weaver', number: 6059349721},
  {name: 'Emilee Moss', number: 7382905180},
  {name: 'Angelique Oliver', number: 9689298436},
  {name: 'Emanuel Little', number: 6673376805},
  {name: 'Wayne Day', number: 6918839582},
  {name: 'Lauren Reese', number: 4652613201},
  {name: 'Kailey Ward', number: 2232609512},
  {name: 'Gabrielle Newman', number: 2837997127},
  {name: 'Luke Strickland', number: 8404732322},
  {name: 'Payton Garza', number: 7916140875},
  {name: 'Anna Moss', number: 3504954657},
  {name: 'Kailey Vazquez', number: 3002136330},
  {name: 'Jennifer Coleman', number: 5469629753},
  {name: 'Cindy Casey', number: 8446175026},
  {name: 'Dillon Doyle', number: 5614510703},
  {name: 'Savannah Garcia', number: 5634775094},
  {name: 'Kailey Hudson', number: 3289239675},
  {name: 'Ariel Green', number: 2103492196},
  {name: 'Weston Perez', number: 2984221823},
  {name: 'Kari Juarez', number: 9502125065},
  {name: 'Sara Sanders', number: 7696668206},
  {name: 'Griffin Le', number: 3396937040},
  {name: 'Fernando Valdez', number: 9124257306},
  {name: 'Taylor Marshall', number: 9656072372},
  {name: 'Elias Dunn', number: 9738536473},
  {name: 'Diane Barrett', number: 6886824829},
  {name: 'Samuel Freeman', number: 5523948094},
  {name: 'Irene Garza', number: 2077694008},
  {name: 'Devante Alvarez', number: 9897002645},
  {name: 'Sydney Floyd', number: 6462897254},
  {name: 'Toni Dixon', number: 3775448213},
  {name: 'Anastasia Spencer', number: 4548212752},
  {name: 'Reid Cortez', number: 6668056507},
  {name: 'Ramon Duncan', number: 8889157751},
  {name: 'Kenny Moreno', number: 5748219540},
  {name: 'Shelby Craig', number: 9473708675},
  {name: 'Jordyn Brewer', number: 7552277991},
  {name: 'Tanya Walker', number: 4308189657},
  {name: 'Nolan Figueroa', number: 9173443776},
  {name: 'Sophia Gibbs', number: 6435942770},
  {name: 'Vincent Sandoval', number: 2606111495},
];

const Contacts = props => {
  const {id} = props;
  console.log('check inside ID : ', id);

  const isFocusedHistory = useIsFocused();

  const {MyNFTReducer} = useSelector(state => state);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFirstRender, setIsFirstRender] = useState(true);

  let pageNum = 1;
  let limit = 10;
  let tab = 1;

  // const id = '0x3cc51779881e3723d5aa23a2adf0b215124a177d';

  // console.log('IDDDD : ', id);

  useEffect(() => {
    dispatch(myNftCreatedListingReset());
    if (isFocusedHistory) {
      if (!MyNFTReducer?.myNftCreatedList?.length) {
        pressToggle();
      } else {
        if (id && id.toLowerCase() === MyNFTReducer.nftUserAdd.toLowerCase()) {
          dispatch(myNftLoadFail());
        } else {
          pressToggle();
        }
      }
      setIsFirstRender(false);
    }
  }, [isFocusedHistory, id]);

  const getNFTlist = useCallback((pageIndex, pageSize, address, category) => {
    dispatch(myNFTList(pageIndex, pageSize, address, category));
  }, []);

  const pressToggle = () => {
    getNFTlist(pageNum, limit, id, tab);
  };

  const renderItem = ({item, index}) => {
    return (
      // <TouchableOpacity>
      //   <Text>{index}</Text>
      // </TouchableOpacity>

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

  const renderFooter = () => {
    if (MyNFTReducer.myNftListLoading && MyNFTReducer.myNftCreatedListPage > 1)
      return <ActivityIndicator size="small" color={colors.themeR} />;
    return null;
  };

  const RenderHeader = () => {
    // console.log('isFirstRender ', isFirstRender);
    // console.log(
    //   'MyNFTReducer.myNftListLoading : ',
    //   MyNFTReducer.myNftListLoading,
    // );
    // console.log(
    //   'MyNFTReducer.myNftCreatedListPage : ',
    //   MyNFTReducer.myNftCreatedListPage,
    // );

    return (
      <View style={styles.trendCont}>
        {isFirstRender ? (
          isFirstRender
        ) : MyNFTReducer.myNftListLoading &&
          MyNFTReducer.myNftCreatedListPage === 1 ? (
          <View style={styles.sorryMessageCont}>
            <Loader />
          </View>
        ) : MyNFTReducer?.myNftCreatedList?.length == 0 ? (
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        ) : null}

        {/* {MyNFTReducer.myNftCreatedList
          .length ? null : MyNFTReducer.myNftCreatedListPage === 1 &&
          MyNFTReducer.myNftListLoading ? (
          <View style={styles.sorryMessageCont}>
            <Text>{'Header Loader ...'}</Text>
          </View>
        ) : (
          <View style={styles.sorryMessageCont}>
            <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
          </View>
        )} */}
      </View>
    );
  };

  const RenderFlatlist = () => {
    console.log('isFirstRender ', isFirstRender);
    console.log(
      'MyNFTReducer.myNftListLoading : ',
      MyNFTReducer.myNftListLoading,
    );
    console.log(
      'MyNFTReducer.myNftCreatedListPage : ',
      MyNFTReducer.myNftCreatedListPage,
    );
    return (
      <Tabs.FlatList
        data={MyNFTReducer?.myNftCreatedList}
        renderItem={renderItem}
        keyExtractor={(v, i) => 'item_' + i}
        // horizontal={false}
        numColumns={2}
        initialNumToRender={10}
        ListHeaderComponent={RenderHeader}
        onRefresh={handlePullRefresh}
        refreshing={
          MyNFTReducer.myNftCreatedListPage === 1 &&
          MyNFTReducer.myNftListLoading &&
          isFirstRender
        }
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
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.4}
      />
    );
  };

  return (
    // <View style={styles.trendCont}>
    //   {isFirstRender ? (
    //     isFirstRender
    //   ) : MyNFTReducer.myNftCreatedListPage === 1 &&
    //     MyNFTReducer.myNftListLoading ? (
    //     <View style={styles.sorryMessageCont}>
    //       <Loader />
    //     </View>
    //   ) : MyNFTReducer?.myNftCreatedList?.length ? (
    <Text>{'Hello'}</Text>
    // RenderFlatlist()
    //   ) : (
    //     <View style={styles.sorryMessageCont}>
    //       <Text style={styles.sorryMessage}>{translate('common.noNFT')}</Text>
    //     </View>
    //   )}
    // </View>
  );
};

export default Contacts;

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    margin: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  number: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
  listEmpty: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 10,
  },
  trendCont: {
    backgroundColor: colors.white,
    flex: 1,
  },
  sorryMessageCont: {
    // flex: 1,
    marginTop: height / 6.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sorryMessage: {
    fontSize: 15,
    // fontFamily: fonts.SegoeUIRegular,
  },
});
