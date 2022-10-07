import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SERVICE_FEE} from '../constants';
import Colors from '../constants/Colors';
import {SIZE} from './responsiveFunction';

const Fee = props => {
  const {royaltyFee, style} = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{`Platform's fee: ${SERVICE_FEE}%`}</Text>
      <Text style={styles.creatorText}>{`Creator's fee: ${royaltyFee}%`}</Text>
    </View>
  );
};
export default Fee;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingTop: SIZE(8),
  },
  text: {
    paddingBottom: SIZE(5),
    color: Colors.BLACK2,
  },
  creatorText: {
    color: Colors.BLACK2,
  },
});
