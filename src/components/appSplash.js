import React from 'react';
import {
    SafeAreaView,
    Image,
} from 'react-native';

const appSplash = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image source={require('../../assets/images/splash.png')} style={{ flex: 1 }} />
        </SafeAreaView>
    )
}

export default appSplash;