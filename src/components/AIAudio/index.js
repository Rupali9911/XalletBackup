import React, {useEffect} from 'react';
import Sound from 'react-native-sound';
import sendRequest from '../../helpers/AxiosApiRequest';
import {
  GET_JPAUDIO_FROM_TEXT,
  GET_ENAUDIO_FROM_TEXT,
} from '../../common/constants';
var RNFS = require('react-native-fs');

const AIAudio = async (chatData, language, getVoiceCallback) => {
  console.log('message', chatData?.message);
  var audioUrl;

  if (language === 'ja') {
    try {
      const res = await sendRequest({
        url: GET_JPAUDIO_FROM_TEXT + chatData?.message,
        method: 'GET',
      });
      if (res) {
        console.log('Resonse from JP text to speech api', res);
        const path = RNFS.DocumentDirectoryPath + '/ai.wav';
        await RNFS.writeFile(path, res, 'base64');
        console.log('File write done to path', path);
        audioUrl = path;
        getVoiceCallback(chatData);
      } else {
        console.log('Resonse from JP text to speech api', res);
        getVoiceCallback(chatData);
        return;
      }
    } catch (err) {
      console.log('Error in API', err);
      getVoiceCallback(chatData);
      return;
    }
  } else if (language === 'en') {
    console.log('For English language');
    audioUrl = GET_ENAUDIO_FROM_TEXT + chatData?.message;
    console.log('audioUrl', audioUrl);
    getVoiceCallback(chatData);
  }

  const audio = new Sound(audioUrl, '', err => {
    if (err) {
      return;
    }
    console.log('audio?.getDuration()', audio?.getDuration());
    audio.play(success => {
      if (success) {
        console.log('successfully finished playing');
        audio.release();
      } else {
        console.log('playback failed due to audio decoding errors');
      }
    });
  });
};

export default AIAudio;
