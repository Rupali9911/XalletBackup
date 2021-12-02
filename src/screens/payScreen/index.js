import React from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';
import { images, colors } from '../../res';
import { AppHeader } from '../../components';

import getLanguage from '../../utils/languageSupport';
import { SIZE } from '../../common/responsiveFunction';
import { translate } from '../../walletUtils';

const PayScreen = ({
    navigation
}) => {
    return (
        <LinearGradient
            flex={1}
            colors={[colors.GRADIENTLIGHT, colors.GRADIENTDARK]}>
            <SafeAreaView>
                <AppHeader
                    titleStyle={styles.headerText}
                    title={translate("wallet.common.purchased")}
                />
            </SafeAreaView>
            <View style={styles.cardContainer}>
                <View style={styles.profileImage}>
                    <Image source={''} style={{ flex: 1, resizeMode: "cover" }} />
                </View>
                <Text style={styles.cardTitle}>
                    {'Seller name'}
                </Text>
                <Text style={styles.cardData}>
                    {'2020.02.10 00:00'}
                </Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>
                        {'NFT NAMENFT NAME'}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.successButton}>
                        <Text style={styles.buttonText}>OK</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    )
}

export default PayScreen;