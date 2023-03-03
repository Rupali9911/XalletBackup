import React from 'react';
import {View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loadFromAsync} from '../store/reducer/userReducer';
import {
  getAllLanguages,
  setAppLanguage,
} from '../store/reducer/languageReducer';
import {
  setAppCurrency,
} from '../store/reducer/currencyReducer';
import {languageArray, regionLanguage} from '../walletUtils';
import * as RNLocalize from 'react-native-localize';
import {getAccessToken} from '../helpers/AxiosApiRequest';

const appSplash = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await dispatch(getAllLanguages());
    try {
      const token = await getAccessToken('ACCESS_TOKEN');
      const tempLanguage = await AsyncStorage.getItem('@language');
      if (token) {
        let asyncData = {};
        let values = await AsyncStorage.multiGet([
          '@USERDATA',
          '@BackedUp',
          '@apps',
          '@language',
          '@currency',
        ]);
        asyncData['userData'] = JSON.parse(values[0][1]);
        asyncData['BackedUp'] = values[1][1]
          ? JSON.parse(values[1][1])
          : values[1][1];
        asyncData['apps'] = values[2][1]
          ? JSON.parse(values[2][1])
          : values[2][1];
        let value = values[3][1] ? JSON.parse(values[3][1]) : values[3][1];
        let currency = values[4][1] ? JSON.parse(values[4][1]) : values[4][1];
        dispatch(loadFromAsync(asyncData));
        dispatch(setAppLanguage(value));
        dispatch(setAppCurrency(currency));
      } else {
        let regionalLanguage = languageArray.find(
          language => language.language_name == regionLanguage,
        );
        if (tempLanguage) {
          let storedLanguage = JSON.parse(tempLanguage);
          dispatch(setAppLanguage(storedLanguage));
        } else {
          dispatch(setAppLanguage(regionalLanguage));
        }
        dispatch(loadFromAsync());
      }
    } catch (error) {}
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
      <Image
        source={require('../../assets/images/splash.png')}
        style={{width: '100%', height: '100%', resizeMode: 'contain'}}
      />
    </View>
  );
};

export default appSplash;
