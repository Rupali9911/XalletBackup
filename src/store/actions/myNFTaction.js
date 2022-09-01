import { BASE_URL, NEW_BASE_URL,API_GATEWAY_URL } from '../../common/constants';
import { networkType } from '../../common/networkType';
import { ApiRequest } from '../../helpers/ApiRequest';
import { parseNftObject } from '../../utils/parseNFTObj';

import {
  FAVORITE_NFT_SUCCESS,
  FAVORITE_PAGE_CHANGE,
  SET_NFT_USER_ADDRESS,
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

export const setNFTUserAddress = data => ({
  type: SET_NFT_USER_ADDRESS,
  payload: data,
});

export const myNftLoadSuccess = data => ({
  type: MY_NFT_LOAD_SUCCESS,
  payload: data,
});

export const favoriteNftSuccess = data => ({
  type: FAVORITE_NFT_SUCCESS,
  payload: data,
});

export const myNFTList = (pageIndex, pageSize, address, category) => {
  return (dispatch) => {
    dispatch(myNftLoadStart());

    const url = `${NEW_BASE_URL}/nfts/nft-by-address-user?pageIndex=${pageIndex}&pageSize=${pageSize}&address=${address}&categoryFilter=${category}`
    fetch(url)
      .then((response) => response.json())
      .then((data) => dispatch(myNftLoadSuccess(data)))
  }
}


export const updateAvtar = (userId, file, token) => {
  // const { type } = file
  console.log(file.type, userId, token, '>>>>>>> extension')
  const extension = file.type.split('/')[1]
  const name = new Date().getTime()
  let url = `${API_GATEWAY_URL}/user-avatar/${userId}/${name}.${extension}`

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Authorization': `Bearer ${token}`,
      'x-amz-tagging': `token=${token}`
    },
    body: file,
    // referrer : 'https://frontend.xanalia.com/'
  };
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(data => console.log(data));
}



export const updateBanner = (userId, file, token) => {
  // const { type } = file
  console.log(file.type, userId, token, '>>>>>>> extension')
  const extension = file.type.split('/')[1]
  const name = new Date().getTime()
  let url = `${API_GATEWAY_URL}/user-avatar/${userId}/${name}.${extension}#https://frontend.xanalia.com/`

  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Authorization': `Bearer ${token}`,
      'x-amz-tagging': `token=${token}&type=cover`
    },
    body: file,
    // referrer : 'https://frontend.xanalia.com/'
  };
  fetch(url, requestOptions)
  .then(response => response.json())
  .then(data => console.log(data));
}

export const removeBanner = () => {

}



// export const myNFTList = (page, ownerId) => {

//   console.log('myNFTList, ownerId', ownerId)
//   return (dispatch, getState) => {

//     const { data, wallet } = getState().UserReducer;
//     let user = data.user;
//     dispatch(myNftLoadStart());

//     let body_data = {
//       limit: 24,
//       networkType: networkType,
//       page: page,
//       nftType: 'mynft',
//     };

//     if (user?.role==='crypto') {
//       body_data.owner = typeof ownerId === 'string' ? ownerId.toUpperCase() : ownerId;
//       dispatch(setNFTUserAddress(typeof ownerId === 'string' ? ownerId.toLowerCase() : ownerId));
//     } else {
//       body_data.status ='my_nft'
//       dispatch(setNFTUserAddress(""));
//     }

//     if (user) {
//       body_data.loggedIn = wallet?.address || user?._id;
//     }

//     let fetch_data_body = {
//       method: 'POST',
//       body: JSON.stringify(body_data),
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${data.token}`,
//     },
//     };

//     // const url = ownerId?.length > 24
//     const url = user?.role==='crypto'
//         ? `${BASE_URL}/xanalia/mydata`
//         : `${BASE_URL}/user/my-collection`; // user/get-user-collection;

//     fetch(url, fetch_data_body)
//       .then(response => response.json()) // promise
//       .then(json => {
//         console.log(json, "get my created nft", !json.count)
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
//         dispatch(myNftLoadSuccess(json));
//       })
//       .catch(err => {
//         dispatch(myNftLoadFail());
//         // alertWithSingleBtn(
//         //     translate('common.error'),
//         //     translate("wallet.common.error.networkFailed")
//         // )
//       });
//   };
// };


