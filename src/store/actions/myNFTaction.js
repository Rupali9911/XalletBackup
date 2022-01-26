import {BASE_URL} from '../../common/constants';
import {networkType} from '../../common/networkType';
import {
  AUTH_USER_NFT_REFRESH,
  FAVORITE_NFT_SUCCESS,
  FAVORITE_PAGE_CHANGE,
  MY_NFT_LOAD_FAIL,
  MY_NFT_LOAD_RESET,
  MY_NFT_LOAD_START,
  MY_NFT_LOAD_SUCCESS,
  MY_PAGE_CHANGE,
} from '../types';

export const myNftLoadStart = () => ({
  type: MY_NFT_LOAD_START,
});

export const myNftLoadFail = () => ({
  type: MY_NFT_LOAD_FAIL,
});

export const myNftListReset = () => ({
  type: MY_NFT_LOAD_RESET,
});

export const myPageChange = data => ({
  type: MY_PAGE_CHANGE,
  payload: data,
});

export const favoritePageChange = data => ({
  type: FAVORITE_PAGE_CHANGE,
  payload: data,
});
export const authUserNFTList = (page, ownerId, refresh) => {
  return (dispatch, getState) => {
    dispatch(myNftLoadStart());

    const {data} = getState().UserReducer;
    let user = data.user;

    let body_data = {
      limit: 50,
      networkType: networkType,
      page: page,
      nftType: 'mynft',
    };

    if (ownerId?.length > 24) {
      body_data.owner = ownerId.toUpperCase();
    } else {
      body_data.userId = ownerId;
    }

    if (user) {
      body_data.loggedIn = user._id;
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    let url = `${BASE_URL}/xanalia/mydata`;
    fetch(url, fetch_data_body)
      .then(response => response.json()) // promise
      .then(json => {
        if (json.success) {
          if (json.count) {
            if (refresh) {
              let obj = {data: [...json.data], count: json.count};
              dispatch(authUserNftRefresh(obj));
            } else {
              dispatch(myNftLoadSuccess(json));
            }
          } else {
            dispatch(myNftLoadFail());
          }
        } else {
          dispatch(myNftLoadFail());
          alertWithSingleBtn(translate('wallet.common.alert'), json.data);
        }
      })
      .catch(err => {
        dispatch(myNftLoadFail());
        alertWithSingleBtn(
          translate('common.error'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};

export const myNFTList = (page, ownerId) => {
  return (dispatch, getState) => {
    dispatch(myNftLoadStart());

    const {data} = getState().UserReducer;
    let user = data.user;

    let body_data = {
      limit: 24,
      networkType: networkType,
      page: page,
      nftType: 'mynft',
    };

    if (ownerId?.length > 24) {
      body_data.owner = ownerId.toUpperCase();
    } else {
      body_data.userId = ownerId;
    }

    if (user) {
      body_data.loggedIn = user._id;
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const url =
      ownerId?.length > 24
        ? `${BASE_URL}/xanalia/mydata`
        : `${BASE_URL}/user/get-user-collection`;

    fetch(url, fetch_data_body)
      .then(response => response.json()) // promise
      .then(json => {
        if (json.count) {
          dispatch(myNftLoadSuccess(json));
        } else {
          dispatch(myNftLoadFail());
        }
      })
      .catch(err => {
        dispatch(myNftLoadFail());
        // alertWithSingleBtn(
        //     translate('common.error'),
        //     translate("wallet.common.error.networkFailed")
        // )
      });
  };
};

export const myNftLoadSuccess = data => ({
  type: MY_NFT_LOAD_SUCCESS,
  payload: data,
});
export const authUserNftRefresh = data => ({
  type: AUTH_USER_NFT_REFRESH,
  payload: data,
});

export const favoriteNftSuccess = data => ({
  type: FAVORITE_NFT_SUCCESS,
  payload: data,
});
