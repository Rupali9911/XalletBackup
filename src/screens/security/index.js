import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import { responsiveFontSize as RF } from '../../common/responsiveFunction';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import { translate } from '../../walletUtils';
import styles from './styled';
import {getWallet} from '../../helpers/AxiosApiRequest';

const ListItem = props => {
  const { isBackup } = useSelector(state => state.UserReducer);
  return (
    <TouchableOpacity
      disabled={props.disableView}
      onPress={props.onPress}
      style={styles.itemCont}>
      <View style={styles.centerProfileCont}>
        <View>
          <Text style={styles.listLabel}>{props.label}</Text>
          {props.subLabel && (
            <Text
              style={[
                styles.listSubLabel,
                { color: isBackup ? Colors.badgeGreen : Colors.alert },
              ]}>
              {
                isBackup ? translate('wallet.common.backupSuccess')
                  : translate('wallet.common.notBackedUp')
              }
            </Text>
          )}
        </View>
        {props.rightText ? (
          <Text style={styles.listLabel}>{props.rightText}</Text>
        ) : props.right ? (
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.listLabel}>{props.right}</Text>
            <EntypoIcon
              size={RF(2.5)}
              color={Colors.GREY8}
              name="chevron-right"
            />
          </View>
        ) : props.rightComponent ? (
          props.rightComponent
        ) : (
          <EntypoIcon
            size={RF(2.5)}
            color={Colors.GREY8}
            name="chevron-right"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};


function SecurityScreen({ navigation }) {
  const { passcodeAsync } = useSelector(state => state.UserReducer);
  const [toggle, setToggle] = useState(false);
  const [wallet, setWallet] = useState(null);

  useEffect(async() => {
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
