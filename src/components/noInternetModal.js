import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { translate } from '../walletUtils';
import { Portal } from '@gorhom/portal'

const Button = ({ children, ...props }) => (
    <TouchableOpacity style={styles.button} {...props}>
        <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
);

const NoInternetModal = ({ show, onRetry, isRetrying }) => (
    <Portal>
        <Modal isVisible={show} style={styles.modal} animationInTiming={600}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{translate("wallet.common.connectionError")}</Text>
                <Text style={styles.modalText}>
                    {translate("wallet.common.connectError")}
                </Text>
                <Button onPress={onRetry} disabled={isRetrying}>
                    {translate("wallet.common.tryAgain")}
                </Button>
            </View>
        </Modal>
    </Portal>
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