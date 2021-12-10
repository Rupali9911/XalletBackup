import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import {colors, fonts} from '../../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../../common/responsiveFunction';
import {IMAGES} from '../../../constants';

export const CardCont = props => {
  return <View style={[styles.cardCont, props.style]}>{props.children}</View>;
};

export const CardLabel = props => {
  return <Text style={[styles.cardLabel, props.style]}>{props.children}</Text>;
};

export const CardField = props => {
  let pressable = props.pressable ? false : true;
  return (
    <TouchableOpacity
      disabled={pressable}
      style={[
        styles.fieldCont,
        {
          alignItems: props.inputProps
            ? props.inputProps.hasOwnProperty('multiline')
              ? 'flex-start'
              : 'center'
            : 'center',
        },
        props.contStyle,
      ]}>
      <TextInput
        editable={pressable}
        {...props.inputProps}
        style={styles.field}
      />
      {props.showRight ? (
        props.rightComponent ? (
          props.rightComponent
        ) : (
          <Image source={IMAGES.downArrow} style={styles.imageStyles(3.5)} />
        )
      ) : null}
    </TouchableOpacity>
  );
};

export const CardButton = props => {
  let borderWidth = props.border ? 1 : 0;
  let borderColor = props.border ? props.border : colors.BLUE6;
  let backgroundColor = props.border ? colors.white : colors.BLUE6;
  let color = props.border ? props.border : colors.white;

  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disable}
      style={[
        styles.buttonCont,
        {borderWidth, borderColor, backgroundColor},
        props.buttonCont,
      ]}>
      <Text style={[styles.buttonLabel, {color}, props.buttonLabel]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardCont: {
    backgroundColor: colors.white,
    width: '100%',
    marginVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('3%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  cardLabel: {
    fontSize: RF(1.5),
    color: colors.BLUE5,
    fontFamily: fonts.PINGfANG_SBOLD,
    marginTop: hp('1%'),
  },
  fieldCont: {
    height: hp('6%'),
    width: '100%',
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: colors.GREY9,
    marginVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    flexDirection: 'row',
    overflow: 'hidden',
  },
  field: {
    color: colors.BLACK6,
    fontFamily: fonts.SegoeUIRegular,
    fontSize: RF(1.4),
    flex: 1,
  },
  buttonCont: {
    height: hp('6%'),
    borderRadius: wp('2%'),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  buttonLabel: {
    fontFamily: fonts.SegoeUIRegular,
    fontSize: RF(1.6),
  },
  imageStyles: size => ({
    height: wp(size),
    width: wp(size),
    resizeMode: 'contain',
  }),
});
