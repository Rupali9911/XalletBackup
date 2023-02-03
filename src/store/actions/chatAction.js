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
  GET_AI_BG_IMAGE_START,
  GET_AI_BG_IMAGE_SUCCESS,
  GET_AI_BG_IMAGE_FAIL,
  GET_AI_BG_IMAGE_RESET,
  CHAT_AI_DATA_UPDATE,
} from '../types';
import sendRequest, {getAccessToken} from '../../helpers/AxiosApiRequest';

//=====================Xana Chat Base Url=====================
const xana_base_url = `https://prod-backend.xanalia.com/xana-genesis-chat`;

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

//=========================CHAT BOT BG IMAGE====================
export const getAIBackgroundImageStart = () => ({
  type: GET_AI_BG_IMAGE_START,
});

export const getAIBackgroundImageSuccess = data => ({
  type: GET_AI_BG_IMAGE_SUCCESS,
  payload: data,
});

export const getAIBackgroundImageFail = error => ({
  type: GET_AI_BG_IMAGE_FAIL,
  payload: error,
});

export const getAIBackgroundImageReset = () => ({
  type: GET_AI_BG_IMAGE_RESET,
});

export const aiMessageUpdate = data => ({
  type: CHAT_AI_DATA_UPDATE,
  payload: data,
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
      const { reducerTabTitle } = getState().chatReducer;
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
    let url =
      tabTitle === 'Owned'
        ? `${xana_base_url}/my-data`
        : `${xana_base_url}/other-data`;

    const data = {
      cursor: '',
      owner: address,
      page: page,
      limit: 50,
    };

    (tabTitle === 'Owned'
      ? sendRequest({
        url,
        method: 'POST',
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
        tabTitle === 'Owned'
          ? dispatch(ownedNftLoadSuccess([]))
          : dispatch(otherNftLoadSuccess([]));
      });
  };

//=====================Search=====================
export const getSearchResult = (text, address) => dispatch => {
  return new Promise((resolve, reject) => {
    let url = `${xana_base_url}/search-nfts`;
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
        url: `${xana_base_url}/chat-bot-history`,
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

//================================== Owned APIs==============================
export const uploadAIBgImage = 
  (file, collections_address, token_id) => async (dispatch, getState) => {
    dispatch(getAIBackgroundImageStart());

    let url = `${xana_base_url}/upload-s3`;
    const {address} = getState().UserReducer?.userData?.userWallet;
    const token = await getAccessToken('ACCESS_TOKEN');

    const imageData = {
      name: file.fileName,
      type: file.type,
      uri:
        Platform.OS === 'android'
          ? file.path
          : file.path.replace('file://', ''),
    };
    const formData = new FormData();
    formData.append('address', address);
    formData.append('token_id', token_id);
    formData.append('collections_address', collections_address);
    formData.append('file', imageData);

    sendRequest({
      url: url,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        console.log('🚀 ~ file: uploadAIBgImage.js:383 ~ res', res);
        const data = {
          address,
          image_url: res?.url,
          collections_address,
          token_id,
        };

        dispatch(uploadAIBgImageData(data));
      })
      .catch(err => {
        console.log('🚀 ~ file: chatAction.js:388 ~ err', err);
        dispatch(getAIBackgroundImageFail());
      });
  };

export const uploadAIBgImageData = data => {
  return async (dispatch, getState) => {
    const token = await getAccessToken('ACCESS_TOKEN');
    let url = `${xana_base_url}/upload-background-image`;
    sendRequest({
      url,
      method: 'POST',
      data: data,
    })
      .then(res => {
        dispatch(getAIBackgroundImageSuccess(res));
        dispatch(
          aiMessageUpdate({
            bg_message: 'Successfully uploaded',
          }),
        );
        console.log('🚀 ~ file: uploadAIBgImageData.js:425 ~ ~ res', res);
      })
      .catch(err => {
        console.log('🚀 ~ file: chatAction.js:428 ~ err', err);
        dispatch(getAIBackgroundImageFail());
      });
  };
};

export const getAIBgImage = (address, collections_address, token_id) => {
  return (dispatch, getState) => {
    dispatch(getAIBackgroundImageStart());
    let url = `${xana_base_url}/get-background-image`;
    sendRequest({
      url,
      method: 'POST',
      data: {
        address,
        collections_address,
        token_id,
      },
    })
      .then(res => {
        console.log('🚀 ~ file: getBackgroundImage.js:457 ~ res', res);
        dispatch(getAIBackgroundImageSuccess(res));
      })
      .catch(err => {
        console.log('🚀 ~ file: chatAction.js:451 ~ err', err);
        dispatch(getAIBackgroundImageFail());
      });
  };
};

export const chatBotUpdate = (botName, tokenId, previous_msg, update_msg) => {
  return (dispatch, getState) => {
    const {language_name} = getState().LanguageReducer?.selectedLanguageItem;
    const {address} = getState().UserReducer?.userData?.userWallet;
    let bot_name = botName?.split(' ').slice?.(1)?.[0]
      ? botName?.split(' ').slice?.(1)?.[0]
      : botName;
    let url = `${xana_base_url}/chat-bot-update`;
    sendRequest({
      url,
      method: 'POST',
      data: {
        address,
        bot_name,
        locale: language_name,
        text: previous_msg,
        tokenId,
        update_msg,
      },
    })
      .then(res => {
        console.log('🚀 ~ file: chatAction.js:550 ~ return ~ res', res);
        dispatch(remainWordCountData(res?.remainWordLimit?.userWordLimit));
        dispatch(
          aiMessageUpdate({
            msg_update: 'Message updated successfully',
          }),
        );
      })
      .catch(err => {
        console.log('🚀 ~ file: chatAction.js:538 ~ return ~ err', err);
      });
  };
};
