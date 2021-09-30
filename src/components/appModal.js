import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal,
    View,
    StyleSheet,
    ImageBackground,
} from 'react-native'; 
import Colors from '../constants/Colors';
import { wp } from '../constants/responsiveFunct';
import ImagesSrc from '../constants/Images';

const AppModal = (props) => {
    const {visible, onRequestClose, src} = props;
    return (
        <Modal 
            visible={visible}
            transparent
            onRequestClose={onRequestClose}
            >
            <ImageBackground source={src?src:ImagesSrc.modalBg} style={styles.container}>
                {props.children}
            </ImageBackground>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.modalBg,
        paddingHorizontal: wp("5%"),
        justifyContent: 'center',
    }
});

AppModal.propTypes = {
    animated: PropTypes.bool,
    animationType: PropTypes.oneOf(['none', 'slide', 'fade', undefined]),
    transparent: PropTypes.bool,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func
}

export default AppModal;