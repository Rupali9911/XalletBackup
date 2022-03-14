import { BASE_URL } from '../../common/constants';
import { cardsDefaultData } from '../../web3/config/cardsDefaultData';
import {
  COLLECTION_FAIL,
  COLLECTION_LIST_RESET,
  COLLECTION_START,
  COLLECTION_SUCCESS,
  COLLECTION_PAGE_CHANGE,
} from '../types';

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

export const collectionList = (page) => {
  return (dispatch) => {
    dispatch(collectionLoadStart());

    fetch(`${BASE_URL}/user/actual-collections?page=${page}&limit=13`)
      .then(response => response.json())
      .then(json => {
        if (page === 1) {
          const newData = [...cardsDefaultData, ...json.data];
          const index = newData.findIndex(item => item._id === "62113e1774d1af3e04bc313d");
          if(index) {
            newData.splice(0, 0, newData.splice(index, 1)[0]);
          }
          json.data = newData;
        }
        dispatch(collectionLoadSuccess(json));

      }).catch(err => {
        dispatch(collectionLoadFail());
      })
  }
}
