import React, { useEffect } from 'react';
import Sound from 'react-native-sound';

const AIAudio = (message, language)  =>{
    console.log('message', message)
    var audioUrl
    if (language === 'ja') {
       // audioUrl= 'https://test-ai.xanalia.com/japanese_text_to_speech/?id1=1&text=' + message
        return
    } else if (language === 'en') {
      audioUrl = 'http://api.voicerss.org/?key=d82d61580df94313868c46be1cc7e5a4&hl=en-ca&v=Clara&src=' + message
      console.log('audioUrl', audioUrl)
    }

   const audio = new Sound(audioUrl, '', err => {
      if (err) {
        return;
      }
      console.log('audio?.getDuration()', audio?.getDuration())
        audio.play((success) => {
          if (success) {
            console.log('successfully finished playing');
             audio.release()
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
    });
}

export default AIAudio

