import React, { useState } from 'react'
import {View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { AppHeader } from '../../components';
import AppBackground from '../../components/appBackground';
import AppButton from '../../components/appButton';
import Separator from '../../components/separator';
import { FONTS } from '../../constants';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { hp, RF, wp } from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import { translate } from '../../walletUtils';

const FIXED_PRICE = 1;
const AUCTION = 2;

const SellNFT = ({route, navigation}) => {

    const [sellFormat, setSellFormat] = useState(FIXED_PRICE);

    return (
        <AppBackground>
            <AppHeader 
                title={''}
                showBackButton
                />
            <ScrollView style={{flex: 1}} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.heading}>{translate("common.selectYourSellMethod")}</Text>
                    
                    <ToggleState activeState={sellFormat} onChange={setSellFormat} />
                    
                    <SelectToken />
                    
                    <PaymentField />
                    
                    <PayableIn />

                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTxt}>{translate("common.summary")}</Text>
                        <Separator style={styles.separator}/>
                        
                        <View style={{flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[styles.summaryTxt, {fontSize: RF(2)}]}>{translate("common.bounties")}</Text>
                            <Text style={styles.comingsoon}>{translate("common.comingSoon")}</Text>
                        </View>
                        <Text style={styles.desc}>{translate("common.xanaliaReward")}</Text>

                        <Separator style={styles.separator}/>

                        <View style={{marginTop: hp("1%"), flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={[styles.summaryTxt, {fontSize: RF(2)}]}>{translate("common.fees")}</Text>
                        </View>
                        <Text style={[styles.desc, {marginBottom: hp("2%")}]}>{translate("common.listingIsFree")}</Text>

                        <View style={styles.chargesRow}>
                            <Text style={styles.desc}>{translate("common.toText")}</Text>
                            <Text style={styles.desc}>2.5%</Text>
                        </View>

                        <View style={styles.chargesRow}>
                            <Text style={styles.desc}>{translate("common.cpyrightholder")}</Text>
                            <Text style={styles.desc}>2.5%</Text>
                        </View>

                        <View style={[styles.chargesRow,{marginBottom: 0}]}>
                            <Text style={[styles.desc,{fontFamily: Fonts.ARIAL_BOLD}]}>{translate("common.total")}</Text>
                            <Text style={[styles.desc,{fontFamily: Fonts.ARIAL_BOLD}]}>2.5%</Text>
                        </View>

                        <Separator style={styles.separator}/>

                        <Text style={[styles.summaryTxt, {fontSize: RF(2)}]}>{translate("common.listing")}</Text>

                        <TouchableOpacity style={styles.saleButton}>
                            <Text style={styles.saleButtonTxt}>{translate("common.postYourListing")}</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </AppBackground>
    )
}

const ToggleState = (props) => {
    const {activeState, onChange} = props;

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={activeState == FIXED_PRICE ? styles.button : styles.outLineButton} onPress={() => onChange(FIXED_PRICE)}>
                <Text style={[activeState == FIXED_PRICE ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel, {fontSize: RF(2)}]}>
                    {translate("common.fixedPrice")}
                </Text>
                <Text style={[activeState == FIXED_PRICE ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel, {fontSize: RF(1.5)}]}>
                    {translate("common.sellAtAfixe")}
                </Text>
            </TouchableOpacity>
            <View style={{flex: 0.1}}/>
            <TouchableOpacity disabled style={activeState == AUCTION ? styles.button : styles.outLineButton} onPress={() => onChange(AUCTION)}>
                <Text style={activeState == AUCTION ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel}>
                    {translate("common.highestBid")}
                </Text>
                <Text style={activeState == AUCTION ? CommonStyles.buttonLabel : CommonStyles.outlineButtonLabel}>
                    {translate("common.auctionToHighest")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const SelectToken = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'ALIA', value: 'Alia' },
        { label: 'USDC', value: 'USDC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'MATIC', value: 'Matic' }
    ]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            zIndex={5001}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            closeAfterSelecting={true}
            style={styles.tokenPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder={"Select token"}
        />
    );
}

const PayableIn = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState([]);
    const [items, setItems] = useState([
        { label: 'ALIA', value: 'Alia' },
        { label: 'USDC', value: 'USDC' },
        { label: 'ETH', value: 'ETH' },
        { label: 'MATIC', value: 'Matic' }
    ]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            multiple={true}
            min={0}
            mode={'BADGE'}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            closeAfterSelecting={true}
            style={styles.tokenPicker}
            dropDownContainerStyle={styles.dropDownContainer}
            placeholder={"Payable in"}
        />
    );
}

const PaymentField = (props) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.inputCont, styles.paymentField, { fontSize: RF(2) }]}
                keyboardType='decimal-pad'
                placeholder={translate("common.enterNewPrice")}
                placeholderTextColor={Colors.topUpPlaceholder}
                returnKeyType="done"
                value={props.value}
                onChangeText={props.onChangeText}
                onSubmitEditing={props.onSubmitEditing}
                editable={props.editable}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1
    },
    container: {
        paddingHorizontal: wp("3%"),
    },
    heading: {
        fontSize: RF(3),
    },
    button: {
        // width: '80%',
        flex: 1,
        backgroundColor: Colors.themeColor,
        alignItems: 'center',
        borderRadius: wp("1%"),
        paddingVertical: wp("1%")
    },
    outLineButton: {
        // width: '80%',
        flex: 1,
        alignItems: 'center',
        borderColor: Colors.lightBorder,
        borderWidth: 1,
        borderRadius: wp("1%"),
        paddingVertical: wp("1%")
    },
    buttonContainer: {
        // flex: 1,
        flexDirection: 'row',
        marginVertical: hp("3%"),
        // paddingHorizontal: wp("2%"),
        justifyContent: 'space-around'
    },
    tokenPicker: {
        borderColor: Colors.themeColor,
        borderRadius: 5
    },
    dropDownContainer: {
        borderColor: Colors.themeColor,
        borderRadius: 5
    },
    inputContainer: { 
        flexDirection: 'row', 
        alignItems: 'center',
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: hp("1%") 
    },
    paymentField: {
        paddingHorizontal: wp("2.5%"),
        ...CommonStyles.text(FONTS.ARIAL, Colors.black, RF(1.6)),
        flex: 1,
    },
    summaryContainer: {
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: wp("5%"),
        padding: wp("2%"),
        marginVertical: hp("2%")
    },
    summaryTxt: {
        fontSize: RF(2.5),
        fontFamily: Fonts.ARIAL_BOLD
    },
    separator: {
        marginVertical: hp("2%")
    },
    comingsoon: {
        borderWidth: 1,
        borderColor: Colors.separatorText,
        borderStyle: 'dashed',
        borderRadius: 5,
        paddingHorizontal: wp("2%")
    },
    chargesRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: hp("1%")
    },
    desc: {
        fontSize: RF(1.8),
        fontFamily: Fonts.ARIAL
    },
    saleButton: {
        backgroundColor: Colors.themeColor,
        alignItems: 'center',
        borderRadius: wp("1%"),
        alignSelf: 'baseline',
        padding: wp("2%"),
        marginVertical: hp("1%")
    },
    saleButtonTxt: {
        color: Colors.white
    }
});

export default SellNFT