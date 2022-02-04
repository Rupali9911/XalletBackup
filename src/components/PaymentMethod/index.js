import React, {useState} from 'react';
import {
  Image,
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
import NotEnoughGold from './alertGoldModal';
import {useSelector} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import {IconButton} from 'react-native-paper';

const PaymentMethod = props => {
  const navigation = useNavigation();
  const {myCards} = useSelector(state => state.PaymentReducer);

  const {
    visible,
    onRequestClose,
    price,
    priceStr,
    priceInDollar,
    chain,
    payableIn,
    baseCurrency,
    allowedTokens,
    id,
    ownerAddress,
    collectionAddress,
  } = props;
  const [opacity, setOpacity] = useState(0.88);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [notEnoughGoldVisible, setNotEnoughGoldVisible] = useState(false);

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
            {/* <Image style={styles.closeIcon} source={ImagesSrc.cancelIcon} /> */}
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
            buttons={[
              {
                text: translate('wallet.common.payByCreditCard'),
                icon: ImagesSrc.cardPay,
                onPress: () => {
                  setSelectedMethod(0);
                },
              },
              {
                text: translate('wallet.common.payByWallet'),
                icon: ImagesSrc.walletPay,
                onPress: () => {
                  setSelectedMethod(1);
                },
              }
              // ,
              // {
              //   text: translate('wallet.common.payByGold'),
              //   icon: ImagesSrc.goldPay,
              //   onPress: () => {
              //     setSelectedMethod(2);
              //   },
              // },
            ]}
            style={styles.optionContainer}
            selectable
            selectedIndex={selectedMethod}
            separatorColor={Colors.white}
          />

          <Separator style={styles.separator} />

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>
              {translate('wallet.common.totalAmount')}
            </Text>
            <Text style={styles.value}>{price}</Text>
          </View>

          {selectedMethod == 2 && (
            <Text style={styles.goldValue}>
              <Image source={ImagesSrc.goldcoin} /> {price}
            </Text>
          )}

          <AppButton
            label={translate('wallet.common.next')}
            containerStyle={CommonStyles.button}
            labelStyle={CommonStyles.buttonLabel}
            onPress={() => {
              if (selectedMethod == 0) {
                onRequestClose();
                if (myCards.length > 0) {
                  navigation.navigate('Cards', {price: priceInDollar});
                } else {
                  // navigation.navigate('Cards', { price });
                  navigation.navigate('AddCard', {price: priceInDollar});
                }
              } else if (selectedMethod == 2) {
                setNotEnoughGoldVisible(true);
              } else if (selectedMethod == 1) {
                onRequestClose();
                navigation.navigate('WalletPay', {
                  price,
                  priceStr,
                  chainType: chain || 'binance',
                  baseCurrency,
                  allowedTokens,
                  id,
                  collectionAddress,
                  ownerAddress,
                  payableIn,
                });
              }
            }}
          />
        </View>
        <SafeAreaView style={{backgroundColor: Colors.white}} />
      </View>
      <NotEnoughGold
        visible={notEnoughGoldVisible}
        onNavigate={() => {
          onRequestClose();
          setNotEnoughGoldVisible(false);
        }}
        onRequestClose={() => {
          setNotEnoughGoldVisible(false);
        }}
      />
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
  },
  goldValue: {
    fontSize: RF(2.3),
    fontFamily: Fonts.ARIAL_BOLD,
    color: Colors.themeColor,
    alignSelf: 'flex-end',
    marginBottom: hp('1%'),
  },
});

export default PaymentMethod;
