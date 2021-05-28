import {
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_NFT_LOAD_SUCCESS,
    MY_PAGE_CHANGE,
    MY_NFT_LOAD_RESET,
    FAVORITE_NFT_SUCCESS,
    FAVORITE_LIST_UPDATE
} from '../types';

const initialState = {
    myNftListLoading: false,
    myList: [],
    favorite: [],
    myListPage: 1
}

export default function MyNFTReducer(state = initialState, action) {
    switch (action.type) {

        case MY_PAGE_CHANGE:
            return state = { ...state, myListPage: action.payload };

        case MY_NFT_LOAD_START:
            return state = { ...state, myNftListLoading: true };

        case MY_NFT_LOAD_SUCCESS:
            return state = { ...state, myList: [...action.payload], myNftListLoading: false };

        case FAVORITE_NFT_SUCCESS:
            return state = { ...state, favorite: [...action.payload], myNftListLoading: false };

        case FAVORITE_LIST_UPDATE:
            return state = { ...state, favorite: [...action.payload] };

        case MY_NFT_LOAD_FAIL:
            return state = { ...state, myNftListLoading: false };

        case MY_NFT_LOAD_RESET:
            return state = { ...state, myList: [], favorite: [] };

        default:
            return state;
    }
}