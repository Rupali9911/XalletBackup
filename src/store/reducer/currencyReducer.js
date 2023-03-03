import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    SET_CURRENCY_SELECTED,
} from '../types';

const setSelectedCurrency = data => ({
    type: SET_CURRENCY_SELECTED,
    payload: {
        data: data,
    },
});

const initialState = {
    selectedCurrency: {
        currency_id: 1,
        currency_display: 'USD - United States Dollar',
        currency_name: 'USD',
        currency_sign: '$'
    }
};

export default CurrencyReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCY_SELECTED:
            return {
                ...state,
                selectedCurrency: action.payload.data,
            };
        default:
            return state;
    }
}

//Set Selected Currency
export const setAppCurrency = currency => dispatch => {
    AsyncStorage.setItem('@currency', JSON.stringify(currency));
    dispatch(setSelectedCurrency(currency));
};



