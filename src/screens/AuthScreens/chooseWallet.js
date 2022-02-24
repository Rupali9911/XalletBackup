import React from 'react';
import {StyleSheet, View} from 'react-native';
import AppBackground from '../../components/appBackground';
import AppHeader from '../../components/appHeader';
import AppLogo from '../../components/appLogo';
import {ArrowButton} from '../../components/buttonGroup';
import {hp} from '../../constants/responsiveFunct';
import CommonStyles from '../../constants/styles';
import {translate} from '../../walletUtils';

const chooseWallet = ({navigation}) => {
  return (
    <AppBackground>
      <AppHeader
        showBackButton
        title={translate('wallet.common.importWallet')}
      />
      <View style={CommonStyles.screenContainer}>
        <View style={styles.contentContainer}>
          <AppLogo logoStyle={styles.logo} />
          <ArrowButton
            onPress={() =>
              navigation.navigate('recoveryPhrase', {recover: true})
            }
            title={translate('wallet.common.xanaliaWallet')}
          />
          <ArrowButton
            onPress={() => navigation.navigate('importWallet')}
            title={translate('wallet.common.otherWallet')}
          />
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  logo: {
    marginVertical: hp('5%'),
  },
  hint: {
    marginTop: hp('3%'),
  },
});

export default chooseWallet;
