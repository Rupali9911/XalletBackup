
import { CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL } from '../types';
import { chatLoadStart, chatLoadSuccess, chatLoadFail } from '../actions/chatAction';
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

export const getAiChat = (message,language) => (dispatch) => {
    return new Promise((resolve, reject) => {
      ApiRequest(`http://3.110.38.186:8081/xana-genesis-bot/?text=${message}&language=${language}`, 'GET', null, null)
        .then(response => {
            console.log('Reducer Response : ', response);
          if (response?.response)
          {
            dispatch(chatLoadStart());
            setTimeout(() => {
                dispatch(chatLoadSuccess(response?.response));
                resolve(response?.response);
              }, 0);
           
          }
        })
        .catch(err => {
            console.log('Error : ', err);
            dispatch(chatLoadFail(err));
            reject(err);
        });
    });
  }
