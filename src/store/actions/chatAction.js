import { CHAT_NFT_COLLECTION_START, CHAT_NFT_COLLECTION_SUCCESS, CHAT_NFT_COLLECTION_FAIL, CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL } from '../types';
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
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTc4YzgyMjNmYjVjYmVmYTRkYzY1OSIsImlhdCI6MTY2Mjk4MjIzNCwiZXhwIjoxNjYzMDY4NjM0fQ.d3_O9leA4D_fhf9_RmBwv5hngaY2r4s3E1TKpSFNbJg'
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
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTc4YzgyMjNmYjVjYmVmYTRkYzY1OSIsImlhdCI6MTY2Mjk4MjIzNCwiZXhwIjoxNjYzMDY4NjM0fQ.d3_O9leA4D_fhf9_RmBwv5hngaY2r4s3E1TKpSFNbJg'
    }
  })
  .then(res => {
    console.log('GET-MY-DATA ----------- ', res);
  })
  .catch(err => console.log('Error : ', err))
  
}



