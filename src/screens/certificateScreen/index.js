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

import getLanguage from '../../utils/languageSupport';
import { SIZE } from '../../common/responsiveFunction';
const langObj = getLanguage();

const CertificateScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header} >
                {/* <View style={styles.headerLeft}>
                    <TouchableOpacity>
                        <Image style={styles.headerIcon} source={images.icons.back} resizeMode="contain" />
                    </TouchableOpacity>
                </View> */}
                <Text style={styles.headerText}>
                    {'Scan Tag'}
                </Text>
            </View>
            <View style={styles.mainContent}>
                <Text style={styles.scanText}>
                    {'Ready to Scan'}
                </Text>
                <TouchableOpacity>
                    <Image style={styles.scanImage} source={images.icons.scan} resizeMode="contain" />
                </TouchableOpacity>
                <Text style={styles.objectText}>
                    {'Object Scanned'}
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default CertificateScreen;
