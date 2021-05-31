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
    // console.log(parseFloat(val));
    return parseFloat(val);
  }
}
