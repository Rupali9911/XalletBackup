
import { CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL } from '../types';
import { chatLoadStart, chatLoadSuccess, chatLoadFail } from '../actions/chatAction';
import axios from 'axios';
import { ApiRequest } from '../../helpers/ApiRequest';

const initialState = {
    isChatLoading: false,
    chatSuccess: '',
    chatFail: '',
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {

        case CHAT_LOAD_START:
            return { ...state, isChatLoading: true };

        case CHAT_SUCCESS:
            return { ...state, chatSuccess: action.payload, isChatLoading: false, chatFail: '' };

        case CHAT_LOAD_FAIL:
            return { ...state, chatFail: action.payload, isChatLoading: false };

        default:
            return state;
    }
}

// export const getPersonalizeChat = () => (dispatch) => {
//     dispatch(chatLoadStart())
//     return new Promise((resolve, reject) => {
//     axios.get(`https://ai.xanalia.com/personalized_chatbot/?text=df&user_name=jon`)
//       .then((response) => {
//         console.log("🚀 ~ file: response", response);
//         dispatch(chatLoadSuccess(response?.data?.response));
//         resolve();
//       })
//       .catch((error) => {
//         console.log('Error : ', error);
//         dispatch(chatLoadFail(error))
//         reject();
//       });
//   })
// };


export const getPersonalizeChat = () => (dispatch) => {
    return new Promise((resolve, reject) => {
        dispatch(chatLoadStart());
      ApiRequest(`https://ai.xanalia.com/ml_tutor/?text=hello&user_name=jon`, 'GET', null, null)
        .then(response => {
            console.log('Reducer Response : ', response);
          if (response?.response)
          {
            dispatch(chatLoadSuccess(response?.response));
            resolve();
          }
        })
        .catch(err => {
            console.log('Error : ', err);
            dispatch(chatLoadFail(err));
            reject();
        });
    });
  }
