import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import AppHeader from '../../components/appHeader';
import {images} from '../../res';
import getLanguage from '../../utils/languageSupport';
import {translate} from '../../walletUtils';
import styles from './styles';

const langObj = getLanguage();

const CertificateScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <AppHeader showBackButton title={translate('wallet.common.scanTag')} />
      <View style={styles.mainContent}>
        <Text style={styles.scanText}>
          {translate('wallet.common.readyScan')}
        </Text>
        <TouchableOpacity>
          <Image
            style={styles.scanImage}
            source={images.icons.scan}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.objectText}>
          {translate('wallet.common.objectScanned')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CertificateScreen;
