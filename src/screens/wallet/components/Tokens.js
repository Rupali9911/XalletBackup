import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import TextView from '../../../components/appText';
import Colors from '../../../constants/Colors';
import Fonts from '../../../constants/Fonts';
import { hp, RF, wp } from '../../../constants/responsiveFunct';
import CommonStyles from '../../../constants/styles';
import { tokens, translate } from '../../../walletUtils';

const ListItems = props => {
  const { item } = props;
  return (
    <TouchableOpacity
      onPress={() => props.onPress && props.onPress(item)}
      style={styles.listCont}>
      <View style={styles.profileCont}>
        <Image style={styles.profileImage} source={item.icon} />
      </View>
      <View style={styles.centerCont}>
        <Text style={styles.tokenName}>{item.tokenName}</Text>
        {/*<View style={styles.detailsContainer}>*/}
        {/*<Text style={styles.townTxt} >{item.amount}</Text>*/}
        {/*<Text style={styles.percentTxt} >{item.percent}</Text>*/}
        {/*</View>*/}
      </View>
      <View style={{ ...CommonStyles.center, alignItems: 'flex-end' }}>
        <Text style={styles.townTxt}>{item.network}</Text>
        <NumberFormat
          value={parseFloat(`${item.tokenValue}`)}
          displayType={'text'}
          decimalScale={4}
          thousandSeparator={true}
          renderText={formattedValue => (
            <Text numberOfLines={1} style={styles.priceTxt}>
              {formattedValue} {item.type}
            </Text>
          )} // <--- Don't forget this!
        />
      </View>
    </TouchableOpacity>
  );
};

const Tokens = props => {
  const { network, allowedTokens } = props;

  const [balance_Data, setBalanceData] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);

  const {
    ethBalance,
    bnbBalance,
    maticBalance,
    tnftBalance,
    talBalance,
    usdcBalance,
    wethBalance,
    busdBalance,
    usdtBalance,
    xetaBalance
  } = useSelector(state => state.WalletReducer);

  useEffect(() => {
    if (allowedTokens?.length > 0) {
      setBalanceData(allowedTokens);
    }
  }, [allowedTokens]);

  useEffect(() => {
    let array = tokens;
    if (network?.name == 'Ethereum') {
      array[1].tokenValue = `${ethBalance}`;
      array[8].tokenValue = `${usdtBalance}`;
    } else if (network.name == 'BSC') {
      array[0].tokenValue = `${bnbBalance}`;
      array[3].tokenValue = `${tnftBalance}`;
      array[7].tokenValue = `${busdBalance}`;
    } else if (network.name == 'Polygon') {
      array[2].tokenValue = `${maticBalance}`;
      array[4].tokenValue = `${talBalance}`;
      array[5].tokenValue = `${usdcBalance}`;
      array[6].tokenValue = `${wethBalance}`;
    } else if (network.name == 'XANA CHAIN') {
      array[9].tokenValue = `${xetaBalance}`;
    }

    let result = [];
    if (allowedTokens && allowedTokens.length > 0) {
      let _array = [];
      allowedTokens.map(item => {
        _array.push(item.type);
      });

      result = array.filter(item => {
        if (item.network?.toLowerCase() === network.name?.toLowerCase()) {
          if (_array.includes(item.type)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } else {
      result = array;
    }
    setBalanceData(result);
  }, [
    network,
    ethBalance,
    bnbBalance,
    maticBalance,
    tnftBalance,
    talBalance,
    busdBalance,
    usdtBalance,
    xetaBalance
  ]);

  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    props.onRefresh &&
      props
        .onRefresh()
        .then(() => {
          setRefreshing(false);
        })
        .catch(() => {
          setRefreshing(false);
        });
  };

  const renderItems = ({ item, index }) => {
    return <ListItems item={item} onPress={props.onTokenPress} />;
  };

  return (
    <View style={[styles.scene]}>
      <FlatList
        data={
          network
            ? balance_Data.filter(_ => _.network == network.name)
            : balance_Data
        }
        renderItem={renderItems}
        keyExtractor={(item, index) => `_${index}`}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.themeColor}
          />
        }
        ListEmptyComponent={() => {
          return (
            <TextView style={styles.noData}>
              {translate('wallet.common.noData')}
            </TextView>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  profileCont: {
    ...CommonStyles.circle('10'),
  },
  profileImage: {
    ...CommonStyles.imageStyles(10),
  },
  listCont: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTxt: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL,
    color: Colors.tokenLabel,
    fontWeight: '200',
  },
  townTxt: {
    fontSize: RF(1.4),
    fontFamily: Fonts.ARIAL,
    color: Colors.townTxt,
    marginVertical: hp('0.5%'),
  },
  percentTxt: {
    fontSize: RF(1.4),
    fontFamily: Fonts.ARIAL,
    color: Colors.percentColor,
    marginVertical: hp('0.5%'),
  },
  centerCont: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    justifyContent: 'center',
  },
  tokenName: {
    fontFamily: Fonts.ARIAL,
    fontSize: RF(2.3),
    color: Colors.tokenLabel,
  },
  separator: {
    backgroundColor: Colors.separatorThird,
    width: wp('90%'),
  },
  timeIcon: {
    ...CommonStyles.imageStyles(20),
  },
  timeCont: {
    ...CommonStyles.center,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%'),
  },
  timerTitle: {
    fontFamily: Fonts.ARIAL,
    fontSize: RF(1.8),
    color: Colors.timerTitle,
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  timerDes: {
    fontFamily: Fonts.ARIAL,
    fontSize: RF(1.6),
    color: Colors.timerTitle,
    textAlign: 'center',
    marginTop: hp('1%'),
  },
  timerBtn: {
    borderColor: Colors.timerButtonBorder,
    marginTop: hp('3%'),
    backgroundColor: Colors.white,
  },
  timerLabel: {
    fontSize: RF(1.8),
    color: Colors.timerButtonLabel,
  },
  noData: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.tabLabel, RF(2)),
    textAlign: 'center',
    marginVertical: hp('2%'),
  },
  detailsContainer: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Tokens;
