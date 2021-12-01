import React, { useEffect } from 'react';
import {
    SafeAreaView,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { hideSplash, loadFromAsync,
    setPasscodeAsync,
    startMainLoading, } from '../store/reducer/userReducer';
import { getAllLanguages, setAppLanguage } from '../store/reducer/languageReducer';
import { languageArray } from '../walletUtils';
import * as RNLocalize from 'react-native-localize';

const regionLanguage = RNLocalize.getLocales()
    .map(a => a.languageCode)
    .values()
    .next().value;

const appSplash = () => {

    const dispatch = useDispatch();

    React.useEffect(() => {
        
        loadAllData()

    }, []);

    const loadAllData = async () => {
        await dispatch(getAllLanguages());

        // AsyncStorage.clear()
        AsyncStorage.getAllKeys((err, keys) => {
            if (keys.length !== 0) {
                AsyncStorage.multiGet(keys, (err, values) => {
                    let asyncData = {};
                     values.map(result => {
                        let name = result[0].replace(/[^a-zA-Z ]/g, '');
                        let value = JSON.parse(result[1]);
                        asyncData[name] = value;

                        if (name == 'passcode') {
                            dispatch(setPasscodeAsync(value));
                        }
                        if (name == 'language') {
                            dispatch(setAppLanguage(value));
                        }
                    });
                    dispatch(loadFromAsync(asyncData));
                });
            } else {
                let item = languageArray.find(
                    item => item.language_name == regionLanguage,
                );
                dispatch(setAppLanguage(item));
                dispatch(loadFromAsync());
            }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <Image source={require('../../assets/images/splash.png')} style={{ flex: 1, resizeMode: 'contain' }} />
        </SafeAreaView>
    )
}

export default appSplash;