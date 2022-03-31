import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import TouchID from 'react-native-touch-id';
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
import {endMainLoading, _logout} from '../../store/reducer/userReducer';
import {languageArray, translate} from '../../walletUtils';
import styles from './styled';
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

const _pressHandler = () => {
  TouchID.authenticate(
    'to demo this react-native component',
    optionalConfigObject,
  )
    .then(success => {
      Alert.alert('Authenticated Successfully');
    })
    .catch(error => {
      Alert.alert('Authentication Failed');
    });
};

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

const JapaneseLangTrans = {
  en: '英語（イギリス）',
  ko: '韓国語',
  tw: '中国語（繁体）',
  ch: '中国語（簡体）',
};

function Setting({navigation}) {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);
  const {myCards} = useSelector(state => state.PaymentReducer);
  const { data } = useSelector(state => state.UserReducer);

  useEffect(() => {
    dispatch(getAllCards(data.token));
  }, []);

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
            onPress={() => {
              if (myCards.length > 0) {
                navigation.navigate('Cards', {price: 0, isCardPay: false});
              } else {
                // navigation.navigate('Cards', { price });
                navigation.navigate('AddCard', {price: 0});
              }
            }}
            label={translate('wallet.common.AECredit')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() => navigation.navigate('SecurityScreen')}
            label={translate('wallet.common.security')}
          />
          <View style={{...styles.separator, width: wp('81%')}} />
          <ListItem
            onPress={() => alertWithSingleBtn(
                translate('wallet.common.alert'),
                translate('common.comingSoon'),
            )}
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
            rightText={`${DeviceInfo.getVersion()} ${DeviceInfo.getBuildNumber().slice(0,1)}`}
            label={translate('wallet.common.version')}
          />
          <ListItem
            onPress={() => {
              confirmationAlert(
                translate('wallet.common.verification'),
                translate('wallet.common.logOutQ'),
                translate('wallet.common.cancel'),
                '',
                () => {
                  const _selectedLanguageItem = selectedLanguageItem;
                  AsyncStorage.multiRemove(
                    ['@passcode', '@wallet', '@BackedUp', '@apps'],
                    err => console.log(err),
                  ).then(() => {
                    dispatch(_logout());
                    dispatch(endMainLoading());
                    dispatch(setAppLanguage(_selectedLanguageItem));
                  });
                },
                () => null,
              );
            }}
            rightText={``}
            label={translate('common.Logout')}
          />
          {/*<TouchableHighlight onPress={_pressHandler}>*/}
          {/*<Text>Authenticate with Touch ID</Text>*/}
          {/*</TouchableHighlight>*/}
        </View>
      </ScrollView>
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
        backdropTransitionOutTiming={600}>
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
                    if(selectedLanguageItem.language_name !== v.language_name){
                      dispatch(setAppLanguage(v));
                      setShowLanguage(false);
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [{name: 'Home'}],
                        }),
                      );
                    }
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
    </SafeAreaView>
  );
}

export default Setting;
