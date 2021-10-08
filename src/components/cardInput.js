import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import MaskInput, {Masks} from 'react-native-mask-input';
import CreditCardType from 'credit-card-type';
import Entypo from 'react-native-vector-icons/Entypo';

import { RF, wp, hp } from '../constants/responsiveFunct';
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import CommonStyles from "../constants/styles";

import ButtonInputContainer from './buttonInputContainer';
import ImagesSrc from '../constants/Images';
import { translate } from '../walletUtils';



const CardNumberInput = (props) => {

    const [cardIcon, setCardIcon] = useState(ImagesSrc.cardTypeIcon.unknown);

    return (
        <View style={props.style}>
            <Text style={[styles.numberLabelStyle]}>{translate("wallet.common.topup.cardNumber")}</Text>
            <ButtonInputContainer view={true} containerStyle={[props.containerStyle]} isGreyBg={props.isGreyBg} >
                {
                    props.showLeftComponent && props.leftComponent
                }
                <MaskInput
                    value={props.value}
                    onChangeText={(masked, unmasked, obfuscated) => {
                        if(unmasked.length>0){
                            const cardType = CreditCardType(unmasked);
                            console.log('cardType',cardType);
                            if(cardType.length>0){
                                setCardIcon(ImagesSrc.cardTypeIcon[cardType[0].type]);
                                props.onCardType && props.onCardType(cardType[0]);
                            }
                        }else{
                            setCardIcon(ImagesSrc.cardTypeIcon.unknown);
                        }
                        props.onChangeText && props.onChangeText(unmasked);
                    }}
                    mask={(text) => {
                        return Masks.CREDIT_CARD
                    }}
                    placeholder={props.placeholder}
                    keyboardType={'numeric'}
                    underlineColorAndroid={Colors.transparent}
                    placeholderTextColor={Colors.titleColor}
                    style={[styles.input, props.inputStyle]}
                />
                <Image source={cardIcon}/>
            </ButtonInputContainer>
        </View>
    )
}

const DateInput = (props) => {
    return (
        <View style={props.style}>
            <Text style={styles.labelStyle}>{translate("wallet.common.topup.expiryDate")}</Text>
            <ButtonInputContainer view={true} containerStyle={[props.containerStyle]} isGreyBg={props.isGreyBg} >
                <MaskInput
                    value={props.value}
                    onChangeText={(masked, unmasked, obfuscated) => {
                        let month = masked.split('/');
                        console.log('month',month);
                        if(month[0] == '' || parseInt(month[0])<=12){
                            props.onChangeText && props.onChangeText(masked);
                        }
                    }}
                    mask={(text) => {
                        return [/[0-1]/, /\d/, '/', /\d/, /\d/];
                    }}
                    placeholder={"MM/YY"}
                    keyboardType={'numeric'}
                    underlineColorAndroid={Colors.transparent}
                    placeholderTextColor={Colors.titleColor}
                    style={[styles.input, props.inputStyle]}
                />
            </ButtonInputContainer>
        </View>
    );
}

const CvvInput = (props) => {

    const [hide, setHide] = useState(true);

    const getMask = () => {
        var mask = []
        for(let i = 0; i < props.length; i++){
            mask.push([/\d/]);
        }
        console.log('mask',mask);
        return mask;
    }

    return (
        <View style={props.style}>
            <Text style={styles.labelStyle}>{translate("wallet.common.topup.cvv")}</Text>
            <ButtonInputContainer view={true} containerStyle={[props.containerStyle]} isGreyBg={props.isGreyBg} >
                <MaskInput
                    value={props.value}
                    onChangeText={(masked, unmasked, obfuscated) => {
                        props.onChangeText && props.onChangeText(unmasked);
                    }}
                    mask={getMask()}
                    obfuscationCharacter={'X'}
                    showObfuscatedValue={hide}
                    placeholder={"CVV"}
                    keyboardType={'numeric'}
                    underlineColorAndroid={Colors.transparent}
                    placeholderTextColor={Colors.titleColor}
                    style={[styles.input, props.inputStyle]}
                />
                <TouchableOpacity onPress={()=>{setHide(!hide)}}>
                    <Entypo name={hide?'eye-with-line':'eye'} size={20}/>
                </TouchableOpacity>
            </ButtonInputContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.titleColor, RF(1.9)),
        padding: 0,
        flex: 1,
    },
    error: {
        ...CommonStyles.text(Fonts.ARIAL, Colors.danger, RF(1.6)),
        width: "85%",
        alignSelf: "center"
    },
    numberLabelStyle: {
        width: "100%",
        alignSelf: 'center',
    },
    labelStyle: {
        flex: 1,
        marginTop: hp("1%")
    }
})

export {
    CardNumberInput,
    DateInput,
    CvvInput
};
