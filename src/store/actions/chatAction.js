import { CHAT_NFT_COLLECTION_START, CHAT_NFT_COLLECTION_SUCCESS, CHAT_NFT_COLLECTION_FAIL, CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL, CHAT_OWNED_NFT_START, CHAT_OWNED_NFT_SUCCESS, CHAT_OWNED_NFT_FAIL } from '../types';
import sendRequest from '../../helpers/AxiosApiRequest';
import { BASE_URL, NEW_BASE_URL } from '../../common/constants';

export const chatNftCollectionLoadStart = () => ({
  type: CHAT_NFT_COLLECTION_START,
});

export const chatNftCollectionLoadSuccess = (data) => ({
  type: CHAT_NFT_COLLECTION_SUCCESS,
  payload: data,
});

export const chatNftCollectionLoadFail = (error) => ({
  type: CHAT_NFT_COLLECTION_FAIL,
  payload: error,
});

export const chatLoadStart = () => ({
  type: CHAT_LOAD_START,
});

export const chatLoadSuccess = (data) => ({
  type: CHAT_SUCCESS,
  payload: data,
});

export const chatLoadFail = (error) => ({
  type: CHAT_LOAD_FAIL,
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

export const getOtherDataNft = (address) => (dispatch) => {
  
  let url = `${BASE_URL}/xanaGenesis/get-other-data`;

  console.log('URL:----------->', url)
  sendRequest({
    url,
    method: 'POST',
    data: {
      cursor: '',
      owner: '0x1a01d68dace26f59ad6ab114c6a0ef6a3b2ccb9e',
      // page: 1
    },
    headers:{
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGM3NTIxMzlmNmVjYzQ4NjUyM2VhNyIsImlhdCI6MTY2MzI0MjgxNCwiZXhwIjoxNjYzMzI5MjE0fQ.fIJNdM0D2leJXA7DPeLkKwoAzxckV0qS4vlemMCs97Y'
    }
  })
  .then(res => {
    let result = res?.data?.result;
    if(result.length > 0)
    {
      dispatch(chatNftCollectionLoadSuccess(result));
    }
  })
  .catch(err => console.log('Error : ', err))
  
}

export const getMyDataNft = () => (dispatch) => {
  
  let url = `${BASE_URL}/xanaGenesis/get-my-data`;

  console.log('URL:----------->', url)
  sendRequest({
    url,
    method: 'POST',
    data: {
      owner: '0x1a01d68dace26f59ad6ab114c6a0ef6a3b2ccb9e',
    },
    headers:{
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGM3NTIxMzlmNmVjYzQ4NjUyM2VhNyIsImlhdCI6MTY2MzI0MjgxNCwiZXhwIjoxNjYzMzI5MjE0fQ.fIJNdM0D2leJXA7DPeLkKwoAzxckV0qS4vlemMCs97Y'
    }
  })
  .then(res => {
    console.log('GET-MY-DATA ----------- ', res);
    let result = res?.userNfts?.result 
    dispatch(chatOwnedNftCollectionLoadSuccess(result));

  })
  .catch(err => console.log('Error : ', err))
  
}



