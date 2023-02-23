import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import { hp, RF, wp } from '../constants/responsiveFunct';
import sendRequest from '../helpers/AxiosApiRequest';

const PriceText = props => {
  const [price, setPrice]= useState()
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  let textColor = { color: props.isWhite ? Colors.white : Colors.black };

  useEffect(() => {
    getPrice()
  }, [props.price]);

  const getPrice = () => {
    if (selectedLanguageItem.language_name === 'en') {
      setPrice(props.price)
    } else {
      if (props.price > 0){
        let amount = props.price;
        let symbol = 'usd';
        let convert = 'jpy'
        let CMC_PRO_API_KEY = '67c4c255-a649-49df-9e23-5d58ec5f5d24'
        let url = `https://pro-api.coinmarketcap.com/v2/tools/price-conversion`;
        sendRequest({
          url,
          method: 'GET',
          params: {
            amount,
            symbol,
            convert,
            CMC_PRO_API_KEY,
          },
        })
          .then(res => {
              console.log('Response of conversion api', res)
              console.log('Response of conversion api',  res?.data[0]?.amount)

              setPrice(res?.data[0]?.amount)
          })
          .catch(err => {
            console.log('Error from conversion api', err)
            setPrice('0.00')
          });
      }else{
        setPrice('0.00')                   
      }
    }
  }

  return (
    <View style={[styles.paymentCont, props.containerStyle]}>
      {props?.isDollar && <Text style={[styles.paymentTxt, textColor]}>$</Text>}
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
