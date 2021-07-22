import Big from "big-js";
import BigNumber from 'bignumber.js';

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