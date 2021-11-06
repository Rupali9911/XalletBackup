import { batch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SET_LANGUAGE_SELECTED,
  SET_ENGLISH_LANGUAGE,
  SET_JAPAN_LANGUAGE,
  SET_KOREA_LANGUAGE,
  SET_CHINA_LANGUAGE,
  SET_TAIWAN_LANGUAGE
} from '../types';
import { setI18nConfig } from "../../walletUtils";

const initialState = {
  loading: false,
  selectedLanguageItem: {
    language_id: 0,
    language_name: 'en',
    selected: false,
  },
  en: require('../../translations/en.json'),
  ja: require('../../translations/ja.json'),
  ko: require('../../translations/ko.json'),
  ch: require('../../translations/ch.json'),
  tw: require('../../translations/tw.json'),
};

export default LanguageReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_LANGUAGE_SELECTED:
      return {
        ...state,
        selectedLanguageItem: action.payload.data,
      };

    case SET_ENGLISH_LANGUAGE:
      return {
        ...state,
        en: action.payload.data,
      };

    case SET_JAPAN_LANGUAGE:
      return {
        ...state,
        ja: action.payload.data,
      };

    case SET_KOREA_LANGUAGE:
      return {
        ...state,
        ko: action.payload.data,
      };

    case SET_CHINA_LANGUAGE:
      return {
        ...state,
        ch: action.payload.data,
      };

    case SET_TAIWAN_LANGUAGE:
      return {
        ...state,
        tw: action.payload.data,
      };

    default:
      return state;
  }
}

let languages = [
  'en.json',
  'ja.json',
  'ko.json',
  'zh-hans.json',
  'zh-hant.json',
];

let languageRequests = languages.map((name) =>
  fetch(`https://d2xw2jn71az7zi.cloudfront.net/lang/xanalia-app/${name}`),
);

export const getAllLanguages = () => (dispatch) =>
  Promise.all(languageRequests)
    .then((responses) => {
      return responses;
    })
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((languages) => {
      if (languages && languages.length > 0) {
        languages = languages.map(function (el) {
          var o = Object.assign(el);
          // o.selected = false;
          return o;
        });
      }
      // console.log('Languages',JSON.stringify(languages))
      batch(() => {
        dispatch(setEnglishLanguage(languages[0]));
        dispatch(setJapanLanguage(languages[1]));
        dispatch(setKoreaLanguage(languages[2]));
        dispatch(setChinaLanguage(languages[3]));
        dispatch(setTaiwanLanguage(languages[4]));
      });
    }).catch((error) => {
      console.log(error);
    });

//Set Selected Language
export const setAppLanguage = (data) => (dispatch) => {
  AsyncStorage.setItem('@language', JSON.stringify(data));
  dispatch(setSelectedLanguage(data));
  setI18nConfig(data.language_name);
}

const setSelectedLanguage = (data) => ({
  type: SET_LANGUAGE_SELECTED,
  payload: {
    data: data,
  },
});

const setEnglishLanguage = (data) => ({
  type: SET_ENGLISH_LANGUAGE,
  payload: {
    data: data,
  },
});

const setJapanLanguage = (data) => ({
  type: SET_JAPAN_LANGUAGE,
  payload: {
    data: data,
  },
});

const setKoreaLanguage = (data) => ({
  type: SET_KOREA_LANGUAGE,
  payload: {
    data: data,
  },
});

const setChinaLanguage = (data) => ({
  type: SET_CHINA_LANGUAGE,
  payload: {
    data: data,
  },
});

const setTaiwanLanguage = (data) => ({
  type: SET_TAIWAN_LANGUAGE,
  payload: {
    data: data,
  },
});