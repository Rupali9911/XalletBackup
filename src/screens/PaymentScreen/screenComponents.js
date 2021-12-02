import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import NumberFormat from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import MaskInput, { formatWithMask, Masks } from 'react-native-mask-input';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from "../../constants/Colors";
import ImagesSrc from "../../constants/Images";
import Fonts from "../../constants/Fonts";
import CommonStyles from "../../constants/styles";
import { RF, wp, hp } from '../../constants/responsiveFunct';
import {translate, CARD_MASK} from '../../walletUtils';
import Checkbox from '../../components/checkbox';
import AppInput from '../../components/appInput';
import ButtonInputContainer from '../../components/buttonInputContainer';

const ScanButtons = (props) => {
    return (
        <TouchableOpacity style={styles.scanContainer} onPress={props.onPress}>
            <Image source={props.image} style={[styles.imgScan, props.style]} />
            <Text style={[styles.txtScan, { color: props.active ? (props.activeColor ? props.activeColor : Colors.white) : (props.inactiveColor ? props.inactiveColor : Colors.unSelectedTxt) }]}>{props.label}</Text>
        </TouchableOpacity>
    )
}

export const ScanBottomView = (props) => {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <ScanButtons
                onPress={props.onLeftPress}
                image={props.leftIcon}
                label={props.leftLabel}
                active={props.leftActive}
                style={props.leftIconStyle}
                activeColor={props.activeColor}
                inactiveColor={props.inactiveColor}
                />
            <View style={[styles.vwDivider, props.dividerStyle]} />
            <ScanButtons
                onPress={props.onRightPress}
                image={props.rightIcon}
                label={props.rightLabel}
                style={props.rightIconStyle}
                active={props.rightActive}
                activeColor={props.activeColor}
                inactiveColor={props.inactiveColor}
            />
        </View>

    )
}

export const ProfileImage = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} disabled={props.view} style={[styles.profileCont, props.profileContStyle]} >
            <View style={[styles.imageCont, props.imageContStyle]} >
                <Image source={ImagesSrc.defaultProfile} style={styles.profileImage} />
            </View>
            <Text style={[styles.profileLabel, props.profileLabelStyle]} numberOfLines={2}>{props.label}</Text>
        </TouchableOpacity>
    )
}

export const PaymentField = (props) => {

    const {data} = useSelector((state) => state.AuthReducer);
    const dispatch = useDispatch();

    useEffect(
        () => {
            !props.isFromApplyToken ? getBalance() : null;
        },
        []
    )

    const getBalance = () => {
        if(!data) return;

        // dispatch(GetBalance(data.token)).then((res)=>{
        //     console.log('getUserBalance res',res);
        //     if(res.success){
        //         let user_data = data;
        //         user_data.balance = res.totalBalance;
        //         const userData = JSON.stringify({data: user_data, userName: user_data.userName});
        //         AsyncStorage.setItem('@userData', userData)
        //     }
        // }).catch(err=>{
        //     err && console.log(err);
        // })
    }

    return (
        <View style={[styles.inputMainCont, props.containerStyle]} >
            <AppInput
                containerStyle={styles.inputCont}
                showLeftComponent={true}
                leftComponent={<Text style={styles.inputLeft} >{translate("common.amount")}</Text>}
                showRightComponent={true}
                rightComponent={<Text style={styles.inputRight} >¥</Text>}
                inputStyle={styles.paymentField}
                keyboardType='decimal-pad'
                placeholder="0"
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}
                editable={props.editable}
            />
            <NumberFormat
                value={data && data.balance || "0"}
                displayType={'text'}
                thousandSeparator={true}
                decimalScale={2}
                renderText={formattedValue => <Text numberOfLines={1} style={[styles.inputBottom]} >{!props.isFromApplyToken ? translate("common.yourCurrentBalance",{balance: "¥"+formattedValue}) : 'Max Supply / 400,000 Token'}</Text>} // <--- Don't forget this!
            />
            <Text style={styles.inputBottom} ></Text>
        </View>
    )
}

export const LabelInput = (props) => {
    const { label, value, onChangeText, ...other } = props;
    return (
        <View style={styles.labelInputContainer}>
            <Text style={styles.labelStyle}>{label}</Text>
            <AppInput
                value={value}
                onChangeText={onChangeText}
                {...other}
            />
        </View>
    );
}

export const CityInput = (props) => {
    const { label, value, onChangeText, ...other } = props;
    return (
        <View style={styles.cityInputContainer}>
            <Text style={styles.cityZipcodeLabel}>{label}</Text>
            <AppInput
                value={value}
                onChangeText={onChangeText}
                {...other}
            />
        </View>
    );
}

export const ZipcodeInput = (props) => {
    const { label, value, onChangeText, ...other } = props;
    return (
        <View style={styles.zipcodeInputContainer}>
            <Text style={styles.cityZipcodeLabel}>{label}</Text>
            <ButtonInputContainer view={true} containerStyle={[props.containerStyle]} isGreyBg={props.isGreyBg} >
                <MaskInput
                    value={props.value}
                    onChangeText={(masked, unmasked, obfuscated) => {
                        props.onChangeText && props.onChangeText(unmasked);
                    }}
                    mask={[/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/]}
                    placeholder={""}
                    keyboardType={'numeric'}
                    underlineColorAndroid={Colors.transparent}
                    placeholderTextColor={Colors.titleColor}
                    style={[styles.input, props.containerStyle]}
                />
            </ButtonInputContainer>
        </View>
    );
}

export const Heading = (props) => {
    const { title, value, ...other } = props;
    return (
        <View style={[styles.headingStyle, props.style]}>
            <Text style={styles.titleStyle}>{title}</Text>
        </View>
    );
}

export const CardItem = (props) => {
    const {details, isCheck, onSelect, onDelete} = props;
    return (
        <View style={styles.cardItemContainer}>
            <View style={styles.cardItem} removeClippedSubviews={true}>
                <Checkbox isCheck={isCheck} onChecked={onSelect} iconSize={wp("5%")}/>
                <View style={styles.itemCardType}>
                    <Image source={ImagesSrc.cardTypeIcon[details.brand.replace(' ', '-').toLowerCase()]} resizeMode={'contain'}/>
                </View>
                <Text style={styles.number}>
                    {formatWithMask({
                        text: `424242424242${details.last4}`,
                        mask: CARD_MASK
                    }).obfuscated}
                </Text>
            </View>
            {onDelete
                ?
                <TouchableOpacity
                    style={styles.deleteIconContainer}
                    onPress={()=>onDelete(details)}>
                    <Image style={styles.deleteIcon} source={ImagesSrc.itemDelete} resizeMode={'contain'}/>
                </TouchableOpacity>
                :
                null}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: hp("6%"),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scanContainer: {
        flex: 1,
        ...CommonStyles.center
    },
    imgScan: {
        ...CommonStyles.imageStyles(10)
    },
    vwDivider: {
        width: 1,
        height: hp('7%'),
        backgroundColor: Colors.white
    },
    txtScan: {
        marginTop: hp("1%"),
        fontSize: RF(1.5),
        fontFamily: Fonts.ARIAL_BOLD
    },
    profileCont: {
        ...CommonStyles.center
    },
    imageCont: {
        ...CommonStyles.circle(16)
    },
    profileImage: {
        ...CommonStyles.fullImage
    },
    profileLabel: {
        marginTop: hp("2%"),
        fontSize: RF(1.8),
        textAlign: "center",
        color: Colors.nameTxt,
        fontFamily: Fonts.ARIAL
    },
    inputCont: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColorInput,
        paddingHorizontal: wp("1%")
    },
    inputLeft: {
        ...CommonStyles.text(Fonts.PINGfANG, Colors.inputLeftPayment, RF(1.2))
    },
    paymentField: {
        textAlign: "right",
        paddingHorizontal: wp("2%"),
        ...CommonStyles.text(Fonts.PINGfANG_SBOLD, Colors.black, RF(2.7))
    },
    inputRight: {
        ...CommonStyles.text(Fonts.PINGfANG_SBOLD, Colors.topUpfieldRight, RF(1.8)),
        marginTop: hp('0.5%')
    },
    inputBottom: {
        ...CommonStyles.text(Fonts.PINGfANG_SBOLD, Colors.inputBottomPayment, RF(1.6)),
        textAlign: "right",
        marginRight: wp("1%")
    },
    inputMainCont: {
        width: "85%",
        alignSelf: "center"
    },
    labelInputContainer: {
        marginTop: hp("1%")
    },
    labelStyle: {
        width: '100%',
        fontSize: RF(1.6),
        alignSelf: "center"
    },
    headingStyle: {
        width: "100%",
        alignSelf: 'center',
        marginTop: hp("2.5%"),
        marginBottom: hp("1%")
    },
    titleStyle: {
        fontFamily: Fonts.ARIAL_BOLD,
        fontSize: RF(1.7)
    },
    cityInputContainer: {
        marginTop: hp("1%"),
        width: wp("39%")
    },
    zipcodeInputContainer: {
        marginTop: hp("1%"),
        width: wp("39%")
    },
    cityZipcodeLabel: {
        width: wp('39%'),
        fontSize: RF(1.6),
        alignSelf: "center"
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
        marginHorizontal: wp("3%"),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    deleteIconContainer: {
        backgroundColor: Colors.white,
        padding: wp("1%"),
        position: 'absolute',
        right: wp("5%"),
        top: -wp("1%"),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.18,
        shadowRadius: 0.5,

        // elevation: 1,
    },
    deleteIcon: {
        width: Platform.select({ios: wp("3.5%"), android: wp("3.5%")}),
        height: Platform.select({ios: wp("3.5%"), android: wp("3.5%")}),
    },
    input: {
        color: Colors.black
    },
    cardItemContainer: {
        overflow: 'visible',
        paddingVertical: wp("1.5%"),
        paddingHorizontal: wp("7.5%")
    }
});

