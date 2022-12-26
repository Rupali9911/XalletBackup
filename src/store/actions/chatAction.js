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

  //================Other==============
  OTHER_LOAD_START,
  OTHER_LOAD_SUCCESS,
  OTHER_LOAD_FAIL,
  OTHER_LIST_RESET,
  OTHER_PAGE_CHANGE,

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
  (address, name, collectionAddress, locale, nftId, text, tokenId) =>
  (dispatch, getState) => {
    let bot_name = name?.split(' ').slice?.(1)?.[0]
      ? name?.split(' ').slice?.(1)?.[0]
      : name;
    const {reducerTabTitle} = getState().chatReducer;
    dispatch(chatLoadingStart(true));
    return new Promise((resolve, reject) => {
      let url = `https://prod-backend.xanalia.com/xana-genesis-chat/chat-bot-ai`;
      let data = {
        address,
        bot_name,
        collectionAddress,
        locale,
        nftId: nftId.toString(),
        text,
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
            dispatch(remainWordCountData(res?.remainWordLimit?.userWordLimit));
            resolve(res);
          } else {
            dispatch(chatLoadingSuccess(res));
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
  (page, address, tabTitle) => (dispatch, getState) => {
    dispatch(setTabTitle(tabTitle));
    const {ownerList, otherList} = getState().chatReducer;
    let url = `https://prod-backend.xanalia.com/xana-genesis-chat`;
    url = tabTitle === 'Owned' ? `${url}/my-data` : `${url}/other-data`;

    const data = {
      cursor: '',
      owner: address,
      page: page,
      limit: 50,
    };
    const headers = {
      Authorization: `Bearer dfsdfsfsfsdfsddfsdfdjsldjflsjdlfj`,
    };

    (tabTitle === 'Owned'
      ? sendRequest({
          url,
          method: 'POST',
          headers,
        })
      : sendRequest({
          url,
          method: 'POST',
          data,
        })
    )
      .then(response => {
        if (response) {
          let res = {
            nftTotalCount: response.count,
            ownerList: {},
            otherList: {},
          };
          if (tabTitle === 'Owned') {
            res.ownerList['ownerNFTS'] = ownerList.ownerNFTS.concat(
              response?.list,
            );
            dispatch(ownedNftLoadSuccess(res));
          } else {
            res.otherList['otherNFTs'] = otherList.otherNFTs.concat(
              response?.list,
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
    let url = `https://prod-backend.xanalia.com/xana-genesis-chat/search-nfts`;
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
        url: `https://prod-backend.xanalia.com/xana-genesis-chat/chat-bot-history`,
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
