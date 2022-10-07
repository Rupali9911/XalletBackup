import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {SIZE} from 'src/constants';
import Colors from '../../constants/Colors';
import {hp} from '../../constants/responsiveFunct';

const TokenInput = ({
  value,
  onChangeText,
  tokenName,
  isDropdownVisible,
  open,
  dropdownValue,
  Items,
  setValue,
  setItems,
  setOpen,
  inputStyle,
  style,
  dropStyle
}) => {
  return (
    <View style={[styles.inputWrapperView, style]}>
      <TextInput
        value={value}
        keyboardType="numeric"
        style={[
          styles.inputField,
          {
            width: isDropdownVisible ? '70%' : '80%',
          },
          inputStyle,
        ]}
        onChangeText={onChangeText}
        maxLength={10}
      />
      <View
        style={[
          styles.tokenView,
          {width: isDropdownVisible ? '30%' : '20%'},
          dropStyle,
        ]}>
        {isDropdownVisible ? (
          <DropDownPicker
            open={open}
            placeholder={dropdownValue}
            value={dropdownValue}
            items={Items}
            setOpen={setOpen}
            maxHeight={hp(15)}
            setValue={setValue}
            setItems={setItems}
            dropDownStyle={styles.dropDownStyle}
            labelStyle={styles.labelStyle}
            containerStyle={styles.dropDownContainer}
            style={styles.pickeStyle}
            placeholderStyle={styles.placeholderStyle}
            arrowIconStyle={styles.arrowIconStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
          />
        ) : (
          <Text style={styles.tokenText}>{tokenName}</Text>
        )}
      </View>
    </View>
  );
};
export default TokenInput;
const styles = StyleSheet.create({
  inputWrapperView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: SIZE(5),
    borderColor: Colors.GREY1,
    borderTopLeftRadius: SIZE(5),
    borderWidth: SIZE(1),
    borderRadius: SIZE(5),
    marginVertical: SIZE(35),
  },
  labelStyle: {
    // fontSize: 12,
  },
  itemStyle: {
    backgroundColor: 'grey',
  },
  dropDownStyle: {
    // backgroundColor: '#fff',
  },
  arrowIconStyle: {
    width: hp(1.5),
    height: hp(1.5),
  },
  dropDownContainerStyle: {
    alignSelf: 'flex-end',
    width: hp(15),
    marginTop: 5,
    borderColor: Colors.GREY1,
    justifyContent: 'flex-start',
  },
  inputField: {
    backgroundColor: Colors.WHITE1,
    height: hp(5.2),
    borderRadius: SIZE(5),
    borderColor: Colors.GREY1,
    paddingLeft: SIZE(10),
  },
  placeholderStyle: {
    // fontSize: SIZE(10),
  },
  tokenView: {
    borderWidth: SIZE(10),
    height: hp(5.2),
    borderLeftWidth: hp(0.1),
    borderTopWidth: 0,
    borderColor: Colors.GREY1,
    borderBottomRightRadius: SIZE(5),
    borderTopRightRadius: SIZE(5),
    justifyContent: 'center',
    borderBottomWidth: 0,
    paddingRight: hp(0.7),
    alignItems: 'center',
    borderRightWidth: 0,
  },
  dropDownContainer: {
    borderColor: Colors.GREY1,
  },
  pickeStyle: {
    minHeight: hp(5.2),
    borderColor: Colors.GREY1,
    borderWidth: 0,
    borderRadius: 1,
  },
  tokenText: {
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: hp(0.8),
    width: '100%',
  },
});
