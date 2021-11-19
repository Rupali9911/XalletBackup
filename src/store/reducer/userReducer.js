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
  SET_PASSCODE_ASYNC,
  UPDATE_BACKUP,
  UPDATE_ASYNC_PASSCODE,
  LOG_OUT
} from '../types';
import { getSig } from '../../screens/wallet/functions';
import { BASE_URL } from '../../common/constants';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';
import { setConnectedApps } from './walletReducer';

const initialState = {
  loading: false,
  mainLoader: false,
  wallet: null,
  isCreate: false,
  data: {},
  passcode: "",
  passcodeAsync: "",
  isBackup: false,
  showSuccess: false,
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
    case SET_PASSCODE_ASYNC:
      return {
        ...state,
        passcode: action.payload,
        passcodeAsync: action.payload,
        loading: true
      };
    case UPDATE_ASYNC_PASSCODE:
      return {
        ...state,
        passcodeAsync: action.payload,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        wallet: action.payload.wallet,
        data: action.payload.data,
        isCreate: action.payload.isCreate,
        showSuccess: action.payload.showSuccess,
        loading: false
      };

    case UPDATE_CREATE:
      return {
        ...state,
        isCreate: false,
        showSuccess: false
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
        isBackup: action.payload,
        loading: false
      };

    case LOG_OUT:
      return {
        ...state,
        wallet: null
      }
    default:
      return state;
  }
};

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

const setUserData = data => ({
  type: AUTH_SUCCESS,
  payload: data,
});

export const upateUserData = data => ({
  type: UPDATE_PROFILE,
  payload: data,
});

export const setPasscode = data => ({
  type: SET_PASSCODE,
  payload: data,
});
export const setPasscodeAsync = data => ({
  type: SET_PASSCODE_ASYNC,
  payload: data,
});

export const updateAsyncPasscodeAction = (payload) => ({
  type: UPDATE_ASYNC_PASSCODE,
  payload
});

export const setBackup = (data) => ({
  type: UPDATE_BACKUP,
  payload: data
});

export const logout = () => ({
  type: LOG_OUT,
});

export const _logout = () => ({
  type: 'USER_LOGGED_OUT',
});

export const startLoader = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(startLoading());
    setTimeout(() => {
      resolve();
    }, 500);
  });

export const endLoader = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch(endLoading());
    resolve();
  });

export const loadFromAsync = (asyncData) => (dispatch, getState) => {

  const { wallet, userData, BackedUp, apps } = asyncData;

  if (wallet && userData) {
    dispatch(
      setUserData({
        data: userData,
        wallet: wallet,
        isCreate: false,
        showSuccess: false,
      }),
    );
    dispatch(setBackup(BackedUp));
    apps && dispatch(setConnectedApps(apps));
    const _wallet = wallet;
    let req_data = {
      owner: _wallet.address,
      token: 'HubyJ*%qcqR0',
    };

    let body = {
      method: 'POST',
      body: JSON.stringify(req_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
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
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed')
        );
      });
  } else {
    dispatch(endMainLoading());
  }
};

export const setUserAuthData =
  (data, isCreate = false) =>
    dispatch =>
      new Promise(async (resolve, reject) => {
        dispatch(startLoading());
        AsyncStorage.setItem('@wallet', JSON.stringify(data));
        dispatch(setUserData({ data, isCreate }));
      });

export const updateCreateState = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch({ type: UPDATE_CREATE });
    resolve();
  });

export const getAddressNonce = (wallet, isCreate, isLater) => dispatch =>
  new Promise((resolve, reject) => {
    const url = 'https://testapi.xanalia.com/auth/get-address-nonce';
    const params = {
      publicAddress: wallet.address,
    };

    const request = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    dispatch(startLoading());
    fetch(url, request)
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          const _params = {
            nonce: response.data,
            signature: `${getSig(response.data, wallet.privateKey)}`,
          };

          const verifyReuqest = {
            method: 'POST',
            body: JSON.stringify(_params),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          };
          fetch(
            'https://testapi.xanalia.com/auth/verify-signature',
            verifyReuqest,
          )
            .then(_res => _res.json())
            .then(async _response => {
              if (_response.success) {
                const items = [
                  ['@wallet', JSON.stringify(wallet)],
                  ['@userData', JSON.stringify(_response.data)],
                ];
                await AsyncStorage.multiSet(items);
                dispatch(
                  setUserData({
                    data: _response.data,
                    wallet,
                    isCreate,
                    showSuccess: isLater ? false : true,
                  }),
                );
                resolve();
              } else {
                dispatch(endLoading());
                reject(_response);
              }
            })
            .catch(err => {
              dispatch(endLoading());
              reject(err);
            });
        } else {
          dispatch(endLoading());
          reject(response);
        }
      })
      .catch(err => {
        dispatch(endLoading());
        reject(err);
      });
  });

export const setBackupStatus = (data) => (dispatch) =>
  new Promise(async (resolve, reject) => {
    dispatch(startLoading());
    AsyncStorage.setItem('@BackedUp', JSON.stringify(data));
    dispatch(setBackup(true));
  });

export const signOut = () => {
  return (dispatch, getState) => {
    AsyncStorage.removeItem('@wallet');
    dispatch(logout());
  }
}
