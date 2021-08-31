import React, { useState } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    SafeAreaView
} from 'react-native';
import {
    SVGS,
} from 'src/constants';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { images, colors } from '../../res';

import getLanguage from '../../utils/languageSupport';
import { SIZE } from '../../common/responsiveFunction';

const {
    WalletConnectIcon
} = SVGS;

const PayScreen = ({
    navigation
}) => {

    const [connected, setConected] = useState(false);

    return (
        <LinearGradient
            flex={1}
            colors={[colors.GRADIENTLIGHT, colors.GRADIENTDARK]}>
            <SafeAreaView>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {'Connect wallet'}
                    </Text>
                </View>
            </SafeAreaView>
            {
                !connected ?
                    <View style={styles.cardContainer}>
                        <View style={styles.profileImage}>
                            <WalletConnectIcon />
                        </View>
                        <Text style={styles.cardTitle}>
                            {'Lorem ipsume'}
                        </Text>
                        <Text style={styles.cardData}>
                            {'Lorem ipsume'}
                        </Text>
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>
                                {'Connect with\nyour wallet'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => setConected(true)}>
                            <View style={[styles.successButton, { backgroundColor: '#1b8cff' }]}>
                                <Text style={styles.buttonText}>
                                    {'Connect'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={styles.cardContainer}>
                        <View style={styles.profileImage}>
                            <WalletConnectIcon />
                        </View>
                        <Text style={styles.cardTitle}>
                            {'User Id'}
                        </Text>
                        <Text style={styles.cardData}>
                            {'Ox4C3456'}
                        </Text>
                        <View style={styles.priceContainer}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.amount}>
                                    {'Amount'}
                                </Text>
                                <Text style={styles.price}>
                                    {'$2,349.00'}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <View style={[styles.successButton, { backgroundColor: '#f3b902' }]}>
                                <Text style={styles.buttonText}>
                                    {'Connect'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
            }
        </LinearGradient>
    )
}

export default PayScreen;