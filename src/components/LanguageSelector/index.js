import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

// import { setAppLanguage } from '../../store/actions/languageActions';

import {
    COLORS,
    SIZE,
    SVGS,
    FONT,
    FONTS
} from 'src/constants';
import { languageArray } from '../../utils';

const {
    BottomArrowIcon
} = SVGS;

function LanguageSel(props) {
    const dispatch = useDispatch();
    const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedLanguageItem.language_name);

    const items = [];
    languageArray.map((item) => {
        items.push({
            label: item.language_display,
            value: item.language_name
        });
    });

    useEffect(() => {
        setOpen(false);
    }, [props.open]);

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            closeAfterSelecting={true}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={(value) => {
                // if (value !== selectedLanguageItem.language_name) {
                //     let item = languageArray.find(item => item.language_name == value);
                //     console.log('language update');
                //     dispatch(setAppLanguage(item));
                // }
            }}
            style={styles.pickerStyle}
            dropDownContainerStyle={styles.dropDownContainer}
            textStyle={styles.title}
            labelStyle={styles.label}
            ArrowDownIconComponent={({ style }) => <BottomArrowIcon />}
        />
    );
}

const styles = StyleSheet.create({
    pickerStyle: {
        borderWidth: 0,
        width: "53%",
        alignSelf: 'center',
    },
    dropDownContainer: {
        width: "70%",
        alignSelf: 'center',
        borderWidth: 0.5,
        elevation: 10,
    },
    title: {
        color: COLORS.GREY5,
        fontSize: FONT(16),
        fontFamily: FONTS.ARIAL_BOLD,
        fontWeight: "700",
        marginHorizontal: '2%',
    },
    label: {
        color: COLORS.GREY5,
        fontSize: FONT(15),
        fontFamily: FONTS.ARIAL_BOLD,
        fontWeight: "700",
        marginHorizontal: '2%',
    }
});
const LanguageSelector = React.memo(LanguageSel);

export default LanguageSelector;