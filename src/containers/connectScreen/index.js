import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { View, Text, Button, } from 'react-native';

import styles from './styles';
import { colors, images } from '../../res';
import { useWalletConnect, withWalletConnect } from '@walletconnect/react-native-dapp'

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
    AsyncStorage.setItem("account_id@", JSON.stringify({ account: connector._accounts[0] }))
    console.log(connector, '/////////////', connector._accounts[0])
    return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
        <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 5 }} >Client ID</Text>
        <Text style={{ fontSize: 14, textAlign: "center", marginVertical: 5, backgroundColor: '#ddd', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 2 }} >{connector._accounts[0].substr(0, 5) + '........'}</Text>
        <Button title="Kill Session" onPress={() => {
            AsyncStorage.removeItem("account_id@")
            connector.killSession()
        }} />
    </View>
}

export default withWalletConnect(ConnectScreen, {
    redirectUrl: Platform.OS === 'web' ? window.location.origin : 'yourappscheme://',
    storageOptions: {
        asyncStorage: AsyncStorage,
    },
});