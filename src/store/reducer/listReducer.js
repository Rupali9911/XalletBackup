import {
    LOAD_NFT_START,
    NFT_LIST_SUCCESS,
    NFT_LIST_FAIL,
    PAGE_CHANGE,
    NFT_LIST_UPDATE,
    MY_NFT_LOAD_FAIL,
    MY_NFT_LOAD_START,
    MY_NFT_LOAD_SUCCESS,
    MY_PAGE_CHANGE
} from '../types';

const initialState = {
    nftListLoading: false,
    myNftListLoading: false,
    nftList: [],
    myList: [],
    page: 1,
    myListPage: 1
}

export default function ListReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_NFT_START:
            return state = { ...state, nftListLoading: true };

        case NFT_LIST_SUCCESS:
            return state = { ...state, nftList: [...action.payload], nftListLoading: false };

        case NFT_LIST_UPDATE:
            return state = { ...state, nftList: [...action.payload] };

        case NFT_LIST_FAIL:
            return state = { ...state, nftListLoading: false };

        case PAGE_CHANGE:
            return state = { ...state, page: action.payload };

        case MY_PAGE_CHANGE:
            return state = { ...state, myListPage: action.payload };

        case MY_NFT_LOAD_START:
            return state = { ...state, myNftListLoading: true };

        case MY_NFT_LOAD_SUCCESS:
            return state = { ...state, myList: [...action.payload], myNftListLoading: false };

        case MY_NFT_LOAD_FAIL:
            return state = { ...state, myNftListLoading: false };

        default:
            return state;
    }
}