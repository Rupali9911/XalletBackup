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

  //=========Owned==================
  OWNED_LOAD_START,
  OWNED_LOAD_SUCCESS,
  OWNED_LOAD_FAIL,
  OWNED_LIST_RESET,
  OWNED_PAGE_CHANGE,
  OWNED_CURSOR_CHANGE,

  //================Other==============
  OTHER_LOAD_START,
  OTHER_LOAD_SUCCESS,
  OTHER_LOAD_FAIL,
  OTHER_LIST_RESET,
  OTHER_PAGE_CHANGE,
  OTHER_CURSOR_CHANGE,

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

//==============OWNED===================

export const ownedNftLoadStart = () => ({
  type: OWNED_LOAD_START,
});

export const ownedNftLoadSuccess = (data) => ({
  type: OWNED_LOAD_SUCCESS,
  payload: data,
});

export const ownedNftFail = (error) => ({
  type: OWNED_LOAD_FAIL,
  payload: error,
});

export const ownedNftListReset = () => ({
  type: OWNED_LIST_RESET,
});

export const ownedNftPageChange = (page) => ({
  type: OWNED_PAGE_CHANGE,
  payload: page
});

export const ownedNftCursorChange = (cursor) => ({
  type: OWNED_CURSOR_CHANGE,
  payload: cursor
});

//==============Other===================

export const otherNftLoadStart = () => ({
  type: OTHER_LOAD_START,
});

export const otherNftLoadSuccess = (data) => ({
  type: OTHER_LOAD_SUCCESS,
  payload: data
});

export const otherNftFail = (error) => ({
  type: OTHER_LOAD_FAIL,
  payload: error
});

export const otherNftListReset = () => ({
  type: OTHER_LIST_RESET,
});

export const otherNftPageChange = (page) => ({
  type: OTHER_PAGE_CHANGE,
  payload: page
});

export const otherNftCursorChange = (cursor) => ({
  type: OTHER_CURSOR_CHANGE,
  payload: cursor
});

//=====================SetTabTitle=====================

export const setTabTitle = (data) => ({
  type: CHAT_TAB_TITLE,
  payload: data
});

//=====================Chat=====================
export const getAiChat = (message, address, locale, name, tokenId) => (dispatch, getState) => {
  const { reducerTabTitle } = getState().chatReducer;
  dispatch(chatLoadingStart(true))
  return new Promise((resolve, reject) => {
    let url = `${NEW_BASE_URL}/xana-genesis-chat/chat-bot`;
    let data = {
      address,
      locale,
      bot_name: name,
      text: message,
      tokenId,
      is_owned: reducerTabTitle === 'Owned' ? true : false
    };
    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(res => {
        dispatch(chatLoadingStart(false))
        if (res?.data) {
          dispatch(chatLoadingSuccess(res?.data?.response));
          resolve(res?.data?.response);
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
export const getNftCollections = (page, address, cursor, tabTitle) => (dispatch, getState) => {
  dispatch(setTabTitle(tabTitle));
  const { ownerList, otherList } = getState().chatReducer;
  let url = `${NEW_BASE_URL}/xana-genesis-chat`;
  url = tabTitle === 'Owned' ? `${url}/get-my-data` : `${url}/get-other-data`;
  let limit = 100;

  let data = {
    cursor,
    owner: address,
    page,
  };
  if (tabTitle === 'Owned') {
    data.limit = limit;
  }

  sendRequest({
    url,
    method: 'POST',
    data,
  })
    .then(response => {
      let res = {
        nftTotalCount: response.total,
        nftCursor: response.cursor,
        ownerList: {},
        otherList: {},
      }
      if (tabTitle === 'Owned') {
        res.ownerList['ownerNFTS'] = ownerList.ownerNFTS.concat(response?.result);
        dispatch(ownedNftLoadSuccess(res));
      }
      else {
        res.otherList['otherNFTs'] = otherList.otherNFTs.concat(response?.result);
        dispatch(otherNftLoadSuccess(res));
      }
    })
    .catch(err => {
      console.log('Error : ', err);
      tabTitle === 'Owned' ? dispatch(ownedNftLoadSuccess([])) : dispatch(otherNftLoadSuccess([]));
    });
}

//=====================Search=====================
export const getSearchResult = (text, address) => (dispatch) => {
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
