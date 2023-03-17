import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { confirmationAlert, modalAlert } from '../../common/function';
import { alertWithSingleBtn } from '../../utils';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import { AppHeader } from '../../components';
import Colors from '../../constants/Colors';
import { colors } from '../../res';
import { setAppLanguage } from '../../store/reducer/languageReducer';
import { setAppCurrency } from '../../store/reducer/currencyReducer';
import { getAllCards } from '../../store/reducer/paymentReducer';
import {
  endMainLoading,
  _logout,
  deleteAccountApi,
} from '../../store/reducer/userReducer';
import { languageArray, translate } from '../../walletUtils';
import { requestDisconnectDApp } from '../AuthScreens/nonCryptoAuth/magic-link';
import styles from './styled';
import ShowModal from '../certificateScreen/modal';
import SelectionModal from '../../components/SelectionModal';
import { getWallet } from '../../helpers/AxiosApiRequest';
import MultiButtonModal from '../../components/MultiButtonModal';

const optionalConfigObject = {
  title: 'Authentication Required', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Touch sensor', // Android
  sensorErrorDescription: 'Failed', // Android
  cancelText: 'Cancel', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

// const _pressHandler = () => {
//   TouchID.authenticate(
//     'to demo this react-native component',
//     optionalConfigObject,
//   )
//     .then(success => {
//       Alert.alert('Authenticated Successfully');
//     })
//     .catch(error => {
//       Alert.alert('Authentication Failed');
//     });
// };

const ListItem = props => {
  return (
    <TouchableOpacity
      disabled={props.disableView}
      onPress={props.onPress}
      style={styles.itemCont}>
      <View style={styles.centerProfileCont}>
        <Text style={styles.listLabel}>{props.label}</Text>
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
        ) : props.noArrow ? null : (
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

function Setting({ route, navigation }) {
  const dispatch = useDispatch();
  // const [toggle, setToggle] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const { selectedLanguageItem } = useSelector(state => state.LanguageReducer);
  const { selectedCurrency } = useSelector(state => state.CurrencyReducer);
  const { myCards } = useSelector(state => state.PaymentReducer);
  const { userData } = useSelector(state => state.UserReducer);
  const [deletePopup, setDeletePopup] = useState(false);
  const [backupPhrasePopup, setBackupPhrasePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteAccountLoading, isBackup } = useSelector(
    state => state.UserReducer,
  );
  const [isCheckService, setIsCheckService] = useState(false);
  const [isBackupPhraseService, setIsBackupPhraseService] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const currencyArray = [
    {
      currency_id: 1,
      currency_display: translate('common.USD'),
      currency_name: 'USD',
      currency_sign: '$',
    },
    {
      currency_id: 2,
      currency_display: translate('common.JPY'),
      currency_name: 'JPY',
      currency_sign: '¥',
    },
    {
      currency_id: 3,
      currency_display: translate('common.KRW'),
      currency_name: 'KRW',
      currency_sign: '₩',
    },
    {
      currency_id: 4,
      currency_display: translate('common.CNY'),
      currency_name: 'CNY',
      currency_sign: '¥',
    },
  ];

  useEffect(async () => {
    // dispatch(getAllCards(userData.access_token));
    let getData = await getWallet();
    setWallet(getData);
    if (route.params.isSetting) {
      setTimeout(() => {
        setBackupPhrasePopup(true);
      }, 500);
    }
  }, [route]);

  const logoutConfirm = async () => {
    const _selectedLanguageItem = selectedLanguageItem;
    await EncryptedStorage.clear();
    AsyncStorage.multiRemove(
      [
        '@passcode',
        '@WALLET',
        '@USERDATA',
        '@BackedUp',
        '@apps',
        '@CURRENT_NETWORK_CHAIN_ID',
      ],
      err => { },
    ).then(() => {
      requestDisconnectDApp();
      dispatch(_logout());
      dispatch(endMainLoading());
      dispatch(setAppLanguage(_selectedLanguageItem));
    });
  };

  const onLogout = () => {
    if (!isBackup) {
      setBackupPhrasePopup(true);
    } else {
      setLogoutPopup(true);
    }
  };

  const handleDeletePopup = value => {
    setTimeout(() => {
      setDeletePopup(value);
    }, 500);
  };

  const deleteAccount = () => {
    dispatch(deleteAccountApi())
      .then(async res => {
        logoutConfirm();
        handleDeletePopup(false);
      })
      .catch(err => {
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.tryAgain'),
          () => handleDeletePopup(true),
        );
      });
  };

  const updateLanguage = language => {
    if (selectedLanguageItem.language_name !== language.language_name) {
      dispatch(setAppLanguage(language));
      setShowLanguage(false);
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Me' }],
          }),
        );
      }, 2000);
    } else {
      setShowLanguage(false);
    }
  };

  const updateCurrency = currency => {
    if (selectedCurrency.currency_id !== currency.currency_id) {
      dispatch(setAppCurrency(currency));
      setShowCurrency(false);
    } else {
      setShowCurrency(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ width: '100%', backgroundColor: '#fff' }}>
        <AppHeader title={translate('wallet.common.settings')} showBackButton />
      </View>
      <ScrollView>
        <View style={[styles.section2, { marginTop: 0 }]}>
          <ListItem
            onPress={() => navigation.navigate('SecurityScreen')}
            label={translate('wallet.common.security')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />
          <ListItem
            onPress={() =>
              modalAlert(
                translate('wallet.common.alert'),
                translate('common.comingSoon'),
              )
            }
            label={translate('wallet.common.notifications')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />

          <ListItem
            onPress={() => setShowCurrency(true)}
            label={translate('common.CURRENCY_CONVERSION')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />

          <ListItem
            onPress={() => setShowLanguage(true)}
            label={translate('wallet.common.language')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />
          <ListItem
            onPress={() => null}
            rightText={`${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber().slice(
              0,
              1,
            )}`}
            label={translate('wallet.common.version')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />
          <ListItem
            onPress={() => handleDeletePopup(true)}
            rightText={``}
            noArrow={true}
            label={translate('common.deleteAccount')}
          />
          <View style={{ ...styles.separator, width: wp('81%') }} />
          <ListItem
            onPress={onLogout}
            rightText={``}
            noArrow={true}
            label={translate('common.Logout')}
          />
          <MultiButtonModal
            isVisible={logoutPopup}
            closeModal={() => setLogoutPopup(false)}
            title={translate('wallet.common.verification')}
            description={translate('wallet.common.logOutQ')}
            leftButtonText={translate('common.Cancel')}
            rightButtonText={translate('common.OK')}
            onRightPress={() => {
              logoutConfirm();
            }}
            onLeftPress={() => {
              setLogoutPopup(false);
            }}
          />

          {/*<TouchableHighlight onPress={_pressHandler}>*/}
          {/*<Text>Authenticate with Touch ID</Text>*/}
          {/*</TouchableHighlight>*/}

        </View>
      </ScrollView>



      <ShowModal
        isDelete={true}
        isVisible={deletePopup}
        onBackdrop={deleteAccountLoading}
        leftDisabled={deleteAccountLoading}
        rightDisabled={deleteAccountLoading}
        rightLoading={deleteAccountLoading}
        title={translate('common.deleteAccount') + '!'}
        description={translate('common.deleteAccountDescription')}
        closeModal={
          deleteAccountLoading ? null : () => handleDeletePopup(false)
        }
        rightButtonTitle={translate('wallet.common.delete')}
        onRightPress={deleteAccount}
        checkBoxDescription={translate('common.deleteCheckBoxDiscription')}
        isCheck={isCheckService}
        onChecked={setIsCheckService}
      />
      <ShowModal
        isDelete={true}
        backupPhrase={!isBackup ? true : false}
        isVisible={backupPhrasePopup}
        onBackdrop={deleteAccountLoading}
        leftDisabled={deleteAccountLoading}
        rightDisabled={deleteAccountLoading}
        rightLoading={deleteAccountLoading}
        title={translate('common.PLEASE_SET_RECOVERY_PHRASE')}
        description={translate('common.LOGOUT_WITHOUT_PHRASE_BACKUP_DESC')}
        closeModal={
          deleteAccountLoading ? null : () => setBackupPhrasePopup(false)
        }
        onBackUpNowPress={() => {
          setBackupPhrasePopup(false);
          setTimeout(() => {
            navigation.navigate('recoveryPhrase', { isSetting: true, wallet });
          }, 0.01);
        }}
        rightButtonTitle={translate('common.Logout')}
        leftButtonTitle={translate('common.BACKUP_NOW')}
        onRightPress={logoutConfirm}
        checkBoxDescription={translate(
          'common.LOGOUT_WITHOUT_PHRASE_CHECKBOX_DESC',
        )}
        isCheck={isBackupPhraseService}
        onChecked={setIsBackupPhraseService}
      />

      <SelectionModal
        isVisible={showCurrency}
        closeModal={() => setShowCurrency(false)}
        onSelect={currency => updateCurrency(currency)}
        arrToRender={currencyArray}
        title={translate('common.SELECT_CURRENCY')}
        selectedValue={selectedCurrency?.currency_id}
        compareParam={'currency_id'}
        displayParam={'currency_display'}
        showIcon={false}
      />

      <SelectionModal
        isVisible={showLanguage}
        closeModal={() => setShowLanguage(false)}
        onSelect={language => updateLanguage(language)}
        arrToRender={languageArray}
        title={translate('wallet.common.selectLanguage')}
        selectedValue={selectedLanguageItem?.language_name}
        compareParam={'language_name'}
        displayParam={'language_display'}
        displayJaParam={'language_ja_display'}
        showIcon={true}
      />
    </SafeAreaView>
  );
}

export default Setting;
