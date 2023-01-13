import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState} from 'react';
import moment from 'moment';
import { Image, Linking,StyleSheet, TouchableOpacity, View,Text,} from 'react-native';
import NumberFormat from 'react-number-format';
import check from '../../assets/pngs/check.png';
import copy from '../../assets/pngs/copy.png';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import Colors from '../../constants/Colors';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { environment, translate } from '../../walletUtils';
import { useSelector } from 'react-redux';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

export default function transactionsDetail({ route }) {
  const transactionInfo = route?.params?.data;
  const regionLanguage = route?.params?.regionLanguage;
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  let datetime = new Date(transactionInfo?.timeStamp * 1000);
  let UTCTime = moment(datetime).utc().format('YYYY-MM-DD HH:mm:ss');
  let localTime = moment.unix(transactionInfo?.timeStamp).format('YYYY-MM-DD HH:mm:ss');
  let displayTime =
    selectedLanguageItem.language_name !== regionLanguage ? UTCTime : localTime;
  const coin = route?.params?.coin;

  const [transactionAddress, setTransactionAddress] = useState(false);
  const [transactionId, setTransactionId] = useState(false);
  
  const copyAddress = () => {
    Clipboard.setString(
      transactionInfo?.direction == 'in'
        ? transactionInfo?.from
        : transactionInfo?.to,
    );
    setTransactionAddress(true);
    setTimeout(() => {
      setTransactionAddress(false);
    }, 700);
  };

  const copyTransactionHash = () => {
    Clipboard.setString(transactionInfo?.hash);
    setTransactionId(true);
    setTimeout(() => {
      setTransactionId(false);
    }, 700);
  };

  const copyBoardAlert = id => {
    return (
      <>
        <Menu opened={id}>
          <MenuTrigger />
          <MenuOptions
            optionsContainerStyle={{
              width: 'auto',
              backgroundColor: Colors.BLACK1,
            }}>
            <MenuOption>
              <Text style={{color: '#FFFFFF'}}>
                {`${translate('wallet.common.copied')}!`}
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <Image style={styles.copyImage} source={copy} />
      </>
    );
  };
  const openURL = () => {
    if (coin?.network == 'BSC') {
      Linking.openURL(`${environment.bscScanURL}tx/${transactionInfo?.hash}`);
    } else if (coin?.network == 'Polygon') {
      Linking.openURL(`${environment.polygonScanURL}tx/${transactionInfo?.hash}`);
    } else if (coin?.network == 'Ethereum') {
      Linking.openURL(`${environment.ethereumScanURL}tx/${transactionInfo?.hash}`);
    } else if (coin?.network == 'XANACHAIN') {
      Linking.openURL(`${environment.xanaScanURL}tx/${transactionInfo?.hash}`);
    }
  };
  return (
    <AppBackground>
      <AppHeader
        showBackButton
        title={
          transactionInfo?.direction == 'in'
            ? translate('wallet.common.paymentDetails')
            : translate('wallet.common.remittanceDetails')
        }
      />
      <View style={styles.balanceContainer}>
        <TextView style={styles.balanceLabel}>
          {transactionInfo?.direction == 'in'
            ? translate('wallet.common.amount')
            : translate('wallet.common.remittanceQuantity')}
        </TextView>
        <NumberFormat
          value={transactionInfo?.value}
          displayType={'text'}
          decimalScale={8}
          thousandSeparator={true}
          renderText={formattedValue => (
            <TextView style={styles.priceCont}>
              {formattedValue} {coin?.type}
            </TextView>
          )}
        />
        <View style={styles.directionContainer}>
          {transactionInfo?.hash !== '' && (
            <Image style={styles.checkImage} source={check} />
          )}
          <TextView
            style={[
              styles.recieveText,
              transactionInfo?.hash == '' && { color: Colors.RED2 },
            ]}>
            {transactionInfo?.hash !== ''
              ? translate('wallet.common.paymentComplete')
              : transactionInfo?.direction == 'in'
                ? translate('wallet.common.paymentFailed')
                : translate('wallet.common.remittanceFailure')}
          </TextView>
        </View>
      </View>
      <View style={styles.transactionInfoContainer}>
        <View style={styles.rowContainer}>
          <TextView style={styles.rowText}>
            {translate('wallet.common.network')}
          </TextView>
          <TextView style={styles.rowText}>{coin?.network}</TextView>
        </View>
        <View style={styles.rowContainer}>
          <TextView style={styles.rowText}>
            {translate('wallet.common.topup.address')}
          </TextView>
          <View style={styles.hashContainer}>
            <TextView style={styles.rowKeyText} numberOfLines={2}>
              {transactionInfo?.direction == 'in'
                ? transactionInfo?.from
                : transactionInfo?.to}
            </TextView>
            <TouchableOpacity onPress={() => copyAddress()}>{copyBoardAlert(transactionAddress)}</TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <TextView style={styles.rowText}>
            {translate('wallet.common.transactionHash')}
          </TextView>
          <View style={styles.hashContainer}>
            <TextView
              style={styles.rowKeyText}
              onPress={openURL}
              numberOfLines={2}>
              {transactionInfo?.hash}
            </TextView>
            <TouchableOpacity onPress={copyTransactionHash}>
              {copyBoardAlert(transactionId)}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <TextView style={styles.rowText}>{translate('common.date')}</TextView>
          <TextView style={styles.rowText}>
            {/* {moment
              .unix(transactionInfo?.timeStamp)
              .format('YYYY-MM-DD HH:mm:ss')} */}
            {displayTime}
          </TextView>
        </View>
      </View>
    </AppBackground>
  );
}
const styles = StyleSheet.create({
  balanceContainer: {
    marginVertical: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    color: Colors.black,
    fontSize: RF(2),
  },
  priceCont: {
    fontSize: RF(3.5),
    color: Colors.black,
    marginVertical: hp('0.5%'),
  },
  directionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('1%'),
  },
  checkImage: {
    ...CommonStyles.imageStyles(5),
  },
  recieveText: {
    color: Colors.BLUE2,
    fontSize: RF(2.2),
    marginLeft: wp('3%'),
  },
  transactionInfoContainer: {
    paddingHorizontal: wp('3%'),
    marginVertical: hp('1%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: Colors.buttonGroupBackground,
    borderRadius: 4,
  },
  rowText: {
    color: Colors.black,
    fontSize: RF(1.95),
    maxWidth: wp('52.5%'),
  },
  rowKeyText: {
    color: Colors.black,
    fontSize: RF(1.4),
    maxWidth: wp('54%'),
    textAlign: 'right',
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyImage: {
    ...CommonStyles.imageStyles(4.5),
    marginLeft: wp('3%'),
  },
});
