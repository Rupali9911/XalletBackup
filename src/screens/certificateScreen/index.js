import React from 'react';
import {
    View,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
    Text,
    ScrollView,
    TextInput,
    Switch
} from 'react-native';
import styles from './styles';
import { images, colors } from '../../res';
import { translate } from '../../walletUtils';

import getLanguage from '../../utils/languageSupport';
import { SIZE } from '../../common/responsiveFunction';
const langObj = getLanguage();

const CertificateScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header} >
                <Text style={styles.headerText}>
                    {translate("wallet.common.scanTag")}
                </Text>
            </View>
            <View style={styles.mainContent}>
                <Text style={styles.scanText}>
                    {translate("wallet.common.readyScan")}
                </Text>
                <TouchableOpacity>
                    <Image style={styles.scanImage} source={images.icons.scan} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={styles.objectText}>
                    {translate("wallet.common.objectScanned")}
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default CertificateScreen;
