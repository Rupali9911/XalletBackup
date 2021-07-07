/*eslint prettier/prettier:0*/
/**
 * @format
 * @flow
 */

import * as React from 'react';
import {
    Platform, NativeModules
} from 'react-native';
import * as RNLocalize from "react-native-localize";
//  import {isForceRTL} from './BaseValue';

function getLanguage() {
    let langObj = require('../i18n/en.json');
    let langCode = RNLocalize.getCountry();
    if (Platform.OS == 'ios') {
        langCode = Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;
        if (langCode.includes("_")) {
            langCode = langCode.split("_")[0];
        }
    }
    if (langCode.toLocaleLowerCase() === "jp" || langCode.toLocaleLowerCase() === "ja") {
        langObj = require('../i18n/ja.json');
    }
    if (langCode.toLocaleLowerCase() === "kr" || langCode.toLocaleLowerCase() === "ko-kore") {
        langObj = require('../i18n/ko.json');
    }
    if (langCode.toLocaleLowerCase() === "cn" || langCode.toLocaleLowerCase() === "zh") {
        langObj = require('../i18n/zh-hans.json');
    }
    return langObj;
}

export default getLanguage;
