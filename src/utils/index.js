import Big from "big-js";
import BigNumber from 'bignumber.js';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import store from "../store";
import { Alert } from "react-native";

export const divideNo = (res) => {
  if (typeof res === "string" && res === "") {
    res = "0";
  }
  let bigNo = new Big(res);
  let bigNo1 = new Big(Math.pow(10, 18));
  let number = bigNo.div(bigNo1).toFixed(18);
  return number;
};

export const convertHexToString = (hex) => {
  return new BigNumber(hex).toString();
};

export const convertStringToNumber = (value) => {
  return new BigNumber(value).toNumber();
};

export const convertStringToHex = (value) => {
  return new BigNumber(value).toString(16);
};

export const convertAmountToRawNumber = (value, decimals) => {
  return new BigNumber(value).times(new BigNumber('10').pow(decimals)).toString();
};

export const divide = (numberOne, numberTwo) => {
  return new BigNumber(numberOne).dividedBy(new BigNumber(numberTwo)).toString();
}

export const multiply = (numberOne, numberTwo) => {
  return new BigNumber(numberOne).times(new BigNumber(numberTwo)).toString();
}

export function sanitizeHex(hex) {
  hex = hex.substring(0, 2) === "0x" ? hex.substring(2) : hex;
  if (hex === "") {
    return "";
  }
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  return "0x" + hex;
}
export function numberWithCommas(x) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return '0';
  }
}

export const languageArray = [
  {
    language_id: 1,
    language_name: 'en',
    language_display: 'English (United States)',
    isSelected: true,
  },
  {
    language_id: 2,
    language_name: 'ko',
    language_display: '한국어',
    isSelected: true,
  },
  {
    language_id: 3,
    language_name: 'ja',
    language_display: '日本語',
    isSelected: true,
  },
  {
    language_id: 4,
    language_name: 'tw',
    language_display: '中文（繁体）',
    isSelected: true,
  },
  {
    language_id: 5,
    language_name: 'ch',
    language_display: '中文（简体）',
    isSelected: true,
  },
];

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export function setI18nConfig(tag) {
  const translationGetters = {
    en: () => store.getState().LanguageReducer.en,
    ja: () => store.getState().LanguageReducer.ja,
    ko: () => store.getState().LanguageReducer.ko,
    ch: () => store.getState().LanguageReducer.ch,
    tw: () => store.getState().LanguageReducer.tw,
  }

  const fallback = { languageTag: tag || 'en' };
  const { languageTag } =
    // RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  translate.cache.clear();

  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
}

export const getLocation = (x0, y0, radius) => {
  // Convert radius from meters to degrees
  let radiusInDegrees = radius / 111000;

  console.log(Math.random());
  let u = Math.random();
  let v = Math.random();
  let w = radiusInDegrees * Math.sqrt(u);
  let t = 2 * Math.PI * v;
  let x = w * Math.cos(t);
  let y = w * Math.sin(t);

  // Adjust the x-coordinate for the shrinking of the east-west distances
  let new_x = x / Math.cos(y0);

  let foundLongitude = new_x + x0;
  let foundLatitude = y + y0;
  console.log("Longitude: " + foundLongitude + "  Latitude: " + foundLatitude);
  return {
    latitude: foundLatitude,
    longitude: foundLongitude
  };
}


const confirmationAlert = (title, message, leftText, rightText, onOkPress, onCancelPress) => {
  Alert.alert(
    title,
    message,
    [
      onCancelPress && {
        text: leftText ? leftText : translate("common.cancel"),
        onPress: () => onCancelPress
      },
      {
        text: rightText ? rightText : "OK",
        onPress: onOkPress
      }
    ]
  );
}

const alertWithSingleBtn = (title, message, onOkPress, btnTxt) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: btnTxt ? btnTxt : "OK",
        onPress: onOkPress
      }
    ]
  );
}

export {
  confirmationAlert,
  alertWithSingleBtn
}
