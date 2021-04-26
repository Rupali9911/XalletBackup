import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, Image, Button, TouchableOpacity, Modal } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import WalletConnect from "@walletconnect/client";
// import WalletConnect from "@walletconnect/browser";
// import QRCodeModal from "@walletconnect/qrcode-modal";
import styles from './styles';
import { colors, images } from '../../res';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp'
import AsyncStorage from '@react-native-async-storage/async-storage';

function ConnectScreen() {
    const connector = useWalletConnect();
    if (!connector.connected) {
        /**
         *  Connect! 🎉
         */
        return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
            <Button title="Connect" onPress={() => connector.connect()} />
        </View>;
    }
    console.log(connector, '/////////////')
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
        <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 5 }} >Client ID</Text>
        <Text style={{ fontSize: 14, textAlign: "center", marginVertical: 5, backgroundColor: '#ddd', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 2 }} >{connector._clientId.substr(0,5)+ '........'}</Text>
        <Button title="Kill Session" onPress={() => connector.killSession()} />
</View>
}

export default withWalletConnect(ConnectScreen, {
    redirectUrl: Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
    storageOptions: {
        asyncStorage: AsyncStorage,
    },
});

// const ConnectScreen = () => {
//     const connector = useWalletConnect();
//     if (!connector.connected) {
//         /**
//          *  Connect! 🎉
//          */
//         return <Button title="Connect" onPress={() => connector.connect())} />;
// }
// return <Button title="Kill Session" onPress={() => connector.killSession()} />;
// const [visible, setVisible] = React.useState(false)

// const onSuccess = e => {

// };

// return (
//     <WalletConnectProvider
//         bridge="https://bridge.walletconnect.org"
//         clientMeta={{
//             description: 'Connect with WalletConnect',
//             url: 'https://walletconnect.org',
//             icons: ['https://walletconnect.org/walletconnect-logo.png'],
//             name: 'WalletConnect',
//         }}
//         redirectUrl={Platform.OS === 'web' ? window.location.origin : 'dapp://'}
//         storageOptions={{
//             asyncStorage: AsyncStorage,
//         }}>
//         <>{/* awesome app here */}</>
//     </WalletConnectProvider>
// )
// }

// export default ConnectScreen;