import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment';
import React from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import NumberFormat from 'react-number-format';
import check from '../../assets/pngs/check.png';
import copy from '../../assets/pngs/copy.png';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import TextView from '../../components/appText';
import Colors from '../../constants/Colors';
import {hp, RF, wp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {alertWithSingleBtn} from '../../utils';
import {environment, translate} from '../../walletUtils';

export default function transactionsDetail({route}) {
  const transactionInfo = route?.params?.data;
  const coin = route?.params?.coin;
  const copyAddress = () => {
    Clipboard.setString(
      transactionInfo?.direction == 'in'
      ? transactionInfo?.from
      : transactionInfo?.to,
      );
      alertWithSingleBtn(translate('wallet.common.copied'));
    };
    const copyTransactionHash = () => {
      Clipboard.setString(transactionInfo?.hash);
      alertWithSingleBtn(translate('wallet.common.copied'));
    };
    const openURL = () => {
      if (coin?.network == 'BSC') {
        Linking.openURL(`${environment.bscScanURL}${transactionInfo?.hash}`);
      } else if (coin?.network == 'Polygon') {
        Linking.openURL(`${environment.polygonScanURL}${transactionInfo?.hash}`);
      } else if (coin?.network == 'Ethereum') {
        Linking.openURL(`${environment.ethereumScanURL}${transactionInfo?.hash}`);
      }
    };
    {console.log(transactionInfo)}
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
          {transactionInfo?.txreceipt_status === "1" && (
            <Image style={styles.checkImage} source={check} />
          )}
          <TextView
            style={[
              styles.recieveText,
              transactionInfo?.txreceipt_status === "0" && {color: Colors.RED2},
            ]}>
            {transactionInfo?.txreceipt_status == "1"
              ? translate('wallet.common.paymentComplete')
              : transactionInfo?.direction == 'in' ? translate('wallet.common.paymentFailed'):translate('wallet.common.remittanceFailure')}
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
            <TouchableOpacity onPress={copyAddress}>
              <Image style={styles.copyImage} source={copy} />
            </TouchableOpacity>
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
              <Image style={styles.copyImage} source={copy} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <TextView style={styles.rowText}>{translate('common.date')}</TextView>
          <TextView style={styles.rowText}>
            {moment
              .unix(transactionInfo?.timeStamp)
              .format('YYYY-MM-DD HH:mm:ss')}
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
