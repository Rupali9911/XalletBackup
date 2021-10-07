import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AUTH_SUCCESS, AUTH_LOADING_START, AUTH_LOADING_END, UPDATE_CREATE
  
} from '../types';

const initialState = {
  loading: true,
  wallet: null,
  isCreate: false
};

export default UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_LOADING_START:
            return {
                ...state,
                loading: true,
            };

        case AUTH_LOADING_END:
            return {
                ...state,
                loading: false,
            };

        case AUTH_SUCCESS:
            return {
                ...state,
                wallet: action.payload.data,
                isCreate: action.payload.isCreate,
                loading: false
            };

        case UPDATE_CREATE:
            return {
                ...state,
                isCreate: false
            };

        default:
            return state;
    }
}

export const startLoading = () => ({
  type: AUTH_LOADING_START,
});

const endLoading = () => ({
  type: AUTH_LOADING_END,
});

const setUserData = (data) => ({
    type: AUTH_SUCCESS,
    payload: data
});

export const startLoader = () => (dispatch) => 
    new Promise((resolve, reject) => {
        dispatch(startLoading());
        setTimeout(()=>{
            resolve();
        },500);
    });

export const endLoader = () => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(endLoading());
        resolve();
    });

export const loadFromAsync = () => (dispatch) => 
    new Promise(async (resolve, reject) => {
        dispatch(startLoading());
        const wallet = await AsyncStorage.getItem('@wallet',(err)=>console.log(err));
        if(wallet){
            dispatch(setUserData({data: JSON.parse(wallet), isCreate: false}));
        }else{
            dispatch(endLoading());
        }
    });

export const setUserAuthData = (data,isCreate = false) => (dispatch) =>
    new Promise(async (resolve, reject) => {
        dispatch(startLoading());
        await AsyncStorage.setItem('@wallet',JSON.stringify(data),(err)=>console.log(err));
        dispatch(setUserData({data, isCreate}));
    });

export const updateCreateState = () => (dispatch) => 
new Promise((resolve, reject) => {
    dispatch({type: UPDATE_CREATE});
    resolve();
});