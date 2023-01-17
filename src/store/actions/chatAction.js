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
} from '../types';
import sendRequest, {getAccessToken} from '../../helpers/AxiosApiRequest';
import RNFetchBlob from 'rn-fetch-blob';
import {convertImageToArrayBuffer} from '../../utils/uploadMediaS3';

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
    // const headers = {
    //   Authorization: `Bearer dfsdfsfsfsdfsddfsdfdjsldjflsjdlfj`,
    // };

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

//==================================Owned-Other==============================
// export const uploadBgImage =
export const uploadAIBgImage =
  (file, address, collections_address, token_id) => async dispatch => {
    // console.log(
    //   '🚀 ~ file: chatAction.js:355 ~ ',
    //   file,
    //   address,
    //   collections_address,
    //   token_id,
    // );
    let url = `https://prod-backend.xanalia.com/xana-genesis-chat/upload-s3`;
    const token = await getAccessToken('ACCESS_TOKEN');
    // const token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExNDEwMiwicm9sZSI6MSwidXNlcm5hbWUiOiIweDIzOGZkRkJiYkEwMjUwY0ExOTQzNDMyMTg5NUYwZGQ4MjA1RDYwQjYiLCJ3YWxsZXRUeXBlIjoxLCJub25jZSI6MCwiaWF0IjoxNjczODcyMjI1LCJleHAiOjE2NzM4NzU4MjV9.xOO7xWhP4MpQ0Th6DFtQOoCu-WQAflzt75BZclBII8Y';
    RNFetchBlob.fs.readFile(file.path, 'base64').then(async data => {
      var Buffer = require('buffer/').Buffer;
      const imageData = await Buffer.from(data, 'base64');
      console.log(
        '🚀 ~ file: chatAction.js:367 ~ RNFetchBlob.fs.readFile ~ imageData',
        imageData,
      );

      // let newPath = file.path.replace('file://', '');
      // const imageData = await convertImageToArrayBuffer(newPath);
      // formData.append('file', imageData);
      // formData.append('file', {
      //   uri: file.path,
      //   type: file.type,
      //   name: file.fileName,
      // });

      // const file = e.target.files[0];
      // if (file?.name?.match(/\.(jpg|jpeg|png)$/)) {
      //   const data = ownedData;
      //   const CollectionAddress = data?.filter(data => {
      //     return data.tokenId === chatUserData.token_id;
      //   });
      //   const formDataFileImg = new FormData();
      //   formDataFileImg.append('file', file);
      //   formDataFileImg.append('address', addresses);
      //   formDataFileImg.append('token_id', CollectionAddress[0].tokenId);
      //   formDataFileImg.append(
      //     'collections_address',
      //     CollectionAddress[0].collection.address,
      //   );
      // }

      let formData = new FormData();
      formData.append('file', file.image);
      formData.append('address', address);
      formData.append('token_id', token_id);
      formData.append('collections_address', collections_address);

      // const path = file.uri.replace('file://', '');
      // const Data1 = new FormData();
      // Data1.append('file', RNFetchBlob.wrap(path));
      // Data1.append('address', address);
      // Data1.append('token_id', token_id);
      // Data1.append('collections_address', collections_address);

      console.log('🚀 ~ file: chatAction.js:388 ~ ', file);

      try {
        const userProfileResponse = await sendRequest({
          url: url,
          method: 'POST',
          data: formData,
          headers: {
            // Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
        });
        console.log(
          '🚀 ~ file: chatAction.js:403 ~ RNFetchBlob.fs.readFile ~ userProfileResponse',
          userProfileResponse,
        );
        // var requestOptions = {
        //   method: 'POST',
        //   headers: {
        //     Authorization: 'Bearer ' + token,
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   body: formData,
        // };
        // fetch(
        //   'https://prod-backend.xanalia.com/xana-genesis-chat/upload-s3',
        //   requestOptions,
        // )
        //   .then(response => response.text())
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));
      } catch (error) {
        // dispatch(endLoadingImage());
        console.log('@@@ error ', error);
      }
    });
  };

// export const uploadAIBgImage = (
//   file,
//   address,
//   collections_address,
//   token_id,
// ) => {
//   return async (dispatch, getState) => {
//     // const image_url = await uploadBgImage(
//     //   file,
//     //   address,
//     //   collections_address,
//     //   token_id,
//     // );
//     const token = await getAccessToken('ACCESS_TOKEN');
//     console.log('🚀 ~ file: chatAction.js:491 ~ Start', token, image_url);
//     dispatch(getAIBackgroundImageStart());
//     let url = `https://prod-backend.xanalia.com/xana-genesis-chat/upload-background-image`;
//     sendRequest({
//       url,
//       method: 'POST',
//       data: {
//         address,
//         image_url:
//           'https://xana-genesis.s3.ap-southeast-1.amazonaws.com/1991-0x5b5cf41d9EC08D101ffEEeeBdA411677582c9448',
//         collections_address,
//         token_id,
//       },
//     })
//       .then(data => {
//         dispatch(getAIBackgroundImageSuccess(data));
//         console.log('🚀 ~ file: chatAction.js:510 ~ ~ data', data);
//       })
//       .catch(err => {
//         console.log('🚀 ~ file: chatAction.js:513 ~ return ~ err', err);
//         dispatch(getAIBackgroundImageFail());
//       });
//   };
// };

export const getAIBgImage = (address, collections_address, token_id) => {
  return (dispatch, getState) => {
    dispatch(getAIBackgroundImageStart());
    let url = `https://prod-backend.xanalia.com/xana-genesis-chat/get-background-image`;
    sendRequest({
      url,
      method: 'POST',
      data: {
        address,
        collections_address,
        token_id,
      },
    })
      .then(data => {
        dispatch(getAIBackgroundImageSuccess(data));
      })
      .catch(err => {
        console.log('🚀 ~ file: chatAction.js:538 ~ return ~ err', err);
        dispatch(getAIBackgroundImageFail());
      });
  };
};
