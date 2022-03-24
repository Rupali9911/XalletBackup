import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { parseNftObject } from '../../utils/parseNFTObj';
import {
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

export const myNFTList = (page, ownerId) => {
  return (dispatch, getState) => {

    const { data, wallet } = getState().UserReducer;
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
      body_data.loggedIn = wallet.address || user._id;
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
        console.log(json, "get my created nft")
        let nftData = [];
        if (!json.count) {
          json.data = [];
        } else {
          json.data.map(item => {
            const parsedNFT = parseNftObject(item);
            const data = {
              ...parsedNFT,
              ...item,
            };
            nftData.push(data);
          });
        }
        json.data = nftData;
        dispatch(myNftLoadSuccess(json));
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

export const favoriteNftSuccess = data => ({
  type: FAVORITE_NFT_SUCCESS,
  payload: data,
});
