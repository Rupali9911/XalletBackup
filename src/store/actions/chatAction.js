import { CHAT_OTHER_NFT_LOAD_START, CHAT_OTHER_NFT_LOAD_SUCCESS, CHAT_OTHER_NFT_LOAD_FAIL, CHAT_LOAD_START, CHAT_LOAD_SUCCESS, CHAT_LOAD_FAIL, CHAT_OWNED_NFT_START, CHAT_OWNED_NFT_SUCCESS, CHAT_OWNED_NFT_FAIL } from '../types';
import sendRequest from '../../helpers/AxiosApiRequest';
import { NEW_BASE_URL } from '../../common/constants';

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

export const chatOtherNftCollectionLoadStart = () => ({
  type: CHAT_OTHER_NFT_LOAD_START,
});

export const chatOtherNftCollectionLoadSuccess = (data) => ({
  type: CHAT_OTHER_NFT_LOAD_SUCCESS,
  payload: data,
});

export const chatOtherNftCollectionLoadFail = (error) => ({
  type: CHAT_OTHER_NFT_LOAD_FAIL,
  payload: error,
});

export const chatOwnedNftCollectionLoadStart = () => ({
  type: CHAT_OWNED_NFT_START,
});

export const chatOwnedNftCollectionLoadSuccess = (data) => ({
  type: CHAT_OWNED_NFT_SUCCESS,
  payload: data,
});

export const chatOwnedNftCollectionLoadFail = (error) => ({
  type: CHAT_OWNED_NFT_FAIL,
  payload: error,
});

//----------------------------------------------------------------------------

export const getAiChat = (message, address, name, tokenId) => (dispatch) => {
  dispatch(chatLoadingStart(true))
  return new Promise((resolve, reject) => {
    let url = `${NEW_BASE_URL}/xana-genesis-chat/chat-bot`; 
    let data = {
      address: address,
      bot_name: name,
      text: message,
      tokenId: tokenId
    };
    // dispatch(chatLoadingStart(true))
    sendRequest({
      url,
      method: 'POST',
      data,
    })
      .then(res => {
        dispatch(chatLoadingStart(false))
        if (res?.response) {
          dispatch(chatLoadingSuccess(res?.response));
          resolve(res?.response)
          // dispatch(chatLoadingStart(false));
        }
      })
      .catch(err => {
        dispatch(chatLoadFail(err));
        reject(err);
      })
  })
}

//---------------------------------------------------------

export const getOtherDataNft = (address) => (dispatch) => {
  let url = `${NEW_BASE_URL}/xana-genesis-chat/get-other-data`;
  let data = {
    cursor: '',
    owner: address,
    // page: 1
  };
  dispatch(chatOtherNftCollectionLoadStart(true));
  sendRequest({
    url,
    method: 'POST',
    data,
  })
    .then(list => {
      dispatch(chatOtherNftCollectionLoadStart(false));
      let result = list?.result;
      if (result.length > 0) {
        dispatch(chatOtherNftCollectionLoadSuccess(result));
      }
    })
    .catch(err => console.log('Error : ', err))

}
//----------------------------------
export const getSearchResult = (text, address) => (dispatch) => {
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
    .then(data => {
      console.log('Search Result : ', data);

    })
    .catch(err => console.log('Error : ', err))
}
