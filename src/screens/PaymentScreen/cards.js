import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {formatWithMask, Masks} from 'react-native-mask-input';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {CardItem} from './screenComponents';
import {hp, wp, RF} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {translate} from '../../walletUtils';
import CardView from '../../components/cardView';
import ImagesSrc from '../../constants/Images';
import {confirmationAlert, alertWithSingleBtn} from '../../common/function';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import AppButton from '../../components/appButton';
import Separator from '../../components/separator';
import {
  setPaymentObject,
  getAllCards,
  deleteCard,
} from '../../store/reducer/paymentReducer';
import {Button} from 'react-native-paper';
import { numberWithCommas } from '../../utils';

const PriceBtns = props => {
  return (
    <TouchableOpacity style={styles.priceBtnsCont}>
      <Text style={styles.priceBtnsTxt}>{props.label}</Text>
    </TouchableOpacity>
  );
};

const Cards = ({route, navigation}) => {
  const {data} = useSelector(state => state.UserReducer);
  const {paymentObject, myCards} = useSelector(state => state.PaymentReducer);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [cards, setCards] = useState([]);
  const [defaultCard, _setDefaultCard] = useState(route.params.defaultCard);
  const [loading, setLoading] = useState(false);

  const {price, isCardPay} = route.params;

  useEffect(() => {
    if (isFocused) {
      getAllMyCards();
      //_setDefaultCard(cards[0]);
    }
  }, [isFocused]);

  useEffect(() => {
    if (paymentObject) {
      _setDefaultCard(paymentObject.item);
    }
  }, [paymentObject]);

  const getAllMyCards = () => {
    // setLoading(true);
    dispatch(getAllCards(data.token))
      .then(cards => {
        if (cards.length <= 0) {
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('err', err);
        setLoading(false);
      });
  };

  const deleteCardById = id => {
    const params = {
      customerCardId: id,
    };
    console.log('params', params);
    setLoading(true);
    dispatch(deleteCard(data.token, params))
      .then(response => {
        console.log('delete response', response);
        if (response.success) {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            response.msg_key ? translate(response.msg_key) : response.msg,
          );
          getAllMyCards();
        } else {
          setLoading(false);
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            response.msg_key ? translate(response.msg_key) : response.msg,
          );
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <AppBackground isBusy={loading}>
      <AppHeader
        showBackButton={true}
        title={translate('wallet.common.topup.yourCards')}
        showRightButton
        rightButtonComponent={
          <Image
            source={ImagesSrc.addIcon}
            style={[
              CommonStyles.imageStyles(5),
              {tintColor: Colors.themeColor},
            ]}
          />
        }
        onPressRight={() => {
          navigation.navigate('AddCard');
        }}
      />
      <KeyboardAwareScrollView>
        {/* <Text style={styles.cardHint} >{"The linking of commercial networks and enterprises "}</Text> */}

        {/* {defaultCard && */}
        <CardView details={defaultCard} />
        {/* } */}

        <FlatList
          style={styles.cardList}
          data={myCards}
          renderItem={({item, index}) => {
            return (
              <CardItem
                isCheck={
                  defaultCard && defaultCard.id === item.id ? true : false
                }
                details={item}
                onSelect={() => {
                  // dispatch(SetDefaultCard({ cardId: item.id }, data.token)).then((response) => {
                  //     if (response.success) {
                  //         _setDefaultCard(item);
                  //     }
                  // }).catch((err) => {
                  //     console.log('err', err);
                  // });
                  _setDefaultCard(item);
                }}
                onDelete={card => {
                  confirmationAlert(
                    translate('wallet.common.alert'),
                    translate('wallet.common.confirmDeleteCard'),
                    translate('wallet.common.cancel'),
                    translate('wallet.common.confirm'),
                    () => deleteCardById(card.id),
                    () => null,
                  );
                }}
              />
            );
          }}
          keyExtractor={(item, index) => `${item.id}`}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          ListEmptyComponent={() => (
            <View style={{marginTop: hp('5%')}}>
              <Button
                mode={'text'}
                uppercase={false}
                color={Colors.themeColor}
                labelStyle={{fontSize: RF(2), fontFamily: Fonts.ARIAL}}
                onPress={() => navigation.navigate('AddCard')}>
                {translate('wallet.common.topup.addYourCard')}
              </Button>
            </View>
          )}
        />
      </KeyboardAwareScrollView>
      {isCardPay && (
        <>
          <Separator style={styles.separator} />
          <View style={styles.totalContainer}> 
            <Text style={styles.totalLabel}>
              {translate('wallet.common.totalAmount')}
            </Text>
            <Text style={styles.value}>$ {numberWithCommas(parseFloat(Number(price).toFixed(2)))}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <AppButton
              label={translate('wallet.common.next')}
              containerStyle={CommonStyles.button}
              labelStyle={CommonStyles.buttonLabel}
              onPress={() => {
                // navigation.navigate("AddCard")
                if (defaultCard) {
                  console.log("4-Default card selected",defaultCard);
                  dispatch(
                    setPaymentObject({
                      item: defaultCard,
                      type: 'card',
                    }),
                  );
                  navigation.goBack();
                }
              }}
              view={myCards.length == 0 || !defaultCard}
            />
          </View>
        </>
      )}
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  inputCont: {
    marginTop: hp('8%'),
  },
  content: {
    paddingHorizontal: wp('7%'),
    paddingTop: hp('5%'),
    paddingBottom: hp('1%'),
  },
  priceBtnsCont: {
    borderWidth: 1,
    height: hp('4.5%'),
    ...CommonStyles.center,
    borderColor: Colors.scanActive,
    paddingHorizontal: wp('3%'),
    marginHorizontal: wp('0.5%'),
    borderRadius: wp('1%'),
  },
  priceBtnsTxt: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.scanActive, RF(1.7)),
  },
  cardCont: {
    borderWidth: 1,
    borderColor: Colors.scanActive,
    borderRadius: wp('2%'),
    width: wp('85%'),
    alignSelf: 'center',
    paddingTop: hp('6%'),
    paddingBottom: hp('4%'),
    paddingLeft: wp('30%'),
    paddingRight: wp('5%'),
    marginVertical: hp('1%'),
  },
  cardTitle: {
    ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.black, RF(1.8)),
  },
  cardDes: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.cardDes, RF(1.45)),
  },
  cardHint: {
    ...CommonStyles.text(Fonts.ARIAL, Colors.cardDes, RF(1.8)),
    alignSelf: 'center',
    width: wp('80%'),
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  dateContainer: {
    width: wp('39%'),
  },
  checkBoxContainer: {
    width: wp('85%'),
    alignSelf: 'center',
  },
  checkBoxLabel: {
    fontWeight: 'normal',
  },
  labelInputContainer: {
    marginTop: hp('1%'),
  },
  placeholderStyle: {
    width: wp('85%'),
    fontSize: RF(1.6),
    alignSelf: 'center',
  },
  pickerContainer: {
    width: wp('39%'),
    marginTop: hp('1%'),
  },
  rowItem: {
    width: wp('39%'),
  },
  cardList: {
    width: wp('100%'),
    // paddingHorizontal: wp("2.5%"),
    // paddingVertical: wp("2%"),
    alignSelf: 'center',
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBackground,
    padding: wp('2%'),
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
  },
  number: {
    marginHorizontal: wp('5%'),
    fontSize: RF(1.9),
  },
  itemCardType: {
    backgroundColor: Colors.white,
    padding: wp('1%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  separator: {
    height: hp('3%'),
  },
  buttonContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: 0,
  },
  totalContainer: {
    paddingHorizontal: wp('5%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
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
});

export default Cards;
