
import { CHAT_NFT_COLLECTION_START, CHAT_NFT_COLLECTION_SUCCESS, CHAT_NFT_COLLECTION_FAIL, CHAT_LOAD_START, CHAT_SUCCESS, CHAT_LOAD_FAIL, CHAT_OWNED_NFT_START, CHAT_OWNED_NFT_SUCCESS, CHAT_OWNED_NFT_FAIL  } from '../types';
import { chatLoadStart, chatLoadSuccess, chatLoadFail } from '../actions/chatAction';
import { ApiRequest } from '../../helpers/ApiRequest';

const initialState = {
    isChatLoading: false,
    chatSuccess: '',
    chatFail: '',
    chatNftCollectionLoading: false,
    chatNftCollectionList: [],
    chatNftCollectionFail: '',
    chatOwnedNftCollectionLoading: false,
    chatOwnedNftCollectionList: [],
    chatOwnedNftCollectionFail: '',
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case CHAT_NFT_COLLECTION_START:
            return { ...state, chatNftCollectionLoading: true };

        case CHAT_NFT_COLLECTION_SUCCESS:
            return { ...state, chatNftCollectionList: action.payload, chatNftCollectionLoading: false, chatNftCollectionFail: '' };

        case CHAT_NFT_COLLECTION_FAIL:
            return { ...state, chatNftCollectionFail: action.payload, chatNftCollectionLoading: false };

        case CHAT_LOAD_START:
            return { ...state, isChatLoading: true };

        case CHAT_SUCCESS:
            return { ...state, chatSuccess: action.payload, isChatLoading: false, chatFail: '' };

        case CHAT_LOAD_FAIL:
            return { ...state, chatFail: action.payload, isChatLoading: false };

        case CHAT_NFT_COLLECTION_START:
            return { ...state, chatOwnedNftCollectionLoading: true };

        case CHAT_NFT_COLLECTION_SUCCESS:
            return { ...state, chatOwnedNftCollectionList: action.payload, chatOwnedNftCollectionLoading: false, chatOwnedNftCollectionFail: '' };

        case CHAT_NFT_COLLECTION_FAIL:
            return { ...state, chatOwnedNftCollectionFail: action.payload, chatOwnedNftCollectionLoading: false };


        default:
            return state;
    }
}

export const getAiChat = (message, language) => (dispatch) => {
    return new Promise((resolve, reject) => {
        ApiRequest(`http://3.110.38.186:8081/xana-genesis-bot/?text=${message}&language=${language}`, 'GET', null, null)
            .then(response => {
                console.log('Reducer Response : ', response);
                if (response?.response) {
                    //dispatch(chatLoadStart());
                    // setTimeout(() => {
                    dispatch(chatLoadSuccess(response?.response));
                    resolve(response?.response);
                    //    }, 0);
                }
            })
            .catch(err => {
                console.log('Error : ', err);
                // dispatch(chatLoadFail(err));
                reject(err);
            });
    });
}
