import React from 'react';
import {
    SafeAreaView,
    Image,
} from 'react-native';

const appSplash = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <Image source={require('../../assets/images/splash.png')} style={{ flex: 1, resizeMode: 'contain' }} />
        </SafeAreaView>
    )
}

export default appSplash;