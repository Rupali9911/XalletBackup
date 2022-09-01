import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import {
    loadFromAsync,
} from '../store/reducer/userReducer';
import { getAllLanguages, setAppLanguage } from '../store/reducer/languageReducer';
import { languageArray } from '../walletUtils';
import * as RNLocalize from 'react-native-localize';
import { getAccessToken } from '../helpers/AxiosApiRequest';

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
        dispatch(getAllLanguages());
        try {
            const token = await getAccessToken('ACCESS_TOKEN');
            if (token) {
                let asyncData = {};
                let values = await AsyncStorage.multiGet(['@USERDATA', '@BackedUp', '@apps', '@language'])
                asyncData["userData"] = JSON.parse(values[0][1]);
                asyncData["BackedUp"] = values[1][1] ? JSON.parse(values[1][1]) : values[1][1]
                asyncData["apps"] = values[2][1] ? JSON.parse(values[2][1]) : values[2][1];
                let value = values[3][1] ? JSON.parse(values[3][1]) : values[3][1];
                dispatch(loadFromAsync(asyncData));
                dispatch(setAppLanguage(value));
            } else {
                let item = languageArray.find(
                    item => item.language_name == regionLanguage,
                );
                dispatch(setAppLanguage(item));
                dispatch(loadFromAsync());
            }

        } catch (error) {
            console.log("@@@ Token in appSplash =========>", error);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <Image source={require('../../assets/images/splash.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
        </View>
    )
}

export default appSplash;