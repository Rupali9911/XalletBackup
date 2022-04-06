import {
    SET_PAYMENT_OBJECT,
    SET_ALL_CARDS
} from '../types';
import { ApiRequest } from '../../helpers/ApiRequest';
import { BASE_URL } from '../../common/constants';

const initialState = {
    paymentObject: null,
    myCards: []
}

export default UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PAYMENT_OBJECT:
            return {
                ...state,
                paymentObject: action.payload
            }
        case SET_ALL_CARDS:
            return {
                ...state,
                myCards: [...action.payload]
            }
        default:
            return state;
    }
}

export const setPaymentObject = (data) => ({
    type: SET_PAYMENT_OBJECT,
    payload: data
});

export const setAllCards = (data) => ({
    type: SET_ALL_CARDS,
    payload: data
});

export const getAllCards = (token) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        ApiRequest(`${BASE_URL}/stripe/get-all-user-card?limit=10`, 'GET', null, headers)
            .then((response) => {
                if (response.success) {
                    dispatch(setAllCards(response.data.data));
                    resolve(response.data.data);
                } else {
                    reject();
                }
            }).catch((err) => {
                console.log('error___',err);
                reject();
            });
    });

export const addCard = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        console.log('request data save user card', data)
        ApiRequest(`${BASE_URL}/stripe/save-user-card`, 'POST', data, headers)
            .then((response) => {
                if (response.success) {
                    resolve(response);
                } else {
                    reject(response);
                }
            }).catch((err) => {
                reject(err);
            });
    });

export const deleteCard = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        ApiRequest(`${BASE_URL}/stripe/delete-user-card`, 'POST', data, headers)
            .then((response) => {
                if (response.success) {
                    resolve(response);
                } else {
                    reject();
                }
            }).catch((err) => {
                reject();
            });
    });

export const getPaymentIntent = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        ApiRequest(`${BASE_URL}/stripe/payment-intent`, 'POST', data, headers)
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });

export const getTransactionHash = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        ApiRequest(`${BASE_URL}/stripe/confirm-payment-intent`, 'POST', data, headers)
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });

export const updateTransactionSuccess = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        ApiRequest(`${BASE_URL}/stripe/transaction-success`, 'POST', data, headers)
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });
