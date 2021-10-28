import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    AUTH_SUCCESS,
    AUTH_LOADING_START,
    AUTH_LOADING_END,
    MAIN_LOADING_END,
    MAIN_LOADING_START,
    UPDATE_CREATE,
    UPDATE_PROFILE,
    SET_PASSCODE,
    UPDATE_BACKUP
} from '../types';
import { getSig } from '../../screens/wallet/functions';
import { BASE_URL } from '../../common/constants';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';

const initialState = {
    loading: false,
    mainLoader: false,
    wallet: null,
    isCreate: false,
    data: {},
    passcode: "",
    isBackup: false
};

export default UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case MAIN_LOADING_START:
            return {
                ...state,
                mainLoader: true,
            };

        case MAIN_LOADING_END:
            return {
                ...state,
                mainLoader: false,
            };
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

        case SET_PASSCODE:
            return {
                ...state,
                passcode: action.payload,
                loading: true
            };

        case AUTH_SUCCESS:
            return {
                ...state,
                wallet: action.payload.wallet,
                data: action.payload.data,
                isCreate: action.payload.isCreate,
                loading: false
            };

        case UPDATE_CREATE:
            return {
                ...state,
                isCreate: false
            };

        case UPDATE_PROFILE:
            let _data = state.data;
            _data.user = action.payload;
            return {
                ...state,
                data: { ..._data }
            }

        case UPDATE_BACKUP:
            return {
                ...state,
                isBackup: action.payload
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
export const startMainLoading = () => ({
    type: MAIN_LOADING_START,
});

export const endMainLoading = () => ({
    type: MAIN_LOADING_END,
});

const setUserData = (data) => ({
    type: AUTH_SUCCESS,
    payload: data
});

export const upateUserData = (data) => ({
    type: UPDATE_PROFILE,
    payload: data
})

export const setPasscode = (data) => ({
    type: SET_PASSCODE,
    payload: data
})

export const startLoader = () => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(startLoading());
        setTimeout(() => {
            resolve();
        }, 500);
    });

export const endLoader = () => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(endLoading());
        resolve();
    });

export const setBackupStatus = (data) => ({
    type: UPDATE_BACKUP,
    payload: data
});

export const loadFromAsync = () => async (dispatch) => {
    const wallet = await AsyncStorage.getItem('@wallet', (err) => console.log(err));
    const userData = await AsyncStorage.getItem('@userData', (err) => console.log(err));
    // console.log(wallet, userData)
    if (wallet && userData) {
        dispatch(setUserData({ data: JSON.parse(userData), wallet: JSON.parse(wallet), isCreate: false }));
        const _wallet = JSON.parse(wallet);
        let req_data = {
            owner: _wallet.address,
            token: 'HubyJ*%qcqR0'
        };

        let body = {
            method: 'POST',
            body: JSON.stringify(req_data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
        fetch(`${BASE_URL}/xanalia/getProfile`, body)
            .then(response => response.json())
            .then(res => {
                if (res.data) {
                    dispatch(upateUserData(res.data));
                }
                dispatch(endMainLoading());

            })
            .catch(e => {
                dispatch(endMainLoading());
                alertWithSingleBtn(
                    translate("wallet.common.alert"),
                    translate("wallet.common.error.networkFailed"),
                    () => {
                        console.log(e);
                    }
                );
            })
    } else {
        dispatch(endMainLoading());
    }
}

export const setUserAuthData = (data, isCreate = false) => (dispatch) =>
    new Promise(async (resolve, reject) => {
        dispatch(startLoading());
        await AsyncStorage.setItem('@wallet', JSON.stringify(data), (err) => console.log(err));
        dispatch(setUserData({ data, isCreate }));
    });

export const updateCreateState = () => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch({ type: UPDATE_CREATE });
        resolve();
    });

export const getAddressNonce = (wallet, isCreate) => (dispatch) =>
    new Promise((resolve, reject) => {
        const url = "https://testapi.xanalia.com/auth/get-address-nonce";
        const params = {
            publicAddress: wallet.address
        }
        console.log('params',params);
        const request = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }

        dispatch(startLoading());
        fetch(url, request).then((res) => res.json())
            .then((response) => {
                if (response.success) {

                    const _params = {
                        nonce: response.data,
                        signature: `${getSig(response.data, wallet.privateKey)}`
                    }

                    const verifyReuqest = {
                        method: 'POST',
                        body: JSON.stringify(_params),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    }

                    fetch('https://testapi.xanalia.com/auth/verify-signature', verifyReuqest).then((_res) => _res.json())
                        .then(async (_response) => {
                            if (_response.success) {
                                const items = [['@wallet', JSON.stringify(wallet)], ['@userData', JSON.stringify(_response.data)]]
                                await AsyncStorage.multiSet(items, (err) => console.log(err));
                                dispatch(setUserData({ data: _response.data, wallet, isCreate }));
                                resolve();
                            } else {
                                dispatch(endLoading());
                                reject(_response);
                            }
                        }).catch((err) => {
                            dispatch(endLoading());
                            reject(err);
                        });

                } else {
                    dispatch(endLoading());
                    reject(response);
                }
            }).catch((err) => {
                dispatch(endLoading());
                reject(err);
            });
    });