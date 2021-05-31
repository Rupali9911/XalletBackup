import {
    TWOD_NFT_FAIL,
    TWOD_NFT_LIST_RESET,
    TWOD_NFT_START,
    TWOD_NFT_SUCCESS,
    TWOD_PAGE_CHANGE,
    TWOD_LIST_UPDATE
} from '../types';

const initialState = {
    twoDListLoading: false,
    twoDNftList: [],
    page: 1,
}

export default function TwoDReducer(state = initialState, action) {
    switch (action.type) {

        case TWOD_NFT_START:
            return state = { ...state, twoDListLoading: true };

        case TWOD_NFT_SUCCESS:
            return state = { ...state, twoDNftList: [...state.twoDNftList, ...action.payload], twoDListLoading: false };

        case TWOD_LIST_UPDATE:
            return state = { ...state, twoDNftList: [...action.payload] };

        case TWOD_NFT_LIST_RESET:
            return state = { ...state, twoDNftList: [] };

        case TWOD_NFT_FAIL:
            return state = { ...state, twoDListLoading: false };

        case TWOD_PAGE_CHANGE:
            return state = { ...state, page: action.payload };

        default:
            return state;
    }
}