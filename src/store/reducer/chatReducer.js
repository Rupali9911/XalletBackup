
import { CHAT_OTHER_NFT_LOAD_START, CHAT_OTHER_NFT_LOAD_SUCCESS, CHAT_OTHER_NFT_LOAD_FAIL, CHAT_LOAD_START, CHAT_LOAD_SUCCESS, CHAT_LOAD_FAIL, CHAT_OWNED_NFT_START, CHAT_OWNED_NFT_SUCCESS, CHAT_OWNED_NFT_FAIL } from '../types';

const initialState = {
    isChatLoading: false,
    chatLoadSuccess: '',
    chatLoadFail: '',
    chatOtherNftCollectionLoading: false,
    chatOtherNftCollectionList: [],
    chatOtherNftCollectionFail: '',
    chatOwnedNftCollectionLoading: false,
    chatOwnedNftCollectionList: [],
    chatOwnedNftCollectionFail: '',
}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        case CHAT_LOAD_START:
            return { ...state, isChatLoading: true };

        case CHAT_LOAD_SUCCESS:
            return { ...state, chatLoadSuccess: action.payload, isChatLoading: false, chatLoadFail: '' };

        case CHAT_LOAD_FAIL:
            return { ...state, chatLoadFail: action.payload, isChatLoading: false };

        case CHAT_OTHER_NFT_LOAD_START:
            return { ...state, chatOtherNftCollectionLoading: true };

        case CHAT_OTHER_NFT_LOAD_SUCCESS:
            return { ...state, chatOtherNftCollectionList: action.payload, chatOtherNftCollectionLoading: false, chatOtherNftCollectionFail: '' };

        case CHAT_OTHER_NFT_LOAD_FAIL:
            return { ...state, chatOtherNftCollectionFail: action.payload, chatOtherNftCollectionLoading: false };

        case CHAT_OWNED_NFT_START:
            return { ...state, chatOwnedNftCollectionLoading: true };

        case CHAT_OWNED_NFT_SUCCESS:
            return { ...state, chatOwnedNftCollectionList: action.payload, chatOwnedNftCollectionLoading: false, chatOwnedNftCollectionFail: '' };

        case CHAT_OWNED_NFT_FAIL:
            return { ...state, chatOwnedNftCollectionFail: action.payload, chatOwnedNftCollectionLoading: false };


        default:
            return state;
    }
}
