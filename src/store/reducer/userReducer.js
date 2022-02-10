import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {
  AUTH_SUCCESS,
  HIDE_SPLASH,
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
  LOG_OUT,
} from '../types';
import { getSig } from '../../screens/wallet/functions';
import { BASE_URL } from '../../common/constants';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';
import { setConnectedApps } from './walletReducer';

const initialState = {
  loading: false,
  showSplash: true,
  mainLoader: false,
  wallet: null,
  isCreate: false,
  data: {},
  passcode: '',
  passcodeAsync: '',
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
    case HIDE_SPLASH:
      return {
        ...state,
        showSplash: false,
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
        loading: true,
      };
    case SET_PASSCODE_ASYNC:
      return {
        ...state,
        passcode: action.payload,
        passcodeAsync: action.payload,
        loading: true,
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
        loading: false,
      };

    case UPDATE_CREATE:
      return {
        ...state,
        isCreate: false,
        showSuccess: false,
      };

    case UPDATE_PROFILE:
      let _data = state.data;
      _data.user = action.payload;
      return {
        ...state,
        data: { ..._data },
      };

    case UPDATE_BACKUP:
      return {
        ...state,
        isBackup: action.payload,
        loading: false,
      };

    case LOG_OUT:
      return {
        ...state,
        wallet: null,
      };
    default:
      return state;
  }
};

export const startLoading = () => ({
  type: AUTH_LOADING_START,
});
export const hideSplash = () => ({
  type: HIDE_SPLASH,
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

export const updateAsyncPasscodeAction = payload => ({
  type: UPDATE_ASYNC_PASSCODE,
  payload,
});

export const setBackup = data => ({
  type: UPDATE_BACKUP,
  payload: data,
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

export const loadFromAsync = asyncData => (dispatch, getState) => {
  if (asyncData && asyncData.wallet && asyncData.userData) {
    const { wallet, userData, BackedUp, apps } = asyncData;
    wallet.address = String(wallet.address).toLowerCase();
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

    let req_data = {
      owner:  userData.user._id,
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
        if (typeof(res.data) !== 'string' && res.data) {
          console.log('Response /xanalia/getProfile', res, JSON.stringify(req_data))
          dispatch(upateUserData(res.data));
        }
        dispatch(endMainLoading());
        dispatch(hideSplash());
      })
      .catch(e => {
        dispatch(hideSplash());
        dispatch(endMainLoading());

        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  } else {
    dispatch(hideSplash());
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
    const url = `${BASE_URL}/auth/get-address-nonce`;
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
        console.log('response', response);
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
              `${BASE_URL}/auth/verify-signature`,
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
                wallet.address = String(wallet.address).toLowerCase();
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
              console.log('error 2', err);
              dispatch(endLoading());
              reject(err);
            });
        } else {
          dispatch(endLoading());
          reject(response);
        }
      })
      .catch(err => {
        console.log('error', err);
        dispatch(endLoading());
        reject(err);
      });
  });

export const setBackupStatus = data => dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(startLoading());
    AsyncStorage.setItem('@BackedUp', JSON.stringify(data));
    dispatch(setBackup(true));
  });

export const signOut = () => {
  return (dispatch, getState) => {
    AsyncStorage.removeItem('@wallet');
    dispatch(logout());
  };
};

export const updateProfileImage = formData => async (dispatch, getState) => {
  dispatch(startLoading());

  const { data } = getState().UserReducer;
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
  await axios
    .post(`${BASE_URL}/user/update-profile-image`, formData)
    .then(res => {
      dispatch(upateUserData(res.data.data));
    })
    .catch(err => {
      dispatch(endLoading());
      if (err.response.status === 401) {
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('common.sessionexpired'),
          () => {
            console.log(err);
          },
        );
        dispatch(signOut());
      }
      alertWithSingleBtn(
        translate('wallet.common.alert'),
        translate('wallet.common.error.networkFailed'),
        () => {
          console.log(err);
        },
      );
    });
};

export const updateProfile =
  (props, callBack) => async (dispatch, getState) => {
    dispatch(startLoading());

    const { data } = getState().UserReducer;
    const config = {
      method: 'post',
      url: `${BASE_URL}/user/update-user-profile`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
      data: props,
    };

    await axios(config)
      .then(res => {
        let data = res.data.data;
        dispatch(upateUserData(data));
        dispatch(endLoading());
        callBack();
      })
      .catch(err => {
        dispatch(endLoading());

        if (err.response.status === 401) {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.sessionexpired'),
            () => {
              console.log(err);
            },
          );
          dispatch(signOut());
          return;
        }
        if (err.response.data.data === 'email already taken') {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.emailexists'),
            () => {
              console.log(err);
            },
          );
        } else if (err.response.data.data === 'username already taken') {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('common.usrnameexists'),
            () => {
              console.log(err.response.data.data);
            },
          );
        } else {
          alertWithSingleBtn(
            translate('wallet.common.alert'),
            translate('wallet.common.error.networkFailed'),
            () => {
              console.log(err);
            },
          );
        }
      });
  };
