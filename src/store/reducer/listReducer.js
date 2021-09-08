import {
    LOAD_NFT_START,
    NFT_LIST_SUCCESS,
    NFT_LIST_FAIL,
    PAGE_CHANGE,
    NFT_LIST_RESET,
    NFT_LIST_UPDATE,
    ALL_ARTIST_SUCCESS
} from '../types';

const initialState = {
    nftListLoading: false,
    nftList: [],
    artistList: [],
    page: 1,
}

export default function ListReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_NFT_START:
            return state = { ...state, nftListLoading: true };

        case NFT_LIST_SUCCESS:
            return state = { ...state, nftList: [...state.nftList, ...action.payload], nftListLoading: false };

        case NFT_LIST_UPDATE:
            return state = { ...state, nftList: [...action.payload] };

        case NFT_LIST_RESET:
            return state = { ...state, nftList: [] };

        case NFT_LIST_FAIL:
            return state = { ...state, nftListLoading: false };

        case PAGE_CHANGE:
            return state = { ...state, page: action.payload };

        case ALL_ARTIST_SUCCESS:
            return stat = { ...state, artistList: action.payload };

        default:
            return state;
    }
}