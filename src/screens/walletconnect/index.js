import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    SafeAreaView
} from 'react-native';
import {
    SVGS,
} from 'src/constants';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { colors } from '../../res';
import { AppHeader } from '../../components';
import Profile from '../profile';
import { useSelector, useDispatch } from 'react-redux';
import { translate } from '../../walletUtils';

const {
    WalletConnectIcon
} = SVGS;

const WalletConnectScreen = ({
    navigation
}) => {

    return (
        <LinearGradient
            flex={1}
            colors={[colors.GRADIENTLIGHT, colors.GRADIENTDARK]}>
            <SafeAreaView>
                <AppHeader
                    titleStyle={styles.headerText}
                    title={translate("wallet.common.connectwallet")}
                />
            </SafeAreaView>
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
                        {translate("wallet.common.connectwith") + '\n' + translate("wallet.common.yourwallet")}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => {
                }}>
                    <View style={[styles.successButton, { backgroundColor: '#1b8cff' }]}>
                        <Text style={styles.buttonText}>
                            {translate("common.connectWallet")}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.cardContainer}>
                <View style={styles.profileImage}>
                    <WalletConnectIcon />
                </View>
                <Text style={styles.cardTitle}>
                    {'User Id'}
                </Text>
                <Text style={styles.cardData}>
                    {connector._accounts[0].substr(0, 9) + '........'}
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
                <TouchableOpacity onPress={() => connector.killSession()}>
                    <View style={[styles.successButton, { backgroundColor: '#f3b902' }]}>
                        <Text style={styles.buttonText}>
                            {'Disconnect'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View> */}
        </LinearGradient>
    )
}

export default WalletConnectScreen;