import {
  //=====================Chat=======================
  CHAT_LOAD_START,
  CHAT_LOAD_SUCCESS,
  CHAT_LOAD_FAIL,

  //=====================Search=====================
  CHAT_SEARCH_LOAD_START,
  CHAT_SEARCH_LOAD_SUCCESS,
  CHAT_SEARCH_LOAD_FAIL,
  SEARCH_TEXT,

  //=====================Owned-Other=====================
  CHAT_NFT_LOAD_START,
  CHAT_NFT_LOAD_SUCCESS,
  CHAT_NFT_LOAD_FAIL,
  CHAT_NFT_LIST_RESET,
  CHAT_NFT_PAGE_CHANGE,
  CHAT_NFT_CURSOR_CHANGE,

  CHAT_TAB_TITLE
} from '../types';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';

//=====================Chat=====================
export const chatLoadingStart = (data) => ({
  type: CHAT_LOAD_START,
  payload: data,
});

export const chatLoadingSuccess = (data) => ({
  type: CHAT_LOAD_SUCCESS,
  payload: data,
});

export const chatLoadFail = (error) => ({
  type: CHAT_LOAD_FAIL,
  payload: error,
});


//=====================Search=====================
export const searchLoadingStart = (data) => ({
  type: CHAT_SEARCH_LOAD_START,
  payload: data,
});

export const searchLoadingSuccess = (data) => ({
  type: CHAT_SEARCH_LOAD_SUCCESS,
  payload: data,
});

export const searchLoadingFail = (error) => ({
  type: CHAT_SEARCH_LOAD_FAIL,
  payload: error,
});

export const searchText = (data) => ({
  type: SEARCH_TEXT,
  payload: data
})

//=========================Owned-Other=================================

export const nftLoadStart = () => ({
  type: CHAT_NFT_LOAD_START,
});

export const nftLoadSuccessList = (data) => ({
  type: CHAT_NFT_LOAD_SUCCESS,
  payload: data,
});

export const nftLoadFail = (error) => ({
  type: CHAT_NFT_LOAD_FAIL,
  payload: error,
});

export const nftListReset = () => ({
  type: CHAT_NFT_LIST_RESET
});

export const nftListPageChange = (data) => ({
  type: CHAT_NFT_PAGE_CHANGE,
  payload: data
});

export const nftListCursorChange = (data) => ({
  type: CHAT_NFT_CURSOR_CHANGE,
  payload: data
});

export const setTabTitle = (data) => ({
  type: CHAT_TAB_TITLE,
  payload: data
});

//=====================Chat=====================
export const getAiChat = (message, address, name, tokenId, is_Owned) => (dispatch) => {
  console.log(message, address, name, tokenId, is_Owned);
  dispatch(chatLoadingStart(true))
  return new Promise((resolve, reject) => {
    let url = `${NEW_BASE_URL}/xana-genesis-chat/chat-bot`;
    let data = {
      address: address,
      bot_name: name,
      text: message,
      tokenId: tokenId,
      is_Owned: is_Owned
    };
    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(res => {
        dispatch(chatLoadingStart(false))
        if (res?.response) {
          dispatch(chatLoadingSuccess(res?.response));
          resolve(res?.response);
        }
      })
      .catch(err => {
        dispatch(chatLoadingStart(false))
        dispatch(chatLoadFail(err));
        reject(err);
      })
  })
}

//==================================Owned-Other==============================
export const getNftCollections = (page, address, cursor) => (dispatch, getState) => {
  const { tabTitle } = getState().chatReducer;

  let url = `${NEW_BASE_URL}/xana-genesis-chat`;
  url = tabTitle ? `${url}/get-my-data` : `${url}/get-other-data`;
  let limit = 100;

  let data = {
    cursor,
    owner: address,
    page,
    limit
  };
  // if (owned) {
  //   data.limit = limit;
  // }

  sendRequest({
    url,
    method: 'POST',
    data,
  })
    .then(response => {
      let res = {
        nftTotalCount: response.total,
        nftCursor: response.cursor,
        nftList: {
          ownerNFTS: [],
          otherNFTs: []
        }
      }
      if (tabTitle) {
        res.nftList.ownerNFTS = response.result;
      }
      else {
        res.nftList.otherNFTs = response.result;
      }
      dispatch(nftLoadSuccessList(res));
    })
    .catch(err => { console.log('Error : ', err) })
}

//=====================Search=====================
export const getSearchResult = (text, address) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let url = `${NEW_BASE_URL}/xana-genesis-chat/search-nft`;
    let data = {
      owner: address,
      searchValue: text
    };

    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(result => {
        dispatch(searchLoadingSuccess(result));
        resolve(result);
      })
      .catch(err => {
        dispatch(searchLoadingFail(err));
        reject(err);
      });
  })

}
