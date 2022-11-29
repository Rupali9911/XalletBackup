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

  //==============TabTitle================
  CHAT_TAB_TITLE,

  //===============History================
  CHAT_BOT_HISTORY_LOADING,
  CHAT_BOT_HISTORY_SUCCESS,
  CHAT_BOT_HISTORY_FAIL,
  CHAT_BOT_HISTORY_PAGE_CHANGE,
  CHAT_BOT_HISTORY_NEXT_PAGE,

  //=============Reamin Count==============
  CHAT_REMAIN_COUNT,
} from '../types';
import sendRequest from '../../helpers/AxiosApiRequest';
import {NEW_BASE_URL} from '../../common/constants';

//=====================Chat=====================
export const chatLoadingStart = data => ({
  type: CHAT_LOAD_START,
  payload: data,
});

export const chatLoadingSuccess = data => ({
  type: CHAT_LOAD_SUCCESS,
  payload: data,
});

export const chatLoadFail = error => ({
  type: CHAT_LOAD_FAIL,
  payload: error,
});

//=====================Search=====================
export const searchLoadingStart = data => ({
  type: CHAT_SEARCH_LOAD_START,
  payload: data,
});

export const searchLoadingSuccess = data => ({
  type: CHAT_SEARCH_LOAD_SUCCESS,
  payload: data,
});

export const searchLoadingFail = error => ({
  type: CHAT_SEARCH_LOAD_FAIL,
  payload: error,
});

export const searchText = data => ({
  type: SEARCH_TEXT,
  payload: data,
});

//==============OWNED===================

export const ownedNftLoadStart = () => ({
  type: OWNED_LOAD_START,
});

export const ownedNftLoadSuccess = data => ({
  type: OWNED_LOAD_SUCCESS,
  payload: data,
});

export const ownedNftFail = error => ({
  type: OWNED_LOAD_FAIL,
  payload: error,
});

export const ownedNftListReset = () => ({
  type: OWNED_LIST_RESET,
});

export const ownedNftPageChange = page => ({
  type: OWNED_PAGE_CHANGE,
  payload: page,
});

export const ownedNftCursorChange = cursor => ({
  type: OWNED_CURSOR_CHANGE,
  payload: cursor,
});

//==============Other===================

export const otherNftLoadStart = () => ({
  type: OTHER_LOAD_START,
});

export const otherNftLoadSuccess = data => ({
  type: OTHER_LOAD_SUCCESS,
  payload: data,
});

export const otherNftFail = error => ({
  type: OTHER_LOAD_FAIL,
  payload: error,
});

export const otherNftListReset = () => ({
  type: OTHER_LIST_RESET,
});

export const otherNftPageChange = page => ({
  type: OTHER_PAGE_CHANGE,
  payload: page,
});

export const otherNftCursorChange = cursor => ({
  type: OTHER_CURSOR_CHANGE,
  payload: cursor,
});

//=====================SetTabTitle=====================

export const setTabTitle = data => ({
  type: CHAT_TAB_TITLE,
  payload: data,
});

//=========================CHATBOTHISTORY====================

export const chatHistoryLoading = () => ({
  type: CHAT_BOT_HISTORY_LOADING,
});

export const chatHistorySuccess = data => ({
  type: CHAT_BOT_HISTORY_SUCCESS,
  payload: data,
});

export const chatHistoryFail = error => ({
  type: CHAT_BOT_HISTORY_FAIL,
  payload: error,
});

export const ChatHistoryPageChange = page => ({
  type: CHAT_BOT_HISTORY_PAGE_CHANGE,
  payload: page,
});

export const chatHistoryNextPage = nextPage => ({
  type: CHAT_BOT_HISTORY_NEXT_PAGE,
  payload: nextPage,
});

//===================Set Remaining Words============================
export const remainWordCountData = count => ({
  type: CHAT_REMAIN_COUNT,
  payload: count,
});

//=====================Chat=====================
export const getAiChat =
  (message, address, locale, name, tokenId) => (dispatch, getState) => {
    let botName = name?.split(' ').slice?.(1)?.[0]
      ? name?.split(' ').slice?.(1)?.[0]
      : name;
    const {reducerTabTitle} = getState().chatReducer;
    dispatch(chatLoadingStart(true));
    return new Promise((resolve, reject) => {
      let url = `${NEW_BASE_URL}/xana-genesis-chat/chat-bot`;
      let data = {
        address,
        locale,
        bot_name: botName,
        text: message,
        tokenId,
        is_owned: reducerTabTitle === 'Owned' ? true : false,
      };
      sendRequest({
        url,
        method: 'POST',
        data,
      })
        .then(res => {
          dispatch(chatLoadingStart(false));
          if (res?.data) {
            dispatch(chatLoadingSuccess(res));
            dispatch(remainWordCountData(res?.remainWordLimit));
            resolve(res);
          }
        })
        .catch(err => {
          dispatch(chatLoadFail(err));
          reject(err);
        });
    });
  };

//==================================Owned-Other==============================
export const getNftCollections =
  (page, address, cursor, tabTitle) => (dispatch, getState) => {
    dispatch(setTabTitle(tabTitle));
    const {ownerList, otherList, reducerTabTitle} = getState().chatReducer;
    let url = `${NEW_BASE_URL}/xana-genesis-chat`;
    url = tabTitle === 'Owned' ? `${url}/get-my-data` : `${url}/get-other-data`;

    let data = {
      cursor,
      owner: address,
      page,
      limit: 30,
    };
    // if (tabTitle === 'Owned') {
    //   data.limit = limit;
    // }

    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(response => {
        if (response?.result) {
          let res = {
            nftTotalCount: response.total,
            nftCursor: response.cursor,
            ownerList: {},
            otherList: {},
          };
          if (tabTitle === 'Owned') {
            res.ownerList['ownerNFTS'] = ownerList.ownerNFTS.concat(
              response?.result,
            );
            dispatch(ownedNftLoadSuccess(res));
          } else {
            res.otherList['otherNFTs'] = otherList.otherNFTs.concat(
              response?.result,
            );
            dispatch(otherNftLoadSuccess(res));
          }
        } else {
          tabTitle === 'Owned'
            ? dispatch(ownedNftLoadSuccess([]))
            : dispatch(otherNftLoadSuccess([]));
        }
      })
      .catch(err => {
        console.log('Error : ', err);
        tabTitle === 'Owned'
          ? dispatch(ownedNftLoadSuccess([]))
          : dispatch(otherNftLoadSuccess([]));
      });
  };

//=====================Search=====================
export const getSearchResult = (text, address) => dispatch => {
  return new Promise((resolve, reject) => {
    let url = `${NEW_BASE_URL}/xana-genesis-chat/search-nft`;
    let data = {
      owner: address,
      searchValue: text,
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
  });
};

export const getChatBotHistory =
  (page, address, tokenId) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let limit = 5;
      sendRequest({
        url: `${NEW_BASE_URL}/xana-genesis-chat/chat-bot-history`,
        method: 'GET',
        params: {
          page,
          limit,
          address,
          tokenId,
        },
      })
        .then(res => {
          if (limit > res.length) {
            dispatch(chatHistoryNextPage(false));
          } else {
            dispatch(chatHistoryNextPage(true));
          }
          dispatch(chatHistorySuccess(res));
          resolve(res);
        })
        .catch(err => {
          dispatch(chatHistoryFail(err));
          reject(err);
        });
    });
  };
