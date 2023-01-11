import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import Modal from 'react-native-modal';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {alertWithSingleBtn, confirmationAlert} from '../../common/function';
import {
  heightPercentageToDP as hp,
  responsiveFontSize as RF,
  widthPercentageToDP as wp,
} from '../../common/responsiveFunction';
import {AppHeader} from '../../components';
import Colors from '../../constants/Colors';
import {colors} from '../../res';
import {setAppLanguage} from '../../store/reducer/languageReducer';
import {getAllCards} from '../../store/reducer/paymentReducer';
import {
  endMainLoading,
  _logout,
  deleteAccountApi,
} from '../../store/reducer/userReducer';
import {languageArray, translate} from '../../walletUtils';
import {requestDisconnectDApp} from '../AuthScreens/nonCryptoAuth/magic-link';
import styles from './styled';
import ShowModal from '../certificateScreen/modal';
import {getWallet} from '../../helpers/AxiosApiRequest';

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
          <View style={{flexDirection: 'row'}}>
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

const JapaneseLangTrans = {
  en: '英語（イギリス）',
  ko: '韓国語',
  tw: '中国語（繁体）',
  ch: '中国語（簡体）',
};

function Setting({route, navigation}) {
  const dispatch = useDispatch();
  // const [toggle, setToggle] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  const {myCards} = useSelector(state => state.PaymentReducer);
  const {userData} = useSelector(state => state.UserReducer);
  const [deletePopup, setDeletePopup] = useState(false);
  const [backupPhrasePopup, setBackupPhrasePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {deleteAccountLoading, isBackup} = useSelector(
    state => state.UserReducer,
  );
  const [isCheckService, setIsCheckService] = useState(false);
  const [isBackupPhraseService, setIsBackupPhraseService] = useState(false);
  const [wallet, setWallet] = useState(null);

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

  const updateLanguage = language => {
    if (selectedLanguageItem.language_name !== language.language_name) {
      dispatch(setAppLanguage(language));
      setShowLanguage(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Me'}],
        }),
      );
    } else {
      setShowLanguage(false);
    }
  };

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
      err => console.log(err),
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
      confirmationAlert(
        translate('wallet.common.verification'),
        translate('wallet.common.logOutQ'),
        translate('wallet.common.cancel'),
        '',
        logoutConfirm,
        () => null,
      );
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

  const languageModal = () => {
    return (
      <Modal
        isVisible={showLanguage}
        backdropColor="#B4B3DB"
        backdropOpacity={0.8}
        onBackdropPress={() => setShowLanguage(false)}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        onRequestClose={() => {
          setShowLanguage(false);
        }}>
        <View style={styles.modalCont}>
          <Text style={styles.modalTitle}>
            {translate('wallet.common.selectLanguage')}
          </Text>
          <View style={{marginTop: hp('3%')}}>
            {languageArray.map((v, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    updateLanguage(v);
                  }}
                  style={{...styles.centerProfileCont, flex: null}}>
                  <Text style={styles.listLabel}>
                    {selectedLanguageItem.language_name === 'ja'
                      ? JapaneseLangTrans[v.language_name]
                        ? JapaneseLangTrans[v.language_name]
                        : v.language_display
                      : v.language_display}
                  </Text>
                  {selectedLanguageItem.language_name == v.language_name ? (
                    <EntypoIcon
                      size={RF(2.5)}
                      color={colors.DFDFDF}
                      name="check"
                    />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{width: '100%', backgroundColor: '#fff'}}>
        <AppHeader
          title={translate('wallet.common.settingRight')}
          showBackButton
        />
      </View>
      <ScrollView>
        <View style={[styles.section2, {marginTop: 0}]}>
          <ListItem
            onPress={() => navigation.navigate('SecurityScreen')}
            label={translate('wallet.common.security')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() => navigation.navigate('DummyProfile')}
            label={'Profile'}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() =>
              alertWithSingleBtn(
                translate('wallet.common.alert'),
                translate('common.comingSoon'),
              )
            }
            label={translate('wallet.common.notifications')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />

          <ListItem
            onPress={() => setShowLanguage(true)}
            label={translate('wallet.common.language')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() => null}
            rightText={`${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber().slice(
              0,
              1,
            )}`}
            label={translate('wallet.common.version')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() => handleDeletePopup(true)}
            rightText={``}
            noArrow={true}
            label={translate('common.deleteAccount')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={onLogout}
            rightText={``}
            noArrow={true}
            label={translate('common.Logout')}
          />

          {/*<TouchableHighlight onPress={_pressHandler}>*/}
          {/*<Text>Authenticate with Touch ID</Text>*/}
          {/*</TouchableHighlight>*/}
        </View>
      </ScrollView>

      {languageModal()}
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
            navigation.navigate('recoveryPhrase', {isSetting: true, wallet});
          }, 500);
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
    </SafeAreaView>
  );
}

export default Setting;
