import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import { hp, RF } from '../constants/responsiveFunct';
import { convertCurrency } from '../store/reducer/walletReducer';

const PriceText = props => {
  const [price, setPrice] = useState()
  const { selectedCurrency } = useSelector(state => state.CurrencyReducer);
  let textColor = { color: props.isWhite ? Colors.white : Colors.black };

  useEffect(() => {
    getPrice()
  }, [props.price]);

  const getPrice = () => {
    console.log('selectedCurrency.currency_name', selectedCurrency?.currency_name)
    if (selectedCurrency?.currency_id === 1) {
      setPrice(props.price)
    } else {
      if (props.price > 0) {
        convertCurrency(props.price, 'USD', selectedCurrency?.currency_name)
          .then(price => {
            setPrice(price)
          }).catch(err => {
            console.log('Error from conversion api', err)
            setPrice('0.00')
          });
      } else {
        setPrice('0.00')
      }
    }
  }

  return (
    <View style={[styles.paymentCont, props.containerStyle]}>
      {props?.isDollar && <Text style={[styles.paymentTxt, textColor]}>{selectedCurrency?.currency_sign}</Text>}
      <NumberFormat
        // value={props.price || '0.00'}
        value={price}
        displayType={'text'}
        decimalScale={2}
        thousandSeparator={true}
        renderText={formattedValue => (
          <Text numberOfLines={1} style={[styles.paymentTxt, textColor]}>
            {formattedValue}
          </Text>
        )} // <--- Don't forget this!
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paymentCont: {
    flexDirection: 'row',
    ...CommonStyles.center,
    marginVertical: hp('1%'),
  },
  paymentTxt: {
    fontSize: RF(4),
    fontFamily: Fonts.ARIAL,
    fontWeight: 'bold',
    // marginLeft: wp('2%'),
  },
  unitTxt: {
    fontSize: RF(3),
    fontFamily: Fonts.ARIAL,
    marginTop: hp('1.5%'),
  },
});

export default PriceText;
