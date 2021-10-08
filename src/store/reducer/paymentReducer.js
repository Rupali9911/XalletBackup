import {
    SET_PAYMENT_OBJECT,
    SET_ALL_CARDS
} from '../types';
import { ApiRequest, BASE_URL } from '../../helpers/ApiRequest';

const initialState = {
    paymentObject: null,
    myCards: []
}

export default UserReducer = (state = initialState, action) => {
    switch(action.type){
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
        console.log('headers',headers);
        ApiRequest(`https://testapi.xanalia.com/stripe/get-all-user-card?limit=10`,'GET', null, headers)
            .then((response) => {
                console.log('response',response);
                if(response.success){
                    dispatch(setAllCards(response.data.data));
                    resolve(response.data.data);
                }else{
                    reject();
                }
            }).catch((err) => {
                console.log('err',err);
                reject();
            });
    });

export const addCard = (token, data) => (dispatch) => 
new Promise((resolve, reject) => {
    let headers = {
        'Authorization': `Bearer ${token}`
    }
    console.log('headers',headers);
    ApiRequest(`${BASE_URL}stripe/save-user-card`,'POST', data, headers)
        .then((response) => {
            console.log('response',response);
            if(response.success){
                resolve(response);
            }else{
                reject(response);
            }
        }).catch((err) => {
            console.log('err',err);
            reject(err);
        });
});

export const deleteCard = (token, data) => (dispatch) => 
new Promise((resolve, reject) => {
    let headers = {
        'Authorization': `Bearer ${token}`
    }
    console.log('headers',headers);
    ApiRequest(`${BASE_URL}stripe/delete-user-card`,'POST', data, headers)
        .then((response) => {
            console.log('response',response);
            if(response.success){
                resolve(response);
            }else{
                reject();
            }
        }).catch((err) => {
            console.log('err',err);
            reject();
        });
});

export const getPaymentIntent = (token, data) => (dispatch) =>
    new Promise((resolve, reject) => {
        let headers = {
            'Authorization': `Bearer ${token}`
        }
        console.log('headers', headers);
        ApiRequest(`${BASE_URL}stripe/payment-intent`, 'POST', data, headers)
            .then((response) => {
                console.log('response', response);
                if (response.success) {
                    resolve(response);
                } else {
                    reject();
                }
            }).catch((err) => {
                console.log('err', err);
                reject();
            });
    });