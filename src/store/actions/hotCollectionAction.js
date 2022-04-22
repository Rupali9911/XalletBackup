import { BASE_URL } from '../../common/constants';
import axios from 'axios';
import {
  HOT_COLLECTION_FAIL,
  HOT_COLLECTION_LIST_RESET,
  HOT_COLLECTION_START,
  HOT_COLLECTION_SUCCESS,
  HOT_COLLECTION_PAGE_CHANGE,
} from '../types';

export const hotCollectionLoadSuccess = (data) => ({
  type: HOT_COLLECTION_SUCCESS,
  payload: data
});

export const hotCollectionLoadStart = () => ({
  type: HOT_COLLECTION_START
});

export const hotCollectionLoadFail = () => ({
  type: HOT_COLLECTION_FAIL
});

export const hotCollectionListReset = () => ({
  type: HOT_COLLECTION_LIST_RESET
});

export const hotCollectionPageChange = (data) => ({
  type: HOT_COLLECTION_PAGE_CHANGE,
  payload: data
});

export const hotCollectionList = (page) => {
  return (dispatch) => {

    fetch(`${BASE_URL}/user/hot-collections?page=${page}&limit=24`)
      .then(response => response.json())
      .then(json => {
        dispatch(hotCollectionLoadSuccess(json));

      }).catch(err => {
        dispatch(hotCollectionLoadFail());
      })
  }
}

export const getHotCollectionDetail = (collectionId, isBlind) => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  
  const sub_url = isBlind ? 'blindBox/view-blind-collection-data' : 'user/specific-collection';
  return axios.get(`${BASE_URL}/${sub_url}?collectionId=${collectionId}`);
}

export const getBoxes = (id) => {
  return axios.get(`${BASE_URL}/blindBox/view-blind-series-info?collectionAddress=${id}&frontend=true`);
}

export const getBoxStatsDetails = (boxId, collectionId) => {
  return axios.get(`${BASE_URL}/blindBox/blindbox-series-stats?collectionAddress=${collectionId}&seriesInfoId=${boxId}`);
}

export const getUserWhiteList = (token) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  return axios.get(`${BASE_URL}/user/ultraman-whitelist-status`, { headers: headers });
}