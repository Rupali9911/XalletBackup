import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Config from 'react-native-config';
import { useDispatch, useSelector } from 'react-redux';

import { Heading, ZipcodeInput } from './screenComponents';
import { hp, wp, RF } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { translate } from '../../walletUtils';
import { CardNumberInput, DateInput, CvvInput } from '../../components/cardInput';
import Checkbox from '../../components/checkbox';
import { LabelInput, CityInput } from './screenComponents';
import CountryPicker from '../../components/countryPicker';
import StatePicker from '../../components/statePicker';
import { modalAlert } from '../../common/function';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import KeyboardAwareScrollView from '../../components/keyboardAwareScrollView';
import AppButton from '../../components/appButton';
import { StripeApiRequest } from '../../helpers/ApiRequest';
import { addCard } from '../../store/reducer/paymentReducer';
import { StackActions } from '@react-navigation/routers';
import { signOut } from '../../store/reducer/userReducer';

function AddCard({ route, navigation }) {

    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.UserReducer);
    // const { loading } = useSelector(state => state.PayReducer);
    const { myCards } = useSelector(state => state.PaymentReducer);

    const [cardNumber, setCardNumber] = useState("");
    const [expDate, setExpDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState(null);
    const [cardHolderName, setCardHolderName] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [isDefault, setDefault] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidCardNumber = () => {
        if (cardNumber.length == 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.reuiredCardNumber")
            );
            return false;
        }
        else if (cardNumber.length < 12) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.invalidCardNumber")
            );
            return false;
        }
        return true;
    }

    const isValidName = () => {
        if (cardHolderName.trim().length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.nameRequired")
            );
            return false;
        }
        return true;
    }

    const isValidDate = () => {
        const exp = expDate.split('/');
        if (exp.length != 2) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.inValidExpiryDate")
            );
            return false;
        } else if (exp[1].length !== 2) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.inValidExpiryDate")
            );
            return false;
        }
        return true;
    }

    const isValidCvv = () => {
        if (cvv.length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.inValidCvv")
            );
            return false;
        } else if (cardType.code.size !== cvv.length) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.inValidCvv")
            );
            return false;
        }
        return true;
    }

    const isValidEmail = () => {
        var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.emailRequired")
            );
            return false;
        } else if (!filter.test(email)) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.invalidEmail")
            );
            return false;
        }
        return true;
    }

    const isValidAddress = () => {
        if (address.trim().length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.requireAddress")
            );
            return false;
        }
        return true;
    }

    const isValidCountry = () => {
        if (!country) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.requireCountry")
            );
            return false;
        }
        return true;
    }

    const isValidState = () => {
        if (state === null || state.trim().length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.requireState")
            );
            return false;
        }
        return true;
    }

    const isValidCity = () => {
        if (city.trim().length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.requireCity")
            );
            return false;
        }
        return true;
    }

    const isValidZipcode = () => {
        if (zipcode.trim().length <= 0) {
            modalAlert(
                translate("wallet.common.alert"),
                translate("wallet.common.error.requireZipcode")
            );
            return false;
        }
        return true;
    }

    const validateInputs = () => {
        if (
            isValidCardNumber() &&
            isValidName() &&
            isValidDate() &&
            isValidCvv() &&
            isValidEmail() &&
            isValidAddress() &&
            isValidCountry() &&
            isValidState() &&
            isValidCity() &&
            isValidZipcode()
        ) {
            getCardToken();
        }
    }

    const getCardToken = () => {
        setLoading(true);
        const body = {
            "card[number]": cardNumber,
            "card[exp_month]": expDate.split('/')[0],
            "card[exp_year]": expDate.split('/')[1],
            "card[cvc]": cvv,
            "card[name]": cardHolderName,
            "card[address_line1]": address,
            "card[address_line2]": "",
            "card[address_city]": city,
            "card[address_state]": state,
            "card[address_zip]": zipcode,
            "card[address_country]": country.name
        }

        StripeApiRequest(`tokens`, body).then((response) => {
            if (response.id) {
                addCustomerCard(response.id);
            } else if (response.error) {
                console.log("error_code", response.error.code)
                modalAlert(
                    translate("wallet.common.alert"),
                    translate(`wallet.common.stripeError.${response.error.code}`)
                )
                setLoading(false);
            }
        }).catch((err) => {
            console.log(err);
            if (err.error) {
                console.log("error_code1", response.error.code)
            }
            setLoading(false);
        });
    }

    const addCustomerCard = (tokenId) => {
        const params = {
            "tokenId": tokenId,
            "email": email,
            "userName": cardHolderName,
            "addressLine1": address,
            "addressLine2": "",
            "city": city,
            "state": state,
            "zip": zipcode,
            "country": country.name
        }

        dispatch(addCard(userData.access_token, params)).then((response) => {
            setLoading(false);
            if (response.success) {
                modalAlert(
                    translate("wallet.common.alert"),
                    response.msg_key ? translate(response.msg_key) : response.data.message === 'user card saved' ? translate("common.cardSaved") : response.data.message,
                    //response.msg_key?translate(response.msg_key):response.data.message ,
                    () => {
                        // navigation.goBack()
                        if (myCards.length < 1) {
                            navigation.dispatch(StackActions.replace('Cards', { price: route?.params?.price, isCardPay: route?.params?.isCardPay }));
                        } else {
                            navigation.goBack();
                        }
                    }
                )
            } else {
                modalAlert(
                    translate("wallet.common.alert"),
                    response.error_code ? translate(response.error_code) : response.msg
                )
            }
        }).catch((err) => {
            console.log('err', err);
            setLoading(false);
            if (err.message === 'Unauthorized!') {
                modalAlert(
                    translate("wallet.common.alert"),
                    translate('common.sessionexpired')
                )
                dispatch(signOut());
            } else {
                modalAlert(
                    translate("wallet.common.alert"),
                    translate(`common.${err.error?.error_code ? err.error?.error_code
                        : err.error?.decline_code ?
                            err.error?.decline_code
                            : err.error?.code}`))

                // modalAlert(
                //     translate("wallet.common.alert"),
                //     err.error_code?translate(`common.${err.error_code}`):''
                // )
            }
        });

    }

    return (
        <AppBackground isBusy={loading}>
            <AppHeader
                showBackButton={true}
                title={translate("wallet.common.topup.addCardDetails")}
            />
            <KeyboardAwareScrollView style={[CommonStyles.screenContainer]} contentContainerStyle={{ paddingBottom: wp("10%") }}>

                <Text style={styles.cardHint} >{translate("wallet.common.topup.cardDetailWarning")}</Text>

                <CardNumberInput
                    style={styles.inputCont}
                    // containerStyle={}
                    onSubmitEditing={() => null}
                    value={cardNumber}
                    onChangeText={e => setCardNumber(e)}
                    placeholder={'0000 1111 2222 3333'}
                    onCardType={(type) => setCardType(type)}
                />

                <LabelInput
                    label={translate("wallet.common.topup.cardHolderName")}
                    value={cardHolderName}
                    onChangeText={setCardHolderName}
                />

                <View style={styles.rowContainer}>
                    <DateInput
                        onChangeText={e => setExpDate(e)}
                        value={expDate}
                        style={styles.dateContainer} />

                    <CvvInput
                        onChangeText={e => setCvv(e)}
                        value={cvv}
                        style={styles.dateContainer}
                        length={cardType ? cardType.code.size : 0} />
                </View>

                {/* <View style={styles.checkBoxContainer}>
                    <Checkbox
                        label={translate("wallet.common.topup.markAsDefault")}
                        labelStyle={styles.checkBoxLabel}
                        onChecked={(check) => setDefault(check)}
                        isCheck={isDefault}
                    />
                </View> */}

                <Heading title={translate("wallet.common.topup.billingAddress")} />

                <LabelInput
                    label={translate("wallet.common.topup.email")}
                    value={email}
                    onChangeText={setEmail}
                />

                <LabelInput
                    label={translate("common.address")}
                    value={address}
                    onChangeText={setAddress}
                />

                <View style={styles.rowContainer}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.labelStyle}>{translate("wallet.common.topup.country")}</Text>
                        <CountryPicker onSetCountry={setCountry} />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text style={styles.labelStyle}>{translate("wallet.common.topup.state")}</Text>
                        <StatePicker country={country.code} onSetState={setState} />
                    </View>
                </View>

                <View style={styles.rowContainer}>
                    <CityInput
                        label={translate("wallet.common.topup.city")}
                        value={city}
                        onChangeText={setCity}
                        containerStyle={styles.rowItem}
                    />
                    <ZipcodeInput
                        label={translate("wallet.common.topup.zipcode")}
                        value={zipcode}
                        onChangeText={setZipcode}
                        containerStyle={styles.rowItem}
                    />
                </View>

            </KeyboardAwareScrollView>

            <View style={styles.buttonContainer}>
                <AppButton label={translate("wallet.common.topup.next")} containerStyle={[CommonStyles.button, styles.button]} labelStyle={[CommonStyles.buttonLabel, { fontWeight: 'bold' }]} onPress={() => {
                    // getCardToken();
                    validateInputs();
                }} />
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
        justifyContent: 'space-between',
    },
    dateContainer: {
        width: wp("40%"),
    },
    checkBoxContainer: {
        width: "100%",
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
    buttonContainer: {
        padding: wp("5%"),
        paddingVertical: 0
    }
})

export default AddCard;
