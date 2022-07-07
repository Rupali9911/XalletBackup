import PropTypes from 'prop-types';
import React from 'react';
import { ImageBackground, Modal, StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Colors from '../constants/Colors';
import { wp } from '../constants/responsiveFunct';

const AppModal = props => {
  const { visible, onRequestClose, src } = props;
  if (Platform.OS === 'android') {
    if(visible) {
      return (
          <View activeOpacity={1} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <BlurView
              blurType="light"
              style={{ flex: 1 }}
              blurAmount={5}>
              <View style={styles.container}>
                {props.children}
              </View>
            </BlurView>
          </View> 
      )
    } else{
      return(
       null
      )
    }
  } else {
    return (
      <Modal visible={visible} transparent onRequestClose={onRequestClose}>
        <BlurView
          blurType="light"
          style={{ flex: 1 }}
          blurAmount={5}>
          <View style={styles.container}>
            {props.children}
          </View>
        </BlurView>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.modalBg,
    paddingHorizontal: wp('5%'),
    justifyContent: 'center',
  },
});

AppModal.propTypes = {
  animated: PropTypes.bool,
  animationType: PropTypes.oneOf(['none', 'slide', 'fade', undefined]),
  transparent: PropTypes.bool,
  visible: PropTypes.bool,
  onRequestClose: PropTypes.func,
};

export default AppModal;
