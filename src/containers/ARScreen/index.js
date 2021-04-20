import * as React from 'react';
import { SafeAreaView, StatusBar, ScrollView, View, Text, Image } from 'react-native';

import styles from './styles';
import { colors } from '../../res';

const ARScreen = () => {
    return (
        <SafeAreaView style={styles.container} >
            <StatusBar barStyle='dark-content' backgroundColor={colors.white} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}>
                <Text>Coming Soon</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ARScreen;