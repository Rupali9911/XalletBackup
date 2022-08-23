import {NEW_BASE_URL, BASE_URL } from '../../common/constants';
import { cardsDefaultData } from '../../web3/config/cardsDefaultData';
import {
  COLLECTION_FAIL,
  COLLECTION_LIST_RESET,
  COLLECTION_START,
  COLLECTION_SUCCESS,
  COLLECTION_PAGE_CHANGE,
} from '../types';
import { networkType } from '../../common/networkType';

export const collectionLoadSuccess = (data) => ({
  type: COLLECTION_SUCCESS,
  payload: data
});

export const collectionLoadStart = () => ({
  type: COLLECTION_START
});

export const collectionLoadFail = () => ({
  type: COLLECTION_FAIL
});

export const collectionListReset = () => ({
  type: COLLECTION_LIST_RESET
});

export const collectionPageChange = (data) => ({
  type: COLLECTION_PAGE_CHANGE,
  payload: data
});

export const collectionList = (page,isSelectTab) => {
  return (dispatch) => {
    dispatch(collectionLoadStart());

    const limit = 10;

    // const url = networkType === 'testnet'
    //   ? `${BASE_URL}/user/actual-collections?page=${page}&limit=${limit}&type=${isSelectTab ? 'normal' : 'blind'}`
    //   : `${BASE_URL}/user/live-actual-collections-type?page=${page}&limit=${limit}&type=${isSelectTab ? 'normal' : 'blind'}`;

    const url = `${NEW_BASE_URL}/collections?page=${page}&limit=${limit}`

    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (isSelectTab) {
        //  let newData = json?.data?.map((item) => {
        //     if (item.chainType) {
        //       item.chainType = ["ethereum", "binance"]
        //     } else {
        //       item = { ...item, chainType: ["ethereum", "binance"] }
        //     }
        //     return item;
        //   })
        //   json.data = newData;
          dispatch(collectionLoadSuccess(json));
        }
      }).catch(err => {
        dispatch(collectionLoadFail());
      })
  }
}
