import { BASE_URL, NEW_BASE_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { ApiRequest } from '../../helpers/ApiRequest';
import { alertWithSingleBtn } from '../../utils';
import { translate } from '../../walletUtils';
import {
  FAVORITE_NFT_LOAD_SUCCESS,
  NEW_NFT_LIST_RESET,
  NEW_NFT_LOAD_FAIL,
  ART_NFT_LOAD_FAIL,
  NEW_NFT_LOAD_START,
  ART_NFT_LOAD_START,
  // NEW_NFT_LOAD_SUCCESS,
  NEW_NFT_ART_LOAD_SUCCESS,
  NEW_NFT_ALL_LOAD_SUCCESS,
  NEW_NFT_TRENDING_LOAD_SUCCESS,
  NEW_NFT_IMAGE_LOAD_SUCCESS,
  NEW_NFT_GIF_LOAD_SUCCESS,
  NEW_NFT_MOVIE_LOAD_SUCCESS,
  NEW_NFT_MUSIC_LOAD_SUCCESS,
  NEW_PAGE_CHANGE,
  UPDATE_ARTIST_DETAIL,
  UPDATE_NFT_DETAIL,
  UPDATE_OWNER_DETAIL,
} from '../types';
import { parseNftObject } from '../../utils/parseNFTObj';

export const newNftArtLoadSuccess = data => ({
  type: NEW_NFT_ART_LOAD_SUCCESS,
  payload: data,
});
export const newNftAllLoadSuccess = data => ({
  type: NEW_NFT_ALL_LOAD_SUCCESS,
  payload: data,
});
export const newNftTrendingLoadSuccess = data => ({
  type: NEW_NFT_TRENDING_LOAD_SUCCESS,
  payload: data,
});
export const newNftImageLoadSuccess = data => ({
  type: NEW_NFT_IMAGE_LOAD_SUCCESS,
  payload: data,
});
export const newNftGifLoadSuccess = data => ({
  type: NEW_NFT_GIF_LOAD_SUCCESS,
  payload: data,
});
export const newNftMovieLoadSuccess = data => ({
  type: NEW_NFT_MOVIE_LOAD_SUCCESS,
  payload: data,
});
export const newNftMusicLoadSuccess = data => ({
  type: NEW_NFT_MUSIC_LOAD_SUCCESS,
  payload: data,
});


export const favoriteNftLoadSuccess = data => ({
  type: FAVORITE_NFT_LOAD_SUCCESS,
  payload: data,
});
export const updateNftDetail = data => ({
  type: UPDATE_NFT_DETAIL,
  payload: data,
});
export const updateArtistDetail = data => ({
  type: UPDATE_ARTIST_DETAIL,
  payload: data,
});
export const updateOwnerDetail = data => ({
  type: UPDATE_OWNER_DETAIL,
  payload: data,
});

export const isArtNftLoadStart = () => ({
  type: ART_NFT_LOAD_START,
});

export const newNftLoadStart = data => ({
  type: NEW_NFT_LOAD_START,
  payload: data,
});

export const newNftLoadFail = () => ({
  type: NEW_NFT_LOAD_FAIL,
});

export const artNftLoadFail = () => ({
  type: ART_NFT_LOAD_FAIL,
});

export const newNftListReset = data => ({
  type: NEW_NFT_LIST_RESET,
  payload: data,
});

export const newPageChange = data => ({
  type: NEW_PAGE_CHANGE,
  payload: data,
});

export const newNFTData = (callFrom, category, sort, pageSize, pageNum) => {
  console.log("🚀 ~ file: newNFTActions.js ~ line 70 ~ newNFTData ~ ", category, sort, pageSize, pageNum)
  return (dispatch) => {
    // let pageSize = 10;
    dispatch(newNftLoadStart())
    // dispatch(isArtNftLoadStart())
    const url = `${NEW_BASE_URL}/nfts/all-nfts-markets?pageIndex=${pageNum}&pageSize=${pageSize}&sortFilter=${sort}&categoryFilter=${category}`
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (callFrom === 'all') {
          dispatch(newNftAllLoadSuccess(data))
        }
        if (callFrom === 'art') {
          dispatch(newNftArtLoadSuccess(data))
        }
        if (callFrom === 'image') {
          dispatch(newNftImageLoadSuccess(data))
        }
        if (callFrom === 'trending') {
          dispatch(newNftTrendingLoadSuccess(data))
        }
        if (callFrom === 'gif') {
          dispatch(newNftGifLoadSuccess(data))
        }
        if (callFrom === 'movie') {
          dispatch(newNftMovieLoadSuccess(data))
        }
        if (callFrom === 'music') {
          dispatch(newNftMusicLoadSuccess(data))
        }
        // dispatch(newNftLoadSuccess(data))
      })
      .catch(() => {
        console.log('err')
        dispatch(newNftLoadFail())
        // dispatch(artNftLoadFail());
      })
  }
}

// export const newNFTList = (page, limit, sort) => {
//   return (dispatch, getState) => {
//     dispatch(newNftLoadStart());
//     dispatch(isArtNftLoadStart());

//     const { data, wallet } = getState().UserReducer;
//     let user = data.user;

//     let body_data = {
//       page,
//       limit: limit || 27,
//       networkType: networkType,
//       token: 'HubyJ*%qcqR0',
//       type: '2D',
//       approveStaus: 'approve',
//     };

//     if (sort) {
//       body_data.sort = sort;
//     }

//     if (user) {
//       body_data.owner = wallet?.address || user?._id;
//     }
//     // console.log('body_data',body_data);
//     let fetch_data_body = {
//       method: 'POST',
//       body: JSON.stringify(body_data),
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     };

//     fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
//       .then(response => response.json())
//       .then(json => {
//         //console.log('json', json)
//         let nftData = [];
//         if (!json.count) {
//           json.data = [];
//         } else {
//           json.data.map(item => {
//             const parsedNFT = parseNftObject(item);
//             const data = {
//               ...parsedNFT,
//               ...item,
//             };
//             nftData.push(data);
//           });
//         }
//         json.data = nftData;
//         dispatch(newNftLoadSuccess(json));
//       })
//       .catch(err => {
//         dispatch(newNftLoadFail());
//         dispatch(artNftLoadFail());
//         alertWithSingleBtn(
//           translate('common.error'),
//           translate('wallet.common.error.networkFailed'),
//         );
//       });
//   };
// };


export const favoriteNFTList = (page, limit, sort) => {
  return (dispatch, getState) => {
    dispatch(newNftLoadStart('photo'));

    const { data, wallet } = getState().UserReducer;
    let user = data.user;

    let body_data = {
      page,
      limit: limit || 24,
      networkType: networkType,
      token: 'HubyJ*%qcqR0',
      type: 'portfolio',
      approveStaus: 'approve',
    };

    if (sort) {
      body_data.sort = sort;
    }

    if (user) {
      body_data.owner = wallet?.address || user?._id;
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
    console.log('fetch_data_body', JSON.stringify(fetch_data_body))
    fetch(`${BASE_URL}/xanalia/getDemuxData`, fetch_data_body)
      .then(response => response.json())
      .then(json => {
        let nftData = [];
        // console.log(json)
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
        dispatch(favoriteNftLoadSuccess(json));
      })
      .catch(err => {
        dispatch(newNftLoadFail());
        alertWithSingleBtn(
          translate('common.error'),
          translate('wallet.common.error.networkFailed'),
        );
      });
  };
};

export const searchNFT = searchTxt => dispatch =>
  new Promise((resolve, reject) => {
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM3MDgsInVzZXJuYW1lIjoiU2h1YmhhbSBLb3RoYXJpIiwid2FsbGV0VHlwZSI6MSwibm9uY2UiOjAsImlhdCI6MTY2MDI5NjcxMiwiZXhwIjoxNjYwMzAwMzEyfQ.3e0qqKvbzJetTZ87qiKh5LnYdo6DndeFirMFJsA7G5Y'
    let headers = {
      'Authorization': `Bearer ${token}`
    }
    ApiRequest(`${NEW_BASE_URL}/users/search?keyword=${searchTxt}`, 'GET', null, headers)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
