import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

import {
  CONNECT_MODAL_STATE,
  AUTH_SUCCESS,
  HIDE_SPLASH,
  UPDATE_PASS_ASYNC,
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
import { BASE_URL, NEW_BASE_URL } from '../../common/constants';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';
import { setConnectedApps } from './walletReducer';
import sendRequest, { getAccessToken } from '../../helpers/AxiosApiRequest';
import { reject } from 'lodash';
import { resolve } from 'path-browserify';

const initialState = {
  loading: false,
  showSplash: true,
  mainLoader: false,
  wallet: null,
  isCreate: false,
  userData: null,
  passcode: '',
  passcodeAsync: '',
  passcodeAsyncStatus: false,
  isBackup: false,
  showSuccess: false,
  connectModalState: false
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
    case CONNECT_MODAL_STATE:
      return {
        ...state,
        connectModalState: action.payload,
      };
    case UPDATE_PASS_ASYNC:
      return {
        ...state,
        passcodeAsyncStatus: action.payload,
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
        passcodeAsync: action.payload
      };
    case UPDATE_ASYNC_PASSCODE:
      return {
        ...state,
        passcodeAsync: action.payload,
      };

    case AUTH_SUCCESS:
      return {
        ...state,
        userData: action.payload.data,
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
      let _data = action.payload;
      // _data.user = action.payload;
      console.log(action.payload,'payload')
      return {
        ...state,
        userData: { ..._data },
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
export const updatePassStatus = (data) => ({
  type: UPDATE_PASS_ASYNC,
  payload: data,
});
export const hideSplash = () => ({
  type: HIDE_SPLASH,
});

export const connectStateModal = (data) => ({
  type: CONNECT_MODAL_STATE,
  payload: data
});

export const endLoading = () => ({
  type: AUTH_LOADING_END,
});
export const startMainLoading = () => ({
  type: MAIN_LOADING_START,
});

export const endMainLoading = () => ({
  type: MAIN_LOADING_END,
});

export const setUserData = data => ({
  type: AUTH_SUCCESS,
  payload: data,
});

export const updateUserData = data => ({
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
  if (asyncData && asyncData.userData) {
    const { userData, BackedUp, apps } = asyncData;
    dispatch(
      setUserData({
        data: userData,
        isCreate: false,
        showSuccess: false,
      }),
    );

    BackedUp && dispatch(setBackup(BackedUp));
    apps && dispatch(setConnectedApps(apps));
    // const _wallet = wallet;

    // let req_data = {
    //   owner: userData?.user?.username || _wallet?.address,
    //   token: 'HubyJ*%qcqR0',
    // };

    // let body = {
    //   method: 'POST',
    //   body: JSON.stringify(req_data),
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // };
    // fetch(`${BASE_URL}/xanalia/getProfile`, body)
    //   .then(response => response.json())
    //   .then(res => {
    //     if (typeof (res.data) !== 'string' && res.data) {
    //       dispatch(updateUserData(res.data));

    //     }
    //     dispatch(endMainLoading());
    //     dispatch(hideSplash());
    //   })
    //   .catch(e => {
    //     dispatch(hideSplash());
    //     dispatch(endMainLoading());
    //   });
  }
  dispatch(hideSplash());
  dispatch(endMainLoading());
};

export const loadProfileFromAsync = (id) => (dispatch) =>
  new Promise((resolve, reject) => {
    let req_data = {
      owner: id,
      token: 'HubyJ*%qcqR0',
    };
    sendRequest({
      url: `${BASE_URL}/xanalia/getProfile`,
      method: 'POST',
      data: req_data,
    })
      .then(res => {
        if (typeof (res.data) !== 'string' && res.data) {
          dispatch(updateUserData(res.data));
        }
        resolve()
      })
      .catch(e => {
        reject(e)
      });
  })

export const setUserAuthData =
  (data, isCreate = false) =>
    dispatch =>
      new Promise(async (resolve, reject) => {
        dispatch(startLoading());
        AsyncStorage.setItem('@WALLET', JSON.stringify(data));
        dispatch(setUserData({ data, isCreate }));
      });

export const updateCreateState = () => dispatch =>
  new Promise((resolve, reject) => {
    dispatch({ type: UPDATE_CREATE });
    resolve();
  });

// ======================= Login External Wallet API call ======================
export const loginExternalWallet = (wallet, isCreate, isLater) => dispatch =>
  new Promise((resolve, reject) => {
    const url = `${NEW_BASE_URL}/auth/login-external-wallet`;
    const body = {
      signature: wallet.signature,
      address: wallet.address,
      email: null
    };
    dispatch(startLoading());
    sendRequest({
      url: url,
      data: body,
      method: 'POST',
    })
      .then(async response => {
        if (response.access_token) {
          await EncryptedStorage.setItem("SESSION_TOKEN", JSON.stringify({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
          }));
          wallet.address = String(wallet?.address).toLowerCase();
          await EncryptedStorage.setItem("@WALLET", JSON.stringify(wallet));
          await AsyncStorage.setItem("@USERDATA", JSON.stringify(response.user));
          dispatch(
            setUserData({
              data: response.user,
              isCreate,
              showSuccess: isLater ? false : true,
            }),
          );
          resolve();
        } else {
          console.log('error 3');
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
// =====================================================================

export const setBackupStatus = data => dispatch =>
  new Promise(async (resolve, reject) => {
    dispatch(startLoading());
    AsyncStorage.setItem('@BackedUp', JSON.stringify(data));
    dispatch(setBackup(true));
  });

export const signOut = () => {
  return async (dispatch, getState) => {
    await EncryptedStorage.removeItem('@WALLET');
    dispatch(logout());
  };
};

export const updateProfileImage = formData => async (dispatch, getState) => {
  dispatch(startLoading());

  const { data } = getState().UserReducer;
  // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  // axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
  const headers = {
    "Content-Type": 'multipart/form-data',
    Authorization: `Bearer ${data.token}`,
  };
  await axios
    .post(`${BASE_URL}/user/update-profile-image`, formData, { headers: headers })
    .then(res => {
      console.log('Response from update-profile-image', res.data.data)
      dispatch(updateUserData(res.data.data));
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
      // alertWithSingleBtn(
      //   translate('wallet.common.alert'),
      //   translate('wallet.common.error.networkFailed'),
      //   () => {
      //     console.log(err);
      //   },
      // );
    });
};

export const fetchData =(id) => {
  return (dispatch) => {
  const url = `${NEW_BASE_URL}/users/${id}`
  sendRequest(url)
    .then((res) => {
      console.log(res,'data fetched')
      dispatch(updateUserData(res))
    })
  }
}

export const updateProfile =
  (props, id) => async (dispatch, getState) => {
    // console.log(props)
    dispatch(startLoading());
    const token = await getAccessToken('ACCESS_TOKEN')
    // const { data } = getState().UserReducer;
    sendRequest({
      url: `${NEW_BASE_URL}/users/update-profile`,
      method: 'PUT',
      data : props
  }).then(()=>{
    dispatch(fetchData(id))
  })
  .then((res) => {
    console.log('response updateProfile', res)
    dispatch(endLoading());
    // callBack();
  })
  .catch(err => {
    dispatch(endLoading());
  })

    // await axios(config)
    //   .then(res => {
    //     console.log('res.data.data updateProfile', res.data.data)
    //     let data = res.data.data;
    //     dispatch(updateUserData(data));
    //     dispatch(endLoading());
    //     callBack();
    //   })
    //   .catch(err => {
    //     dispatch(endLoading());
    //     // if (err.response.status === 401) {
    //     //   alertWithSingleBtn(
    //     //     translate('wallet.common.alert'),
    //     //     translate('common.sessionexpired'),
    //     //     () => {
    //     //       console.log(err);
    //     //     },
    //     //   );
    //     //   dispatch(signOut());
    //     //   return;
    //     // }
    //     // if (err.response.data.data === 'email already taken') {
    //     //   alertWithSingleBtn(
    //     //     translate('wallet.common.alert'),
    //     //     translate('common.emailexists'),
    //     //     () => {
    //     //       console.log(err);
    //     //     },
    //     //   );
    //     // } else if (err.response.data.data === 'username already taken') {
    //     //   alertWithSingleBtn(
    //     //     translate('wallet.common.alert'),
    //     //     translate('common.usrnameexists'),
    //     //     () => {
    //     //       console.log(err.response.data.data);
    //     //     },
    //     //   );
    //     // } else {
    //     //   // alertWithSingleBtn(
    //     //   //   translate('wallet.common.alert'),
    //     //   //   translate('wallet.common.error.networkFailed'),
    //     //   //   () => {
    //     //   //     console.log(err);
    //     //   //   },
    //     //   // );
    //     // }
    //   });
  };
