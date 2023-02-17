import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {SVGS} from '../../constants';
import styles from './style';
import Voice from '@react-native-voice/voice';
import {useSelector} from 'react-redux';
import {translate} from '../../walletUtils';
import {confirmationAlert} from '../../common/function';
import {openSettings} from 'react-native-permissions';
const {Mic, RedMic} = SVGS;

const VoiceRecognition = ({setAudioToTextFunc}) => {
  // var arrVoiceText = [];

  //====================Make Usestate===================
  const [micOn, setMic] = useState(false);
  const [error, setError] = useState('');
  const [audioResult, setAudioResult] = useState([]);

  //=====================Reducer Call===================
  const {selectedLanguageItem} = useSelector(state => state.LanguageReducer);

  //=====================UseEffect Call=================
  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

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
    if (
      e.error.message &&
      e.error.message === 'User denied access to speech recognition'
    ) {
      stopRecognizing();
      setMic(false);
      confirmationAlert(
        'This Feature would like to access the Microphone',
        'To enable access, tab setting and turn on Microphone',
        translate('common.Cancel'),
        translate('wallet.common.settings'),
        () => openSettings(),
        () => null,
      );
    }
  };

  //=======================Get Result====================
  const onSpeechResults = e => {
    console.log('onSpeechResults: ', e);
    // arrVoiceText = e.value;
    setAudioResult(e.value);
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

  //===================Mic Toggle Func Call=================
  const ToggleVal = () => {
    if (micOn) {
      stopRecognizing();
      setAudioToTextFunc(audioResult);
    } else {
      setAudioToTextFunc([]);
      startRecognizing();
    }
    setMic(!micOn);
  };

  //=========================Main Return Func===========================
  return (
    <TouchableOpacity style={styles.micContainer} onPress={() => ToggleVal()}>
      {micOn ? <RedMic /> : <Mic />}
    </TouchableOpacity>
  );
};

export default VoiceRecognition;
