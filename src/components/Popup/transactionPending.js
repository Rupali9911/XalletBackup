//============== Transaction Modal ==================
import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, Image, StyleSheet } from 'react-native';
import loaderGif from '../../assets/gifs/loadergif.gif';
import Colors from '../../constants/Colors';
import { hp } from '../../constants/responsiveFunct';
import { widthPercentageToDP as wp, SIZE } from '../../common/responsiveFunction';
import { Portal } from '@gorhom/portal';

const transactionPending = ({ isVisible, setVisible, transactionMsg }) => {
  // console.log("🚀 ~ file: transactionPending.js ~ line 11 ~  ~ isVisible", isVisible)
  return (
    <Portal>
      <Modal isVisible={isVisible}>
        <View style={styles.transactionView}>
          <View style={styles.transactionTextView}>
            <Text style={styles.transactionText}>{'Transaction pending'}</Text>
          </View>

          <View style={styles.loaderGif}>
            <Image source={loaderGif} />
          </View>
          <Text style={styles.purchaseText}>
            {transactionMsg
              ? transactionMsg
              : 'Your purchase is being processed'}
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};
export default transactionPending;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  transactionView: {
    backgroundColor: Colors.WHITE1,
    height: hp(35),
    width: wp(90),
    borderRadius: SIZE(15),
  },
  transactionTextView: {
    paddingTop: SIZE(20),
    alignItems: 'center',
  },
  transactionText: {
    fontWeight: 'bold',
    fontSize: SIZE(20),
  },
  loaderGif: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseText: {
    fontSize: SIZE(18),
    color: Colors.GREY1,
    textAlign: 'center',
  },
});
