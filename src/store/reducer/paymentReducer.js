import {
    SET_PAYMENT_OBJECT,
    SET_ALL_CARDS
} from '../types';
import sendRequest from '../../helpers/AxiosApiRequest';
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
        sendRequest({
            url: `${BASE_URL}/stripe/get-all-user-card`,
            method: 'GET',
            params: {
                limit: 10
            }
        })
            .then((response) => {
                if (response.success) {
                    dispatch(setAllCards(response.data.data));
                    resolve(response.data.data);
                } else {
                    reject();
                }
            }).catch((err) => {
                console.log('error___', err);
                reject();
            });
    });

export const addCard = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        sendRequest({
            url: `${BASE_URL}/stripe/save-user-card`,
            method: 'POST',
            data
        })
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
        sendRequest({
            url: `${BASE_URL}/stripe/delete-user-card`,
            method: 'POST',
            data
        })
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
        sendRequest({
            url: `${BASE_URL}/stripe/payment-intent`,
            method: 'POST',
            data
        })
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });

export const getTransactionHash = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        sendRequest({
            url: `${BASE_URL}/stripe/confirm-payment-intent`,
            method: 'POST',
            data
        })
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });

export const updateTransactionSuccess = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        sendRequest({
            url: `${BASE_URL}/stripe/transaction-success`,
            method: 'POST',
            data
        })
            .then((response) => {

                resolve(response);

            }).catch((err) => {
                reject();
            });
    });
