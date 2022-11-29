import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import ImagesSrc from '../constants/Images';
import { hp, RF, wp } from '../constants/responsiveFunct';
import CommonStyles from '../constants/styles';
import { translate } from '../walletUtils';
import AppButton from './appButton';
import TextView from './appText';

const SuccessModalContent = props => {
  const { isCreate } = useSelector(state => state.UserReducer);
  return (
    <View style={styles.container}>
      <IconButton
        icon={'close'}
        color={Colors.headerIcon2}
        size={20}
        style={styles.closeIcon}
        onPress={() => {
          props.onClose && props.onClose();
        }}
      />
      <Image style={styles.img} source={props?.transactionDone ? ImagesSrc.transactionDone : ImagesSrc.success} />
      {isCreate ? (
        <>
          <TextView style={styles.title}>
            {translate('wallet.common.success')} !
          </TextView>
          <TextView style={styles.hint}>
            {translate('wallet.common.walletSuccess')}
          </TextView>
        </>
      ) : (
        <>
          <TextView style={styles.title}>
            {translate('wallet.common.success')} !
          </TextView>
          <TextView style={styles.hint}>
            {props.sucessMsg ? props.sucessMsg : translate('wallet.common.walletImported')}
          </TextView>
        </>
      )}

      <AppButton
        label="OK"
        containerStyle={styles.button}
        labelStyle={CommonStyles.buttonLabel}
        onPress={() => {
          props.onDonePress && props.onDonePress();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp('2%'),
    borderRadius: 15,
    alignItems: 'center',
  },
  closeIcon: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.iconBg,
  },
  img: {
    ...CommonStyles.imageStyles(25),
    marginVertical: hp('4%'),
  },
  title: {
    fontSize: RF(3),
    marginTop: hp('5%'),
  },
  hint: {
    color: Colors.modalHintText,
    marginTop: '4.7%',
    marginBottom: hp('5%'),
    textAlign: 'center',
    fontSize: RF(1.7),
  },
  button: {
    width: '90%',
    ...CommonStyles.button,
    marginVertical: hp('3%'),
  },
});

export default SuccessModalContent;
