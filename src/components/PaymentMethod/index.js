import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import Colors from '../../constants/Colors';
import ImagesSrc from '../../constants/Images';
import CommonStyles from '../../constants/styles';
import Fonts from '../../constants/Fonts';
import {RF, wp, hp} from '../../constants/responsiveFunct';
import ButtonGroup from '../buttonGroup';
import {translate} from '../../walletUtils';
import Separator from '../separator';
import AppButton from '../appButton';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {IconButton} from 'react-native-paper';
import {numberWithCommas} from '../../utils';

const PaymentMethod = props => {
  const {
    visible,
    onRequestClose,
    price,
    chain,
    baseCurrency,
    id,
    collectionAddress,
  } = props;

  const navigation = useNavigation();
  const [opacity, setOpacity] = useState(0.88);
  const [selectedMethod, setSelectedMethod] = useState(1);
  const {buyNFTRes} = useSelector(state => state.detailsNFTReducer);

  const {isNonCrypto} = useSelector(state => state.UserReducer?.userData);

  const gasLimit = buyNFTRes?.gasLimit / 1000000000;
  const totalAmount = Number(price) + gasLimit;

  const detailsRender = (heading, value) => {
    return (
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>{heading}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      transparent
      onShow={() => setOpacity(0.88)}
      onRequestClose={() => {
        // setOpacity(0);
        onRequestClose();
      }}>
      <View style={[styles.container]}>
        <BlurView
          style={styles.absolute}
          blurType="light"
          blurAmount={5}></BlurView>

        <TouchableOpacity
          style={styles.emptyArea}
          onPress={() => {
            // setOpacity(0);
            onRequestClose();
          }}
        />
        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={() => {
              // setOpacity(0);
              onRequestClose();
            }}>
            <IconButton
              icon={'close'}
              color={Colors.headerIcon2}
              size={17}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
          <Text style={styles.title}>
            {translate('wallet.common.selectPaymentMethod')}
          </Text>

          <ButtonGroup
            buttons={
              isNonCrypto === 0
                ? [
                    {
                      text: translate('wallet.common.payByWallet'),
                      icon: ImagesSrc.walletPay,
                      onPress: () => {
                        setSelectedMethod(0);
                      },
                    },
                  ]
                : []
            }
            style={styles.optionContainer}
            selectable
            selectedIndex={selectedMethod}
            separatorColor={Colors.white}
          />

          <Separator style={styles.separator} />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>{'Gas Price'}</Text>
            <Text style={styles.totalLabel}>
              {numberWithCommas(parseFloat(Number(gasLimit).toFixed(6)))}
            </Text>
          </View>

          {detailsRender(
            translate('common.total'),
            numberWithCommas(parseFloat(Number(totalAmount).toFixed(4))) +
              ' ' +
              baseCurrency,
          )}

          <AppButton
            label={translate('wallet.common.next')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              if (selectedMethod == 0) {
                onRequestClose();
                console.log('1.1----selectedMethod -');
                navigation.navigate('WalletPay', {
                  price: totalAmount,
                  chainType: chain || 'bsc',
                  baseCurrency,
                  id,
                  collectionAddress,
                });
              }
            }}
          />
        </View>
        <SafeAreaView style={{backgroundColor: Colors.white}} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(95, 148, 255, 0.7)',
  },
  emptyArea: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    padding: '4%',
    borderTopLeftRadius: wp('4%'),
    borderTopRightRadius: wp('4%'),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.iconBg,
    margin: 0,
  },
  title: {
    fontFamily: Fonts.ARIAL_BOLD,
    fontSize: RF(2),
    alignSelf: 'center',
    marginVertical: wp('3%'),
  },
  optionContainer: {
    backgroundColor: Colors.WHITE3,
    borderRadius: wp('1%'),
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  separator: {
    width: wp('100%'),
    marginVertical: hp('2%'),
  },
  totalLabel: {
    fontSize: RF(1.9),
    fontFamily: Fonts.ARIAL,
  },
  value: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
    width: wp('68%'),
    textAlign: 'right',
  },
  gasPrice: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
    textAlign: 'right',
  },
});

export default PaymentMethod;
