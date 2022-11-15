import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { UserErrorMessage } from '../../constants';
import RNFetchBlob from 'rn-fetch-blob';
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
  SET_TOAST_MESSAGE,
  IMAGE_AVATAR_START,
  IMAGE_AVATAR_END,
  IMAGE_BANNER_START,
  IMAGE_BANNER_END,
  SET_PROFILE_DETAILS,
} from '../types';
import { getSig } from '../../screens/wallet/functions';
import { BASE_URL, NEW_BASE_URL, API_GATEWAY_URL } from '../../common/constants';
import { translate } from '../../walletUtils';
import { alertWithSingleBtn } from '../../common/function';
import { setConnectedApps } from './walletReducer';
import sendRequest, { getAccessToken } from '../../helpers/AxiosApiRequest';
import { reject } from 'lodash';
import { resolve } from 'path-browserify';
import { Alert } from 'react-native';

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
  connectModalState: false,
  toastMsg: null,
  loggedInUser: null,
  imageAvatarLoading: false,
  imageBannerLoading: false,
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
        passcodeAsync: action.payload,
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
        loggedInUser: action.payload.data,
      };

    case UPDATE_CREATE:
      return {
        ...state,
        isCreate: false,
        showSuccess: false,
      };

    case UPDATE_PROFILE:
      let _data = action.payload;
      return {
        ...state,
        userData: { ..._data },
      };
    case SET_PROFILE_DETAILS:
      return {
        ...state,
        profileData: { ...action.payload },
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

    case SET_TOAST_MESSAGE:
      return {
        ...state,
        toastMsg: action.payload,
      };
    case IMAGE_AVATAR_START:
      return {
        ...state,
        imageAvatarLoading: true,
      };
    case IMAGE_AVATAR_END:
      return {
        ...state,
        imageAvatarLoading: false,
      };
    case IMAGE_BANNER_START:
      return {
        ...state,
        imageBannerLoading: true,
      };
    case IMAGE_BANNER_END:
      return {
        ...state,
        imageBannerLoading: false,
      };
    default:
      return state;
  }
};

export const startLoading = () => ({
  type: AUTH_LOADING_START,
});
export const updatePassStatus = data => ({
  type: UPDATE_PASS_ASYNC,
  payload: data,
});
export const hideSplash = () => ({
  type: HIDE_SPLASH,
});

export const connectStateModal = data => ({
  type: CONNECT_MODAL_STATE,
  payload: data,
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

export const setProfileDetails = data => ({
  type: SET_PROFILE_DETAILS,
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

export const setToastMsg = data => ({
  type: SET_TOAST_MESSAGE,
  payload: data,
});
export const startLoadingImage = () => ({
  type: IMAGE_AVATAR_START,
});
export const startLoadingBanner = () => ({
  type: IMAGE_BANNER_START,
});
export const endLoadingImage = () => ({
  type: IMAGE_AVATAR_END,
});
export const endLoadingBanner = () => ({
  type: IMAGE_BANNER_END,
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

export const loadProfileFromAsync = id => dispatch =>
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
        if (typeof res.data !== 'string' && res.data) {
          dispatch(updateUserData(res.data));
        }
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });

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
      email: wallet?.email ? wallet.email : null,
    };
    dispatch(startLoading());
    sendRequest({
      url: url,
      data: body,
      method: 'POST',
    })
      .then(async response => {
        if (response.access_token) {
          await EncryptedStorage.setItem(
            'SESSION_TOKEN',
            JSON.stringify({
              accessToken: response.access_token,
              refreshToken: response.refresh_token,
            }),
          );
          wallet.address = String(wallet?.address).toLowerCase();
          await EncryptedStorage.setItem('@WALLET', JSON.stringify(wallet));
          await AsyncStorage.setItem(
            '@USERDATA',
            JSON.stringify(response.user),
          );
          dispatch(
            setUserData({
              data: response.user,
              isCreate,
              showSuccess: isLater ? false : true,
            }),
          );
          resolve();
        } else {
          dispatch(endLoading());
          reject(response);
        }
      })
      .catch(err => {
        console.log('Error from login', err);
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
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${data.token}`,
  };
  await axios
    .post(`${BASE_URL}/user/update-profile-image`, formData, { headers: headers })
    .then(res => {
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

export const getUserData = (id, profile = false) => {
  return dispatch => {
    dispatch(startLoading());
    const url = `${NEW_BASE_URL}/users/${id}`;
    sendRequest(url)
      .then(res => {
        if (profile) {
          dispatch(setProfileDetails(res));
        } else {
          dispatch(updateUserData(res));
        }
        dispatch(endLoading());
      })
      .catch(error => {
        dispatch(endLoading());
        console.log('Error from login', error);
      });
  };
};

export const updateProfile = (props, id) => async dispatch => {
  sendRequest({
    url: `${NEW_BASE_URL}/users/update-profile`,
    method: 'PUT',
    data: props,
  }).then(res => {
    dispatch(getUserData(id));
    if (UserErrorMessage.hasOwnProperty(res.messageCode)) {
      let key = UserErrorMessage[res.messageCode].key;
      dispatch(setToastMsg({ error: true, msg: translate(`common.${key}`) }));
    }
  });
};

export const verifyEmail = email => async (dispatch, getState) => {
  const { userData } = getState().UserReducer;
  const id = userData.userWallet.address;
  sendRequest({
    url: `${NEW_BASE_URL}/users/verify-email`,
    method: 'POST',
    data: { account: email },
  }).then(() => {
    dispatch(getUserData(id));
  });
};

export const updateAvtar = (userId, file) => async dispatch => {
  dispatch(startLoadingImage());
  const extension = file.type.split('/')[1];
  const name = new Date().getTime();
  let url = `${API_GATEWAY_URL}/user-avatar/${userId}/${name}.${extension}`;
  const token = await getAccessToken('ACCESS_TOKEN');
  RNFetchBlob.fs.readFile(file.path, 'base64').then(async data => {
    var Buffer = require('buffer/').Buffer;
    const imageData = await Buffer.from(data, 'base64');
    try {
      const userProfileResponse = await sendRequest({
        url: url,
        method: 'PUT',
        data: imageData,
        headers: {
          'Content-Type': 'image/jpeg',
          Authorization: `${token}`,
          'x-amz-tagging': `token=${token}`,
        },
      });
      if(userProfileResponse == undefined) {
        dispatch(endLoadingBanner());
      }
    } catch (error) {
      dispatch(endLoadingImage());
      console.log('@@@ error ', error);
    }
  });
};

export const updateBanner = (userId, file) => async dispatch => {
  dispatch(startLoadingBanner());
  const extension = file.type.split('/')[1];
  const name = new Date().getTime();
  let url = `${API_GATEWAY_URL}/user-avatar/${userId}/${name}.${extension}`;
  const token = await getAccessToken('ACCESS_TOKEN');
  RNFetchBlob.fs.readFile(file.path, 'base64').then(async data => {
    var Buffer = require('buffer/').Buffer;
    const imageData = await Buffer.from(data, 'base64');
    try {
      const userProfileResponse = await sendRequest({
        url: url,
        method: 'PUT',
        data: imageData,
        headers: {
          'Content-Type': 'image/jpeg',
          Authorization: `${token}`,
          'x-amz-tagging': `token=${token}&type=cover`,
        },
      });
      if(userProfileResponse == undefined) {
        dispatch(endLoadingBanner());
      }
      console.log("@@@ Update banner image response =======>", userProfileResponse)
    } catch (error) {
      console.log("@@@ Update banner image error =======>", error)
      dispatch(endLoadingBanner());
      console.log('@@@ update banner error ', error);
    }
  });
};
