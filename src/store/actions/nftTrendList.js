import axios from 'axios';
import { BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import {
  ALL_ARTIST_SUCCESS, ARTIST_LOADING_END, ARTIST_LOADING_START, GIF_NFT_LIST_SUCCESS, HANDLE_LIKE_DISLIKE, LOAD_NFT_START, MOVIE_NFT_LIST_SUCCESS, MYLIST_LIST_UPDATE,
  MY_COLLECTION_LIST_UPDATE, NEW_NFT_LIST_UPDATE, NFT_LIST_FAIL, NFT_LIST_RESET, NFT_LIST_SUCCESS, NFT_LIST_UPDATE, PAGE_CHANGE, SET_SORT_ORDER, NFT_DATA_COLLECTION_LIST_UPDATE,
  AWARDS_LIST_UPDATE
} from '../types';
import { parseNftObject } from '../../utils/parseNFTObj';

export const nftLoadStart = () => ({
  type: LOAD_NFT_START,
});

export const nftLoadFail = () => ({
  type: NFT_LIST_FAIL,
});

export const nftListReset = () => ({
  type: NFT_LIST_RESET,
});

export const nftLoadSuccess = data => ({
  type: NFT_LIST_SUCCESS,
  payload: data,
});
export const gifNftLoadSuccess = data => ({
  type: GIF_NFT_LIST_SUCCESS,
  payload: data,
});
export const movieNftLoadSuccess = data => ({
  type: MOVIE_NFT_LIST_SUCCESS,
  payload: data,
});

export const handleLikeDislikeSuccess = data => ({
  type: HANDLE_LIKE_DISLIKE,
  payload: data,
});

export const pageChange = data => ({
  type: PAGE_CHANGE,
  payload: data,
});

export const getNFTList = (page, limit, sort) => {
  return (dispatch, getState) => {
    dispatch(nftLoadStart());

    const { data, wallet } = getState().UserReducer;
    let user = data.user;

    let body_data = {
      approveStaus: 'approve',
      type: 'hot',
      page,
      limit: limit || 28,
      networkType: networkType,
      token: 'HubyJ*%qcqR0',
    };
    if (sort) {
      body_data.sort = sort;
    }

    if (user) {
      body_data.owner = wallet.address || user._id;
    }
    // console.log('body_data',body_data);
    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        // console.log('json',json)
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
        dispatch(nftLoadSuccess(json));
      })
      .catch(err => {
        dispatch(nftLoadFail());
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};
export const gifNFTList = (page, limit, sort) => {
  return (dispatch, getState) => {
    dispatch(nftLoadStart());

    const { data, wallet } = getState().UserReducer;
    let user = data.user;

    let body_data = {
      approveStaus: 'approve',
      type: 'GIF',
      page,
      limit: limit || 28,
      networkType: networkType,
      token: 'HubyJ*%qcqR0',
    };
    if (sort) {
      body_data.sort = sort;
    }
    if (user) {
      body_data.owner = wallet.address || user._id;
    }
    // console.log('body_data',body_data);
    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        // console.log('json',json)
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
        dispatch(gifNftLoadSuccess(json));
      })
      .catch(err => {
        dispatch(nftLoadFail());
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};
export const movieNFTList = (page, limit, sort) => {
  return (dispatch, getState) => {
    dispatch(nftLoadStart());

    const { data, wallet } = getState().UserReducer;
    let user = data.user;

    let body_data = {
      approveStaus: 'approve',
      type: 'movie',
      page,
      limit: limit || 28,
      networkType: networkType,
      token: 'HubyJ*%qcqR0',
    };
    if (sort) {
      body_data.sort = sort;
    }

    if (user) {
      body_data.owner = wallet.address || user._id;
    }
    // console.log('body_data',body_data);
    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        // console.log('json',json)
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
        dispatch(movieNftLoadSuccess(json));
      })
      .catch(err => {
        dispatch(nftLoadFail());
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};

const artistLoadingStart = () => ({
  type: ARTIST_LOADING_START,
});

const artistLoadingEnd = () => ({
  type: ARTIST_LOADING_END,
});

export const getAllArtistSuccess = data => ({
  type: ALL_ARTIST_SUCCESS,
  payload: data,
});

export const setSortBy = data => ({
  type: SET_SORT_ORDER,
  payload: data,
});

export const getAllArtist = () => {
  return dispatch => {
    let body_data = {
      networkType: networkType,
    };

    dispatch(artistLoadingStart());

    let fetch_data_body = {
      method: 'POST',
      body: JSON.stringify(body_data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(`${BASE_URL}/user/get-all-artist`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        dispatch(getAllArtistSuccess([...json.data]));
      })
      .catch(err => {
        dispatch(artistLoadingEnd());
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};

export const handleLikeDislike = (item, index) => {
  return (dispatch, getState) => {
    const { screenName } = getState().AuthReducer;
    const { data } = getState().UserReducer;

    let oldNFTS =
      screenName == 'Hot'
        ? getState().ListReducer.nftList
        : screenName == 'newNFT'
          ? getState().NewNFTListReducer.newNftList
          : screenName == 'myNFT'
            ? getState().MyNFTReducer.myList
            : screenName == 'myCollection'
              ? getState().MyCollectionReducer.myCollection
              : screenName == 'awards'
                ? getState().AwardsNFTReducer.awardsNftList
                : getState().NftDataCollectionReducer.nftDataCollectionList;

    var url1 = '';
    var url2 = `${BASE_URL}/xanalia/updateRating`;
    let like_body = {
      networkType: networkType,
      owner: data.user.username,
      tokenId: item.tokenId,
    };

    let rating_body = {
      networkType: networkType,
      tokenId: item.tokenId,
    };
    if (!item.like) {
      url1 = `${BASE_URL}/xanalia/likeNFT`;
      rating_body.rating = item.rating ? item.rating : 0 + 1;
      item.like = 1;
      item.rating = item.rating ? item.rating : 0 + 1;
    } else {
      url1 = `${BASE_URL}/xanalia/unlikeNFT`;
      rating_body.rating = item.rating ? item.rating : 1 - 1;
      item.like = 0;
      item.rating = item.rating ? item.rating : 1 - 1;
    }

    console.log('========like_body', like_body);
    console.log('========rating_body', rating_body);

    let fetch_like_body = {
      method: 'POST',
      body: JSON.stringify(like_body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    let fetch_rating_body = {
      method: 'POST',
      body: JSON.stringify(rating_body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    Promise.all([
      fetch(url1, fetch_like_body).then(res => res.json()),
      fetch(url2, fetch_rating_body).then(res => res.json()),
    ])
      .then(([v, a]) => {
        console.log('======v', v);
        console.log('======item', item);
        if (v.success) {
          const nftUpdated = [
            ...oldNFTS.slice(0, index),
            item,
            ...oldNFTS.slice(index + 1),
          ];

          screenName == 'Hot'
            ? dispatch(nftLoadUpdate(nftUpdated))
            : screenName == 'newNFT'
              ? dispatch(newNftLoadUpdate(nftUpdated))
              : screenName == 'myNFT'
                ? dispatch(myNFTUpdate(nftUpdated))
                : screenName == 'myCollection'
                  ? dispatch(myCollectionNFTUpdate(nftUpdated))
                  : screenName == 'awards'
                    ? dispatch(awardsListUpdate(nftUpdated))
                    : dispatch(nftDataCollectionUpdate(nftUpdated));
        }
      })
      .catch(err => {
        console.log('=====error', err);
        alertWithSingleBtn(
          translate('wallet.common.alert'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};

export const handleFollow = (followingUserId, isFollowing) => {
  return (dispatch, getState) => {
    const { data } = getState().UserReducer;

    let url = isFollowing
      ? `${BASE_URL}/user/unFollow-user`
      : `${BASE_URL}/user/follow-user`;
    let req_body = {
      followingUserId: followingUserId,
    };

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    axios.post(url, req_body).catch(err => {
      alert(err.response.data.message);
    });
  };
};

export const nftLoadUpdate = data => ({
  type: NFT_LIST_UPDATE,
  payload: data,
});

export const myNFTupdate = data => ({
  type: MYLIST_LIST_UPDATE,
  payload: data,
});

export const newNftLoadUpdate = data => ({
  type: NEW_NFT_LIST_UPDATE,
  payload: data,
});

export const awardsListUpdate = data => ({
  type: AWARDS_LIST_UPDATE,
  payload: data,
});

export const myCollectionNFTUpdate = data => ({
  type: MY_COLLECTION_LIST_UPDATE,
  payload: data,
});

export const nftDataCollectionUpdate = data => ({
  type: NFT_DATA_COLLECTION_LIST_UPDATE,
  payload: data,
});
