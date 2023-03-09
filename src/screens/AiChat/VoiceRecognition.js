import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, TouchableOpacity} from 'react-native';
import {SVGS} from '../../constants';
import styles from './style';
import Voice from '@react-native-voice/voice';
import {useSelector} from 'react-redux';
import {translate} from '../../walletUtils';
import {confirmationAlert} from '../../common/function';
import {
  openSettings,
  PERMISSIONS,
  RESULTS,
  requestMultiple,
} from 'react-native-permissions';
const {Mic, RedMic} = SVGS;

const VoiceRecognition = ({setAudioToTextFunc}) => {
  //====================Make Usestate===================
  const [micOn, setMic] = useState(false);
  const [error, setError] = useState('');
  const [audioResult, setAudioResult] = useState([]);
  const results = React.useRef('');

  //=====================Reducer Call===================
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);

  //=====================UseEffect Call=================
  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.getSpeechRecognitionServices();

    return () => Voice.destroy().then(Voice.removeAllListeners);
  }, []);

  //=================Clear States=======================
  const _clearState = () => {
    setError('');
    setAudioResult([]);
  };

  //======================GetError=======================
  const onSpeechError = e => {
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    destroyRecognizer();
  };

  //=======================On Speech End====================
  const onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    // setTimeout(() => {
    //   setMic(false);
    //   stopRecognizing();
    // }, 5000);
  };

  //=======================Get Result====================
  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    setAudioResult(e.value);
    results.current = e.value;
  };

  //=====================Start Speech Recognizing===============
  const startRecognizing = async () => {
    console.log('called START');
    try {
      _clearState();
      await Voice.start(selectedLanguageItem?.language_name);
    } catch (e) {
      console.error(e);
    }
  };

  //======================Stop Recongnition================
  const stopRecognizing = async () => {
    console.log('called STOP');
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  //========================Destroy Recognition======================
  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    _clearState();
  };

  const customMicrophoneAlert = () => {
    return confirmationAlert(
      translate('wallet.common.microphonePermissionHeader'),
      translate('wallet.common.microphonePermissionDescription'),
      translate('common.Cancel'),
      translate('wallet.common.settings'),
      () => openSettings(),
      () => null,
    );
  };

  const customSpeechAlert = () => {
    return confirmationAlert(
      translate('wallet.common.speechPermissionHeader'),
      translate('wallet.common.speechPermissionDescription'),
      translate('common.Cancel'),
      translate('wallet.common.settings'),
      () => openSettings(),
      () => null,
    );
  };

  //=============================Get Device Permissions====================
  const GetDevicePermissions = async () => {
    const requestPermission =
      Platform.OS === 'android'
        ? await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          )
        : await requestMultiple([
            PERMISSIONS.IOS.MICROPHONE,
            PERMISSIONS.IOS.SPEECH_RECOGNITION,
          ]);

    const GrantedResult =
      Platform.OS === 'android'
        ? PermissionsAndroid.RESULTS.GRANTED
        : RESULTS.GRANTED;

    const isPermissionGranted =
      Platform.OS === 'ios'
        ? requestPermission[PERMISSIONS.IOS.MICROPHONE] === GrantedResult &&
          requestPermission[PERMISSIONS.IOS.SPEECH_RECOGNITION] ===
            GrantedResult
        : requestPermission === GrantedResult;

    if (isPermissionGranted) {
      try {
        setTimeout(() => {
          if (micOn) {
            stopRecognizing();
            setAudioToTextFunc(audioResult);
          } else {
            // console.log('Else Mic Check')
            startRecognizing();
            setAudioToTextFunc([]);
          }
          setMic(!micOn);
        }, 500);
      } catch (err) {
        console.log(err);
        return;
      }
    } else {
      if (Platform.OS === 'android') {
        customMicrophoneAlert();
      } else {
        if (requestPermission[PERMISSIONS.IOS.MICROPHONE] != GrantedResult) {
          customMicrophoneAlert();
        } else if (
          requestPermission[PERMISSIONS.IOS.SPEECH_RECOGNITION] != GrantedResult
        ) {
          customSpeechAlert();
        }
      }
    }
  };

  //===================Mic Toggle Func Call=================
  const ToggleVal = () => {
    GetDevicePermissions();
  };

  //=========================Main Return Func===========================
  return (
    <TouchableOpacity style={styles.micContainer} onPress={() => ToggleVal()}>
      {micOn ? <RedMic /> : <Mic />}
    </TouchableOpacity>
  );
};

export default VoiceRecognition;
