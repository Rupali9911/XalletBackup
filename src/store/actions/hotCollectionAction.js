import { BASE_URL } from '../../common/constants';
import axios from 'axios';
import {
  HOT_COLLECTION_FAIL,
  HOT_COLLECTION_LIST_RESET,
  HOT_COLLECTION_START,
  HOT_COLLECTION_SUCCESS,
  HOT_COLLECTION_PAGE_CHANGE,
} from '../types';
import { ApiRequest } from '../../helpers/ApiRequest';

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
        const obj = {
          bannerImage: "https://ik.imagekit.io/xanalia/CollectionMainData/NFTAward.png",
          chainType: "binance",
          collectionDesc: "This series is an exclusive collection of physical artwork/ original paintings exploring a symbiotic relationship between humanity and nature. It repr",
          collectionId: "61c44353e5622d1a2e053f3e",
          collectionName: "NFTART AWARD 2021",
          collectionSymbol: "🎁🎗",
          createdDate: 1640252243647,
          creatorInfo: [
            {
              title: "XANALIA",
              about: "I enjoy teaching art to my students, but more than that, I love creating it myself. NFTs are my newest passion, and I want to share my work with the world.",
              createdAt: 1640167319857,
              followers: 0,
              following: 0,
              links: { facebook: '', website: '', discord: '', twitter: '', instagram: '' },
              nonce: null,
              profile_image: "https://xanalia.s3.ap-southeast-1.amazonaws.com/userProfile/1640167427821.jpg",
              role: "crypto",
              transalte_again: 1,
              username: "0x89e0f6dd2012648794aac8bd340dca3246f3da76",
              _id: "61c2f7973cdaa90d7dcd31c3",
            }
          ],
          iconImage: "https://ik.imagekit.io/xanalia/Images/XANALIA-ICON.png",
          innerInfo: { _id: '61c9adbfa8a0114d059c89c3', collectionRequest: '61c44353e5622d1a2e053f3e', launchPadApproval: true, launchPadOrder: '5' },
          items: null,
          status: 0,
          userId: "61c2f7973cdaa90d7dcd31c3",
          userObjectId: "61c2f7973cdaa90d7dcd31c3",
          _id: "61c44353e5622d1a2e053f3e",
          status: "ongoinglaunch",
          redirect: "/xanalia_nftart_award_2021",
        }

        const newData = [obj, ...json.data];
        json.data = newData;

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

export const getStoreCollectioDetail = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  const req_body = {
    limit: 10,
    page: 1,
  };
  return axios.post(`${BASE_URL}/user/fetch-blind-data`, req_body);
}

export const getBoxes = (id, check) => {
  if (check) {
    return axios.get(`${BASE_URL}/blindBox/view-blind-series-info?collectionAddress=${id}`)
  }
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

export const getBlindBoxSeriesSum = (collectionId) => {
  return new Promise((resolve, reject) => {
    ApiRequest(`${BASE_URL}/blindbox/blindbox-series-sum?collectionAddress=${collectionId}`, 'GET', null, null)
      .then(response => {
        if (response?.data?.length > 0)
          resolve(response?.data[0]);
      })
      .catch(err => {
        reject(err);
      });
  });
}