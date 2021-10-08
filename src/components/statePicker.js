import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Image,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import {getStates} from 'country-state-picker';

import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { RF, wp, hp } from '../constants/responsiveFunct';
import { translate } from '../walletUtils';

const StateSelector = (props) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [states, setStates] = useState([]);

    useEffect(()=>{
        setOpen(false);
    },[props.open]);

    useEffect(()=>{
        const array = [];
        if(props.country){
            getStates(props.country).map((item)=>{
                array.push(
                    {
                        label: item,
                        value: item
                    }
                );
            });
            setStates(array);
        }
    },[props.country]);

    const arrow = <Image style={styles.arrow} source={Images.down_grey}/>
    return(
        <DropDownPicker
            open={open}
            value={value}
            items={states}
            closeAfterSelecting={true}
            searchable={true}
            listMode={'MODAL'}
            placeholder={translate("wallet.common.topup.select")}
            searchPlaceholder={translate("wallet.common.topup.searchState")}
            setOpen={(_open)=>{
                if(states.length>0){
                    setOpen(_open);
                }else{
                    setOpen(false);
                }
            }}
            setValue={setValue}
            onChangeValue={(value) => {
                props.onSetState && props.onSetState(value);
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
const StatePicker = React.memo(StateSelector);


export default StatePicker;
