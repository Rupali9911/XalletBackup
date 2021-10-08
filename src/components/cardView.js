import React, { useEffect, useState } from 'react';
import {
    Image,
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {formatWithMask, Masks} from 'react-native-mask-input';
import { wp, hp, RF } from '../constants/responsiveFunct';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import ImagesSrc from '../constants/Images';
import { CARD_MASK, translate } from '../walletUtils';


const CardView = (props) => {

    const {details} = props;
    const [name, setName] = useState("XXXXX XXXXX"); 
    const [number, setNumber] = useState("0000"); 
    const [expMonth, setExpMonth] = useState("XX"); 
    const [expYear, setExpYear] = useState("XXXX"); 
    const [type, setType] = useState(null); 

    useEffect(()=>{
        if(details){
            setName(details.name);
            setNumber(details.last4);
            setExpMonth(details.exp_month);
            setExpYear(details.exp_year);
            setType(ImagesSrc.cardTypeIcon[details.brand.replace(' ', '-').toLowerCase()]);
        }
    },[props.details]);

    return(
        <View style={[styles.container]}>
            <Text style={styles.nameStyle} numberOfLines={1}>{name}</Text>
            <Text style={styles.numberStyle} numberOfLines={1}>{formatWithMask({
                text: `424242424242${number}`,
                mask: CARD_MASK,
                obfuscationCharacter: 'X',
            }).obfuscated}</Text>
            <View style={styles.rowContainer}>
                <View style={styles.expiryDate}>
                    <Text style={styles.label} numberOfLines={1}>{translate("wallet.common.topup.expiryDate")}</Text>
                    <Text style={styles.value} numberOfLines={1}>{`${expMonth}/${expYear}`}</Text>
                </View>
                <View style={styles.cvv}>
                    <Text style={styles.label} numberOfLines={1}>{translate("wallet.common.topup.cvv")}</Text>
                    <Text style={styles.value} numberOfLines={1}>XXX</Text>
                </View>
                <View style={styles.cardType}>
                    <Image
                        style={styles.typeIcon}
                        source={type?type:ImagesSrc.cardTypeIcon.unknown}
                        resizeMode={'contain'}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: wp("85%"),
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 8,
        padding: wp("3.5%"),
        alignSelf: 'center',
        marginVertical: hp("3%"),
        backgroundColor: Colors.inputBackground
    },
    nameStyle: {
        fontSize: RF(2),
        fontFamily: Fonts.ARIAL_BOLD,
    },
    numberStyle: {
        marginVertical: hp("3%"),
        fontSize: RF(1.9)
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    expiryDate: {

    },
    label: {
        fontSize: RF(2),
        fontFamily: Fonts.ARIAL_BOLD,
    },
    value: {
        marginVertical: hp("1%"),
    },
    cardType: {

    },
    typeIcon: {
        width: wp("25%"),
        height: wp("12%"),
    }
});

export default CardView;