import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Image,
    View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {getCountries} from 'country-state-picker';

import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { RF, wp, hp } from '../constants/responsiveFunct';
import { translate } from '../walletUtils';

const CountrySelector = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.value);
    const [countries, setCountries] = useState([]);

    useEffect(()=>{
        setOpen(false);
    },[props.open]);

    useEffect(()=>{
        const array = [];
        getCountries().map((item)=>{
            array.push(
                {
                    label: item.name,
                    value: item.code
                }
            );
        });
        setCountries(array);
    },[]);

    const arrow = <Image style={styles.arrow} source={Images.down_grey}/>
    return(
        <DropDownPicker
            open={open}
            value={value}
            items={countries}
            closeAfterSelecting={true}
            searchable={true}
            listMode={'MODAL'}
            placeholder={translate("wallet.common.topup.select")}
            searchPlaceholder={translate("wallet.common.topup.searchCountry")}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={(value) => {
                const country = countries.find(item => item.value == value);
                if(country){
                    props.onSetCountry && props.onSetCountry({
                        code: value,
                        name: country.label
                    });
                }
            }}
            style={styles.pickerStyle}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.title}
            labelStyle={styles.label}
            listItemLabelStyle={styles.itemLabel}
            searchContainerStyle={styles.searchContainer}
            searchTextInputStyle={styles.searchInput}
            ArrowUpIconComponent={({style}) => arrow}
            ArrowDownIconComponent={({style}) => arrow}
        />
    );
}

const styles = StyleSheet.create({
    pickerStyle: {
        width: wp("39%"),
        alignSelf: 'center',
        borderColor: Colors.themeColor,
        marginVertical: hp("1.5%")
    },
    dropDownContainer: {
        width: wp("55%"),
        alignSelf: 'center',
        borderWidth: 0.5,
        elevation: 10,
    },
    title: {
        ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.titleColor, RF(1.6)),
        fontWeight: "700",
        marginHorizontal: wp('2%'),
    },
    label: {
        ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.titleColor, RF(1.6)),
        fontWeight: "700",
        // marginHorizontal: wp('2%'),
        //  textAlign: 'center',
    },
    arrow:{
        height: wp("2%"),
        width: wp("3%"),
    },
    searchInput: {
        borderColor: Colors.borderColorInput,
        paddingVertical: hp("1.5%"),
        fontSize: RF(2),
        fontWeight: 'normal'
    },
    searchContainer: {
        borderBottomColor: Colors.borderColorGrey
    },
    itemLabel: {
        fontSize: RF(1.8),
        color: Colors.black,
        fontWeight: 'normal'
    }
});
const CountryPicker = React.memo(CountrySelector);


export default CountryPicker;
