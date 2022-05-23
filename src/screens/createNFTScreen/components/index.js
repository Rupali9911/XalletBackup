import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import Modal from 'react-native-modal';

import { colors, fonts } from '../../../res';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  responsiveFontSize as RF,
} from '../../../common/responsiveFunction';
import { IMAGES } from '../../../constants';
import { translate } from '../../../walletUtils';

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
      onPress={props.onPress}
      disabled={pressable}
      style={[
        styles.fieldCont,
        {
          alignItems: props.inputProps
            ? props.inputProps.hasOwnProperty('multiline')
              ? 'flex-start'
              : 'center'
            : 'center',
            justifyContent: "space-between",
          borderColor:props.inputProps.value
        },
        props.contStyle,
      ]}>
      <TextInput
        editable={pressable}
        {...props.inputProps}
        style={[styles.field, {
          flex: !pressable ? null : 1,
          paddingVertical: !pressable? 0 : hp("2%"),
        }]}
      />
      {props.showRight ? (
        props.rightComponent ? (
          props.rightComponent
        ) : (
          <Image source={IMAGES.downArrow} style={{...styles.imageStyles(3.5), marginRight: wp('3%') }} />
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
        { borderWidth, borderColor, backgroundColor },
        props.buttonCont,
      ]}>
      <Text style={[styles.buttonLabel, { color }, props.buttonLabel]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

export const TabModal = (props) => {
  return (
    <Modal
      {
      ...props.modalProps
      }
      backdropColor="#B4B3DB"
      backdropOpacity={0.8}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}>
      <View style={styles.modalCont}>
        {
          props.title ?
            <Text style={styles.modalTitle}>
              {props.title}
            </Text> : null
        }
        <ScrollView style={{ marginTop: hp('3%') }}>
          {props.data.data.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => props.itemPress(v)}
                style={styles.modalItem}>
                <Text style={styles.listLabel}>
                  {
                    props.data.hasOwnProperty("translate") ?
                    (v.hasOwnProperty(props.data.translate) ?
                     translate(v[props.data.translate]) :
                     v[props.renderItemName] ) :
                        props.renderItemName ?
                          v[props.renderItemName] :
                          v
                  }
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

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
    flexDirection: 'row',
    overflow: 'hidden',
  },
  field: {
    color: colors.BLACK6,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp("2%"),
    fontFamily: fonts.SegoeUIRegular,
    fontSize: RF(1.4),
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
  modalCont: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: wp('2%'),
    maxHeight: hp(60),
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('3%')
  },
  modalTitle: {
    fontFamily: fonts.ARIAL_BOLD,
    fontSize: RF(2.5),
    color: colors.BLACK8,
    textAlign: "center"
  },
  modalItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp("5%"),
  },
  listLabel: {
    fontFamily: fonts.ARIAL,
    fontSize: RF(1.9),
    color: colors.BLACK8,
  }
});
