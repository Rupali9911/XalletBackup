import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import WalletConnect from "@walletconnect/client";

import styles from './styles';
import { colors, images } from '../../res';

const ConnectScreen = () => {


    const [visible, setVisible] = React.useState(false)

    const onSuccess = e => {
        const uri = e.data;
        console.log(uri);
        const connector = new WalletConnect(
            {
                // Required
                uri,
                // Required
                clientMeta: {
                    description: "WalletConnect Developer App",
                    url: "https://walletconnect.org",
                    icons: ["https://walletconnect.org/walletconnect-logo.png"],
                    name: "WalletConnect",
                },
            }
        );
        connector.on("session_request", (error, payload) => {
            if (error) {
                alert(error);
            }

            console.log(payload)

        });
        setVisible(false)
    };

    return (
        <SafeAreaView style={styles.container} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}>
                <TouchableOpacity onPress={() => setVisible(true)} style={{ paddingHorizontal: 10, paddingVertical: 5, justifyContent: "center", alignItems: "center", backgroundColor: "blue" }} >
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }} >Connect to Wallet</Text>
                </TouchableOpacity>
            </ScrollView>
            <Modal animationType="slide" visible={visible} >
                <SafeAreaView style={styles.container} >
                <View style={{
                    flex: 1,
                    backgroundColor: colors.black_opacity(0.5)
                }} >
                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => setVisible(false)} style={styles.backIcon} >
                            <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>
                    <QRCodeScanner
                        onRead={onSuccess}
                        bottomContent={
                            <TouchableOpacity style={styles.buttonTouchable}>
                                <Text style={styles.buttonText}>OK. Got it!</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

export default ConnectScreen;
