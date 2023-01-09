import React, {useState, useEffect} from 'react';
import {StyleSheet, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import {setAppLanguage} from '../store/reducer/languageReducer';
import CommonStyles from '../constants/styles';
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
import Images from '../constants/Images';
import {RF, wp} from '../constants/responsiveFunct';
import {languageArray} from '../walletUtils';

function LanguageSel(props) {
  const dispatch = useDispatch();
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(selectedLanguageItem?.language_name);

  const JapaneseLangTrans = {
    en: '英語',
    ko: '韓国語',
    ja: '日本語',
    tw: '中国語（繁体）',
    ch: '中国語（簡体）',
  };

  const items = [];
  languageArray.map(item => {
    items.push({
      label:
        selectedLanguageItem?.language_name === 'ja'
          ? JapaneseLangTrans[item.language_name]
          : item.language_display,
      value: item.language_name,
      icon: () =>
        item?.icon ? (
          <Image source={item.icon} style={styles.iconStyle} />
        ) : null,
    });
  });

  useEffect(() => {
    setOpen(false);
  }, [props.open]);

  const arrow = <Image style={styles.arrow} source={Images.downArrow} />;
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      closeAfterSelecting={true}
      hideSelectedItemIcon={true}
      setOpen={setOpen}
      setValue={setValue}
      onChangeValue={value => {
        if (value !== selectedLanguageItem?.language_name) {
          let item = languageArray.find(item => item.language_name == value);
          dispatch(setAppLanguage(item));
        }
      }}
      itemSeparator={true}
      itemSeparatorStyle={styles.itemSeparator}
      selectedItemLabelStyle={styles.selectedTextStyle}
      style={styles.pickerStyle}
      dropDownContainerStyle={styles.dropDownContainer}
      textStyle={styles.title}
      labelStyle={styles.label}
      ArrowUpIconComponent={() => arrow}
      ArrowDownIconComponent={() => arrow}
      TickIconComponent={({style}) => (
        <Image style={styles.tickIcon} source={Images.tick} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  pickerStyle: {
    borderWidth: 0,
    width: wp('33%'),
    alignSelf: 'center',
  },
  dropDownContainer: {
    width: wp('57%'),
    alignSelf: 'center',
    borderWidth: 0,
    elevation: 20,
    overflow: 'visible',
    shadowOffset: {width: 2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  title: {
    ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.titleColor, RF(1.6)),
    fontWeight: '700',
  },
  label: {
    ...CommonStyles.text(Fonts.ARIAL_BOLD, Colors.titleColor, RF(1.6)),
    fontWeight: '700',
    textAlign: 'center',
  },
  arrow: {
    height: wp('2%'),
    width: wp('3%'),
  },
  selectedTextStyle: {
    color: Colors.themeColor,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  tickIcon: {
    width: 15,
    height: 15,
  },
  itemSeparator: {
    backgroundColor: Colors.GREY11,
  },
});
const LanguageSelector = React.memo(LanguageSel);

export default LanguageSelector;
