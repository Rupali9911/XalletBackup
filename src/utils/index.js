import Big from 'big-js';
import BigNumber from 'bignumber.js';
import {Alert} from 'react-native';
import {translate} from '../walletUtils';

export const divideNo = res => {
  if (typeof res === 'string' && res === '') {
    res = '0';
  }
  let bigNo = new Big(res);
  let bigNo1 = new Big(Math.pow(10, 18));
  let number = bigNo.div(bigNo1).toFixed(18);
  return number;
};

export const convertHexToString = hex => {
  return new BigNumber(hex).toString();
};

export const convertStringToNumber = value => {
  return new BigNumber(value).toNumber();
};

export const convertStringToHex = value => {
  return new BigNumber(value).toString(16);
};

export const convertAmountToRawNumber = (value, decimals) => {
  return new BigNumber(value)
    .times(new BigNumber('10').pow(decimals))
    .toString();
};

export const divide = (numberOne, numberTwo) => {
  return new BigNumber(numberOne)
    .dividedBy(new BigNumber(numberTwo))
    .toString();
};

export const multiply = (numberOne, numberTwo) => {
  return new BigNumber(numberOne).times(new BigNumber(numberTwo)).toString();
};

export function sanitizeHex(hex) {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  if (hex === '') {
    return '';
  }
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return '0x' + hex;
}

export function numberWithCommas(x) {
  if (x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } else {
    return '0';
  }
}

export function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

const confirmationAlert = (
  title,
  message,
  leftText,
  rightText,
  onOkPress,
  onCancelPress,
) => {
  Alert.alert(title, message, [
    onCancelPress && {
      text: leftText ? leftText : translate('common.cancel'),
      onPress: () => onCancelPress,
    },
    {
      text: rightText ? rightText : 'OK',
      onPress: onOkPress,
    },
  ]);
};

const alertWithSingleBtn = (title, message, onOkPress, btnTxt) => {
  Alert.alert(title, message, [
    {
      text: btnTxt ? btnTxt : 'OK',
      onPress: onOkPress,
    },
  ]);
};

export {confirmationAlert, alertWithSingleBtn};

// Field Validations
export const maxLength = max => value =>
  value && value.length > max
    ? translate('wallet.common.limitInputLength', {number: max})
    : undefined;

export const maxLength13 = maxLength(13);
export const maxLength20 = maxLength(20);
export const maxLength50 = maxLength(50);
export const maxLength100 = maxLength(100);
export const maxLength200 = maxLength(200);

export const required = value => (value ? undefined : 'Required');
export const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? translate('common.emailval')
    : undefined;
export const validateWebsiteURL = value =>
  value && !validURL(value) ? translate('common.invalidwebURL') : undefined;
export const validateDiscordURL = value =>
  value && !validURL(value) ? translate('common.discordlink') : undefined;
export const validateTwitterURL = value =>
  value && !validURL(value) ? translate('common.validtwiiterlink') : undefined;
export const validateYoutubeURL = value =>
  value && !validURL(value) ? translate('common.youtubelink') : undefined;
export const validateInstagramURL = value =>
  value && !validURL(value) ? translate('common.instagramlink') : undefined;
export const validateFacebookURL = value =>
  value && !validURL(value) ? translate('common.validfblink') : undefined;
export const validateZoomLinkURL = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? translate('common.emailval') : undefined;
