
import {
    //=====================Chatting=====================
    CHAT_LOAD_START,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAIL,

    //=====================Search=====================
    CHAT_SEARCH_LOAD_START,
    CHAT_SEARCH_LOAD_SUCCESS,
    CHAT_SEARCH_LOAD_FAIL,
    SEARCH_TEXT,

    //=====================Owned-Other=====================
    CHAT_NFT_LOAD_START,
    CHAT_NFT_LOAD_SUCCESS,
    CHAT_NFT_LOAD_FAIL,
    CHAT_NFT_LIST_RESET,
    CHAT_NFT_PAGE_CHANGE,
    CHAT_NFT_CURSOR_CHANGE,

    CHAT_TAB_TITLE
} from '../types';

const initialState = {
    //=====================Chatting=====================
    isChatLoading: false,
    chatLoadSuccess: '',
    chatLoadFail: '',

    //=====================Search=========================
    searchLoading: false,
    searchLoadSuccessList: [],
    searchLoadFail: '',
    searchText: '',

    //=====================Owned-Other=========================
    isNftLoading: false,
    nftList: {
        ownerNFTS: [],
        otherNFTs: []
    },
    nftLoadFail: '',
    nftPageChange: 1,
    nftTotalCount: 0,
    nftCursor: "",

    //=====================SetTabTitle=====================
    reducerTabTitle: 'Owned',
}

export default function chatReducer(state = initialState, action) {
    // console.log('============',state, action)
    switch (action.type) {
        //=====================Chatting=====================
        case CHAT_LOAD_START:
            return { ...state, isChatLoading: true };

        case CHAT_LOAD_SUCCESS:
            return { ...state, chatLoadSuccess: action.payload, isChatLoading: false, chatLoadFail: '' };

        case CHAT_LOAD_FAIL:
            return { ...state, chatLoadFail: action.payload, isChatLoading: false };

        //=====================Owned-Other=====================
        case CHAT_NFT_LOAD_START:
            return { ...state, isNftLoading: true };

        case CHAT_NFT_LOAD_SUCCESS:
            return {
                ...state,
                nftList: { ...state.nftList, ...action.payload.nftList },
                nftCursor: action.payload.nftCursor,
                nftTotalCount: action.payload.nftTotalCount,
                isNftLoading: false,
                nftLoadFail: '',
            };

        case CHAT_NFT_LOAD_FAIL:
            return { ...state, nftLoadFail: action.payload, isNftLoading: false };

        case CHAT_NFT_PAGE_CHANGE:
            return state = { ...state, nftPageChange: action.payload };

        case CHAT_NFT_LIST_RESET:
            return state = {
                ...state, nftList: {
                    ownerNFTS: [],
                    otherNFTs: []
                }
            };

        case CHAT_NFT_CURSOR_CHANGE:
            return state = { ...state, nftCursor: action.payload };

        //=====================Search=====================
        case CHAT_SEARCH_LOAD_START:
            return { ...state, searchLoading: true };

        case CHAT_SEARCH_LOAD_SUCCESS:
            return { ...state, searchLoadSuccessList: action.payload, searchLoading: false, searchLoadFail: '' };

        case CHAT_SEARCH_LOAD_FAIL:
            return { ...state, searchLoadFail: action.payload, searchLoading: false };

        case SEARCH_TEXT:
            return { ...state, searchText: action.payload };

        //=====================TabTitle===================== 

        case CHAT_TAB_TITLE:
            return { ...state, reducerTabTitle: action.payload };

        default:
            return state;
    }
}


