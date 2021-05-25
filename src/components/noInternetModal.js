import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const Button = ({ children, ...props }) => (
    <TouchableOpacity style={styles.button} {...props}>
        <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
);

const NoInternetModal = ({ show, onRetry, isRetrying }) => (
    <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Connection Error</Text>
            <Text style={styles.modalText}>
                Oops! Looks like your device is not connected to the Internet.
        </Text>
            <Button onPress={onRetry} disabled={isRetrying}>
                Try Again
        </Button>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '600',
    },
    modalText: {
        fontSize: 18,
        color: '#555',
        marginTop: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
})

export default NoInternetModal;