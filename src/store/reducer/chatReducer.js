import {
    //=====================Chatting=====================
    CHAT_LOAD_START,
    CHAT_LOAD_SUCCESS,
    CHAT_LOAD_FAIL,

    //=====================Search========================
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
    OWNED_CURSOR_CHANGE,

    //================Other==============
    OTHER_LOAD_START,
    OTHER_LOAD_SUCCESS,
    OTHER_LOAD_FAIL,
    OTHER_LIST_RESET,
    OTHER_PAGE_CHANGE,
    OTHER_CURSOR_CHANGE,

    //==============tabTitle===============
    CHAT_TAB_TITLE,

    //==============History================
    CHAT_BOT_HISTORY_LOADING,
    CHAT_BOT_HISTORY_SUCCESS,
    CHAT_BOT_HISTORY_FAIL,
    CHAT_BOT_HISTORY_PAGE_CHANGE,
    CHAT_BOT_HISTORY_NEXT_PAGE,

    //===========Remain Count==============
    CHAT_REMAIN_COUNT,

} from '../types';

const initialState = {
    //=====================Chatting=====================
    isChatLoading: false,
    chatLoadSuccess: '',
    chatLoadFail: '',

    //=====================Search=========================
    searchLoading: false,
    searchLoadSuccessList: [],
    searchList: {
        ownerNFTS: [],
        otherNFTs: []
    },
    searchLoadFail: '',
    searchText: '',

    //=========Owned=====================
    isOwnedLoading: false,
    ownerList: {
        ownerNFTS: []
    },
    ownedLoadFail: '',
    ownedPageChange: 1,
    ownedTotalCount: 0,
    ownedCursor: '',

    //================Other==============
    isOtherLoading: false,
    otherList: {
        otherNFTs: []
    },
    otherLoadFail: '',
    otherPageChange: 1,
    otherTotalCount: 0,
    otherCursor: '',

    //=====================SetTabTitle==========================
    reducerTabTitle: 'Owned',

    //====================ChatHistory===========================
    isHistoryLoading: false,
    chatHistoryList: [],
    chatHistoryFailed: '',
    chatHistoryPage: 1,
    historyTotal: 0,
    isHistoryNextPage: true,

    //======================== Remain Words ======================
    remainCount: ''

}

export default function chatReducer(state = initialState, action) {
    switch (action.type) {
        //=====================Chatting=====================
        case CHAT_LOAD_START:
            return { ...state, isChatLoading: true };

        case CHAT_LOAD_SUCCESS:
            return { ...state, chatLoadSuccess: action.payload, isChatLoading: false, chatLoadFail: '' };

        case CHAT_LOAD_FAIL:
            return { ...state, chatLoadFail: action.payload, isChatLoading: false };

        //================OWNED====================
        case OWNED_LOAD_START:
            return { ...state, isOwnedLoading: true };

        case OWNED_LOAD_SUCCESS:
            return {
                ...state,
                ownerList: { ...state.ownerList, ...action.payload.ownerList },
                ownedCursor: action.payload.nftCursor,
                ownedTotalCount: action.payload.nftTotalCount,
                isOwnedLoading: false,
                ownedLoadFail: '',
            };

        case OWNED_LOAD_FAIL:
            return { ...state, ownedLoadFail: action.payload, isOwnedLoading: false };

        case OWNED_PAGE_CHANGE:
            return state = { ...state, ownedPageChange: action.payload };

        case OWNED_LIST_RESET:
            return state = {
                ...state,
                ownerList: {
                    ownerNFTS: []
                },
            };

        case OWNED_CURSOR_CHANGE:
            return state = { ...state, ownedCursor: action.payload };

        //================OTHER====================
        case OTHER_LOAD_START:
            return { ...state, isOtherLoading: true };

        case OTHER_LOAD_SUCCESS:
            return {
                ...state,
                otherList: { ...state.otherList, ...action.payload.otherList },
                otherCursor: action.payload.nftCursor,
                otherTotalCount: action.payload.nftTotalCount,
                isOtherLoading: false,
                otherLoadFail: '',
            };

        case OTHER_LOAD_FAIL:
            return { ...state, otherLoadFail: action.payload, isOtherLoading: false };

        case OTHER_PAGE_CHANGE:
            return state = { ...state, otherPageChange: action.payload };

        case OTHER_LIST_RESET:
            return state = {
                ...state,
                otherList: {
                    otherNFTs: []
                },
            };

        case OTHER_CURSOR_CHANGE:
            return state = { ...state, otherCursor: action.payload };

        //=====================Search=====================
        case CHAT_SEARCH_LOAD_START:
            return { ...state, searchLoading: true };

        case CHAT_SEARCH_LOAD_SUCCESS:
            return {
                ...state,
                searchList: { ...state.searchList, ...action.payload.searchList },
                searchLoading: false,
                searchLoadFail: ''
            };

        case CHAT_SEARCH_LOAD_FAIL:
            return { ...state, searchLoadFail: action.payload, searchLoading: false };

        case SEARCH_TEXT:
            return { ...state, searchText: action.payload };

        //=====================TabTitle===================== 
        case CHAT_TAB_TITLE:
            return { ...state, reducerTabTitle: action.payload };

        //====================Chat History==================
        case CHAT_BOT_HISTORY_LOADING:
            return { ...state, isHistoryLoading: true };

        case CHAT_BOT_HISTORY_SUCCESS:
            return {
                ...state,
                chatHistoryList: { ...state.chatHistoryList, ...action.payload.chatHistoryList },
                isHistoryLoading: false,
                chatHistoryFailed: '',
            };

        case CHAT_BOT_HISTORY_FAIL:
            return { ...state, chatHistoryFailed: action.payload, isHistoryLoading: false };

        case CHAT_BOT_HISTORY_PAGE_CHANGE:
            return state = { ...state, chatHistoryPage: action.payload };


        case CHAT_BOT_HISTORY_NEXT_PAGE:
            return state = { ...state, isHistoryNextPage: action.payload };

        //======================== Remain Words====================
        case CHAT_REMAIN_COUNT:
            return { ...state, remainCount: action.payload };

        default:
            return state;
    }
}


