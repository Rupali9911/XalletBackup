import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { formatWithMask, Masks } from 'react-native-mask-input';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import { CardItem } from './screenComponents';
import { hp, wp, RF } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import {translate} from '../../walletUtils';
import CardView from '../../components/cardView';
import ImagesSrc from '../../constants/Images';
import { confirmationAlert, alertWithSingleBtn } from '../../common/function';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import AppButton from '../../components/appButton';

const PriceBtns = (props) => {
    return (
        <TouchableOpacity style={styles.priceBtnsCont} >
            <Text style={styles.priceBtnsTxt} >{props.label}</Text>
        </TouchableOpacity>
    )
}

const Cards = ({ route, navigation }) => {

    const { data } = useSelector(state => state.AuthReducer);
    // const { loading } = useSelector(state => state.PayReducer);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const [cards, setCards] = useState([
        {
            "id": "card_1JhSqxIBLEGUTX48P0VWmStl",
            "object": "card",
            "address_city": "New York",
            "address_country": "United States of America",
            "address_line1": "US",
            "address_line1_check": "pass",
            "address_line2": "US",
            "address_state": "New York",
            "address_zip": "12345",
            "address_zip_check": "pass",
            "brand": "Visa",
            "country": "US",
            "customer": "cus_KMBDtHC2mzDtU3",
            "cvc_check": "pass",
            "dynamic_last4": null,
            "exp_month": 2,
            "exp_year": 2022,
            "fingerprint": "moSD3wU6Bcdgqtak",
            "funding": "credit",
            "last4": "4242",
            "metadata": {},
            "name": "Robert",
            "tokenization_method": null
        }
    ]);
    const [defaultCard, _setDefaultCard] = useState(route.params.defaultCard);

    useEffect(()=>{
        if(isFocused){
            // getAllMyCards();
            // getDefaultCard();
        }
    },[isFocused]);

    const getAllMyCards = () => {
        // dispatch(GetAllCards(data.token)).then((response)=>{
        //     if(response.success){
        //         console.log('response for GetAllCards', response, response.data.data)
        //         if (response.data && response.data.data && response.data.data.length  === 0) {
        //             _setDefaultCard(null)
        //         }
        //         setCards(response.data.data);
        //     }
        // }).catch((err)=>{
        //     console.log('err',err);
        // });
    }

    const getDefaultCard = () => {
        // dispatch(GetDefaultCard(data.token)).then((response)=>{
        //     console.log('response for GetDefaultCard',response.data)
        //     if(response.success){
        //         _setDefaultCard(response.data);
        //     }else{
        //         _setDefaultCard(null);
        //     }
        // }).catch((err)=>{
        //     console.log('err',err);
        // });
    }

    const deleteCardById = (id) => {
        const params = {
            cardId: id
        }
        console.log('params',params);
        // dispatch(deleteCard(params, data.token)).then((response)=>{
        //     console.log('delete response',response);
        //     if(response.success){
        //         alertWithSingleBtn(
        //             translate("common.alert"),
        //             response.msg_key?translate(response.msg_key):response.msg
        //         )
        //         getAllMyCards();
        //     }else{
        //         alertWithSingleBtn(
        //             translate("common.alert"),
        //             response.msg_key?translate(response.msg_key):response.msg
        //         )
        //     }
        // }).catch((err)=>{
        //     console.log(err);
        // })
    }

    return (
        <AppBackground>
            <AppHeader
                showBackButton={true}
                title={translate("wallet.common.topup.yourCards")}
                showRightButton
                rightButtonComponent={<Image source={ImagesSrc.addIcon} style={[CommonStyles.imageStyles(5), {tintColor: Colors.themeColor}]}/>}
            />
            <KeyboardAwareScrollView>

                {/* <Text style={styles.cardHint} >{"The linking of commercial networks and enterprises "}</Text> */}

                {/* {defaultCard && */}
                     <CardView details={defaultCard}/>
                {/* } */}

                <FlatList
                    style={styles.cardList}
                    data={cards}
                    renderItem={({item, index}) => {
                        return (
                            <CardItem
                                isCheck={defaultCard && defaultCard.id === item.id ? true : false}
                                details={item}
                                onSelect={() => {
                                    // dispatch(SetDefaultCard({ cardId: item.id }, data.token)).then((response) => {
                                    //     if (response.success) {
                                    //         _setDefaultCard(item);
                                    //     }
                                    // }).catch((err) => {
                                    //     console.log('err', err);
                                    // });
                                }}
                                onDelete = {(card)=>{
                                    confirmationAlert(
                                        translate("wallet.common.alert"),
                                        translate("wallet.common.confirmDeleteCard"),
                                        translate("wallet.common.cancel"),
                                        translate("wallet.common.confirm"),
                                        () => deleteCardById(card.id),
                                        () => null
                                    );
                                }}
                            />
                        );
                    }}
                    ItemSeparatorComponent={()=>{
                        return (
                            <View style={styles.separator}/>
                        );
                    }}
                    />

            </KeyboardAwareScrollView>

            <View style={styles.buttonContainer}>
                <AppButton label={translate("wallet.common.topup.addYourCard")} containerStyle={[CommonStyles.outlineButton, styles.button]} labelStyle={CommonStyles.outlineButtonLabel} onPress={() => navigation.navigate("AddCard")} />
            </View>

        </AppBackground>

    )
}

const styles = StyleSheet.create({
    inputCont: {
        marginTop: hp("8%")
    },
    content: {
        paddingHorizontal: wp('7%'),
        paddingTop: hp("5%"),
        paddingBottom: hp("1%")
    },
    priceBtnsCont: {
        borderWidth: 1,
        height: hp('4.5%'),
        ...CommonStyles.center,
        borderColor: Colors.scanActive,
        paddingHorizontal: wp("3%"),
        marginHorizontal: wp('0.5%'),
        borderRadius: wp('1%')
    },
    priceBtnsTxt: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.scanActive, RF(1.7))
    },
    cardCont: {
        borderWidth: 1,
        borderColor: Colors.scanActive,
        borderRadius: wp("2%"),
        width: wp("85%"),
        alignSelf: "center",
        paddingTop: hp("6%"),
        paddingBottom: hp("4%"),
        paddingLeft: wp("30%"),
        paddingRight: wp('5%'),
        marginVertical: hp("1%")
    },
    cardTitle: {
        ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.black, RF(1.8))
    },
    cardDes: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.cardDes, RF(1.45))
    },
    cardHint: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.cardDes, RF(1.8)),
        alignSelf: 'center',
        width: wp("80%"),
        textAlign: 'center'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    dateContainer: {
        width: wp("39%"),
    },
    checkBoxContainer: {
        width: wp("85%"),
        alignSelf: 'center'
    },
    checkBoxLabel: {
        fontWeight: 'normal'
    },
    labelInputContainer: {
        marginTop: hp("1%")
    },
    placeholderStyle: {
        width: wp('85%'),
        fontSize: RF(1.6),
        alignSelf: "center"
    },
    pickerContainer: {
        width: wp("39%"),
        marginTop: hp("1%")
    },
    rowItem: {
        width: wp("39%"),
    },
    cardList: {
        width: wp("90%"),
        paddingHorizontal: wp("2.5%"),
        paddingVertical: wp("2%"),
        alignSelf: 'center'
    },
    cardItem: {
        flexDirection: 'row',
        backgroundColor: Colors.inputBackground,
        padding: wp("2%"),
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center'
    },
    number: {
        marginHorizontal: wp("5%"),
        fontSize: RF(1.9)
    },
    itemCardType: {
        backgroundColor: Colors.white,
        padding: wp("1%"),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    separator: {
        height: hp("3%")
    },
    buttonContainer: {
        padding: wp("5%"),
        paddingBottom: 0
    }
})

export default Cards;
