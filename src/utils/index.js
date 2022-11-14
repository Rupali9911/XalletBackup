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
export const maxLength32 = maxLength(32);
export const maxLength50 = maxLength(50);
export const maxLength100 = maxLength(100);
export const maxLength200 = maxLength(200);

const min = 6,
  max = 32;

// const regex = new RegExp(
//   `^(?=.{${min},${max}}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`,
// );
const userNameRegex = new RegExp(
  /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
);
const regex = new RegExp(
  /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/,
);
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const linkRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const required = value => (value ? undefined : 'Required');

export const validateUserName = value => {
  if (!value.trim().length) {
    return translate('common.REQUIRED_USERNAME');
  } else if (!userNameRegex.test(value)) {
    return translate('common.VALIDATE_USERNAME');
  }
};

export const validateEmail = value =>
  value && !emailRegex.test(value)
    ? translate('common.CHECK_YOUR_EMAIL')
    : undefined;

export const validateWebsiteURL = value =>
  value && !linkRegex.test(value)
    ? translate('common.CHECK_YOUR_WEBSITE')
    : undefined;

export const validateDiscordURL = value =>
  value && !linkRegex.test(value)
    ? translate('common.CHECK_YOUR_DISCORD')
    : undefined;

export const validateTwitterURL = value =>
  value && !regex.test(value)
    ? translate('common.CHECK_YOUR_TWITTER')
    : undefined;

export const validateYoutubeURL = value =>
  value && !linkRegex.test(value)
    ? translate('common.CHECK_YOUR_YOUTUBE')
    : undefined;

export const validateInstagramURL = value =>
  value && !regex.test(value)
    ? translate('common.CHECK_YOUR_INSTAGRAM')
    : undefined;

export const validateFacebookURL = value =>
  value && !linkRegex.test(value) ? translate('common.validfblink') : undefined;

export const validateZoomLinkURL = value =>
  value && !linkRegex.test(value) ? translate('common.emailval') : undefined;

export const convertValue = value => {
  var suffixes = ['', 'k', 'MM', 'b', 't'];
  var suffixNum = Math.floor(('' + parseInt(value)).length / 4);
  var shortValue = parseFloat(
    suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value,
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue?.toFixed(3);
  }
  return shortValue + suffixes[suffixNum];
};
