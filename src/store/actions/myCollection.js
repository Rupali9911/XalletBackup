import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import { parseNftObject } from '../../utils/parseNFTObj';
import { translate } from '../../walletUtils';

import {
  MY_COLLECTION_LOAD_FAIL,
  MY_COLLECTION_LOAD_START,
  MY_COLLECTION_PAGE_CHANGE,
  MY_COLLECTION_LOAD_RESET,
  MY_COLLECTION_LOAD_SUCCESS,
  SET_COLLECTION_USER_ADDRESS,
} from '../types';
import {setNFTUserAddress} from "./myNFTaction";

export const myCollectionLoadStart = () => ({
  type: MY_COLLECTION_LOAD_START,
});

export const myCollectionLoadFail = () => ({
  type: MY_COLLECTION_LOAD_FAIL,
});

export const myCollectionListReset = () => ({
  type: MY_COLLECTION_LOAD_RESET,
});

export const myCollectionPageChange = data => ({
  type: MY_COLLECTION_PAGE_CHANGE,
  payload: data,
});
export const setCollectionUserAddress = data => ({
  type: SET_COLLECTION_USER_ADDRESS,
  payload: data,
});

export const myCollectionList = (page, ownerId) => {
  return (dispatch, getState) => {
    dispatch(myCollectionLoadStart());

    const { data, wallet } = getState().UserReducer;
    let user = data.user;

    let body_data = {
      limit: 24,
      networkType: networkType,
      page: page,
      nftType: 'mycollection',
    };

    if (user?.role === 'crypto') {
      body_data.owner = typeof ownerId === 'string' ? ownerId.toUpperCase() : ownerId;
      dispatch(setCollectionUserAddress((typeof ownerId === 'string' ? ownerId.toLowerCase() : ownerId)));
    } else {
      body_data.status = 'my_collection'
      dispatch(setCollectionUserAddress(""));
    }

    if (user) {
      body_data.loggedIn = wallet?.address || user?._id;
    }

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
    };

    // const url = ownerId?.length > 24
    const url = user?.role === 'crypto'
      ? `${BASE_URL}/xanalia/mydata`
      : `${BASE_URL}/user/my-collection`; // user/get-user-collection

    fetch(url, fetch_data_body)
      .then(response => response.json()) // promise
      .then(json => {
         console.log(json, "myCollectionList nft")
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
        dispatch(myCollectionLoadSuccess(json));
      })
      .catch(err => {
        dispatch(myCollectionLoadFail());
        //   alertWithSingleBtn(
        //     translate('wallet.common.alert'),
        //     translate('wallet.common.error.networkFailed'),
        // );
      });
  };
};

export const myCollectionLoadSuccess = data => ({
  type: MY_COLLECTION_LOAD_SUCCESS,
  payload: data,
});
