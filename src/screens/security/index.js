import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import { translate } from '../../walletUtils';
import styles from './styled';
import { getWallet } from '../../helpers/AxiosApiRequest';
import ListItem from '../../components/ListItem';




function SecurityScreen({ navigation }) {
  const { passcodeAsync } = useSelector(state => state.UserReducer);
  const [toggle, setToggle] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(async () => {
    let getData = await getWallet();
    setWallet(getData);
  }, []);

  useEffect(() => {
    setToggle(passcodeAsync ? true : false);
  }, [passcodeAsync]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ width: '100%', backgroundColor: '#fff' }}>
        <AppHeader title={translate('wallet.common.security')} showBackButton />
      </View>
      <ScrollView>
        <View style={[styles.section2, { marginTop: 0 }]}>
          <ListItem
            disableView
            onPress={() => null}
            label={translate('wallet.common.passcode')}
            rightComponent={
              <ToggleSwitch
                isOn={toggle}
                onColor={Colors.themeColor}
                offColor={Colors.GREY4}
                onToggle={isOn => {
                  navigation.navigate('PasscodeScreen', { screen: 'security' });
                }}
              />
            }
          />

          {wallet?.mnemonic && (
            <ListItem
              onPress={() => {
                if (wallet?.mnemonic) {
                  navigation.navigate('recoveryPhrase', { wallet });
                }
              }}
              label={translate('wallet.common.backupPhrase')}
              subLabel={true}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SecurityScreen;
