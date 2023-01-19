import addComma from '../utils/insertComma';
import { divideNo } from '../utils';
//=========================== showActualValue Function =======================
export function showActualValue(data, decimalValue, returnType) {
  let value = data.toString();
  let val;
  if (parseFloat(value) === 0) {
    val = parseFloat(value).toFixed(2);
    return val;
  }
  if (parseFloat(value) > 0) {
    if (!value.includes(".")) {
      value = value + ".0";
    }
    let split = value.split(".");

    val = split[0] + "." + split[1].slice(0, decimalValue);
  } else {
    val = parseFloat(value).toFixed(decimalValue);
  }
  if (returnType === "string") {
    let splited = val.split(".")[1];
    let index = "";
    for (let i = 0; i < splited.length; i++) {
      let afterAllZero = true;
      for (let j = i; j < splited.length; j++) {
        if (splited[j] !== "0") {
          afterAllZero = false;
          break;
        }
      }
      if (afterAllZero) {
        index = i;
        break;
      }
    }
    if (index !== "") {
      if (index === 0) {
        let v = val.split(".")[0] + "." + "00";
        return v.toString();
      } else {
        let v = val.split(".")[0] + "." + splited.slice(0, index + 1);
        return v.toString();
      }
    }
    return val.toString();
  } else if (returnType === "number") {
    return parseFloat(val);
  }
}
//=========================== trimZeroFromTheEnd Function =======================
export function trimZeroFromTheEnd(val) {
  let str = val.toString();
  if (str.includes(".")) {
    let decimalPart = str.split(".")[1];
    let nonDecimalPart = str.split(".")[0];
    for (let i = 0; i < decimalPart.length; i++) {
      let index;
      let isZero = true;
      for (let j = i + 1; j < decimalPart.length; j++) {
        if (decimalPart[j] !== "0") {
          isZero = false;
          index = i;
          break;
        }
      }
      if (isZero) {
        return nonDecimalPart + "." + decimalPart.slice(0, i + 1);
      }
    }
  }
  return str;
}
//=========================== convertPrice Function =======================
export function convertPrice(price2, detail, tradeCurrency) {
  let data = price2
    ? detail.currency_type === 'dollar'
      ? addComma(
        trimZeroFromTheEnd(
          showActualValue(parseFloat(price2.toString()), 4, 'number'),
          true,
        ),
        true,
      )
      : addComma(
        trimZeroFromTheEnd(showActualValue(price2, 6, 'number'), true),
        true,
      ) +
      ' ' +
      tradeCurrency
    : '';

  return data;
};
//=========================== getPrice Function =======================
export function getPrice(aPrice, bPrice) {
  return aPrice && parseFloat(divideNo(parseInt(aPrice?._hex, 16))) > 0
    ? divideNo(parseInt(aPrice._hex, 16))
    : bPrice
      ? divideNo(parseInt(bPrice._hex, 16))
      : '';
};
//=========================== collectionClick Function =======================
export function collectionClick(collectCreat) {
  if (collectCreat?.userId === '0') {
    return true;
  } else {
    switch (collectCreat?.collectionName) {
      case 'ULTRAMAN':
        return true;
      case 'MONKEY COSER 101':
        return true;
      case 'Underground City':
        return true;
      case 'TIF2021 After Party':
        return true;
      case 'Shinnosuke Tachibana':
        return true;
      case 'XANA Alpha pass':
        return true;
      case 'Shinnosuke Tachibana TEST':
        return true;
      default:
        return false;
    }
  }
};
//=========================== firstCellData Function =======================
export function firstCellData(detail) {
  if (detail && detail?.price && detail?.currency_type) {
    return (
      '$ ' +
      addComma(
        trimZeroFromTheEnd(
          showActualValue(parseFloat(detail?.price?.toString()), 4, 'number'),
          true,
        ),
        true,
      )
    );
  } else if (detail && detail?.price && detail?.tradeCurrency) {
    return (
      addComma(
        trimZeroFromTheEnd(showActualValue(detail?.price, 6, 'number'), true),
        true,
      ) +
      ' ' +
      detail?.tradeCurrency
    );
  } else {
    return detail?.price;
  }
  // return detail && detail?.price
  //   ? (detail?.currency_type && detail?.tradeCurrency)
  //     ? '$ ' +
  //       addComma(
  //         trimZeroFromTheEnd(
  //           showActualValue(
  //             parseFloat(detail?.price?.toString()),
  //             4,
  //             'number',
  //           ),
  //           true,
  //         ),
  //         true,
  //       )
  //     : addComma(
  //         trimZeroFromTheEnd(
  //           showActualValue(detail?.price, 6, 'number'),
  //           true,
  //         ),
  //         true,
  //       ) +
  //       ' ' +
  //       detail?.tradeCurrency
  //   : '';
};
//=========================== fourthCellData Function =======================
export function fourthCellData(detail) {
  return detail?.buy ? showDate(detail?.buyDateTime) : detail?.sellDateTime;
};

const showDate = t => {
  var s = moment.utc(t).local().format('YYYY/MM/DD HH:mm:ss');
  return s?.toString();
};



