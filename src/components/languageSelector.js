import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { setAppLanguage } from '../store/reducer/languageReducer';
import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import { RF, wp } from '../constants/responsiveFunct';
import { languageArray } from '../walletUtils';

function LanguageSel(props) {
    const dispatch = useDispatch();
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedLanguageItem.language_name);

    const JapaneseLangTrans = {
        en: '英語（イギリス）',
        ko: '韓国語',
        ja: '日本語',
        tw: '中国語（繁体）',
        ch: '中国語（簡体）',
    };


    const items = [];
    languageArray.map((item) => {
           items.push({
               label: selectedLanguageItem?.language_name === 'ja' ? JapaneseLangTrans[item.language_name] : item.language_display,
               value:  item.language_name
           });
    });

    useEffect(() => {
        setOpen(false);
    }, [props.open]);

    const arrow = <Image style={styles.arrow} source={Images.downArrow} />
    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            closeAfterSelecting={true}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={(value) => {
                if (value !== selectedLanguageItem.language_name) {
                    let item = languageArray.find(item => item.language_name == value);
                    dispatch(setAppLanguage(item));
                }
            }}
            style={styles.pickerStyle}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.title}
            labelStyle={styles.label}
            ArrowUpIconComponent={() => arrow}
            ArrowDownIconComponent={() => arrow}
        />
    );
}

const styles = StyleSheet.create({
    pickerStyle: {
        borderWidth: 0,
        width: wp("55%"),
        alignSelf: 'center',
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
        textAlign: 'center',
    },
    arrow: {
        height: wp("2%"),
        width: wp("3%"),
    }
});
const LanguageSelector = React.memo(LanguageSel);


export default LanguageSelector;
