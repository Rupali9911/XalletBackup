import {
    NEW_NFT_LOAD_START,
    NEW_NFT_LOAD_SUCCESS,
    NEW_NFT_LOAD_FAIL,
    NEW_PAGE_CHANGE
} from '../types';

const initialState = {
    newNftListLoading: false,
    newNftList: [],
    newListPage: 1
}

export default function NewNFTListReducer(state = initialState, action) {
    switch (action.type) {

        case NEW_NFT_LOAD_START:
            return state = { ...state, newNftListLoading: true };

        case NEW_NFT_LOAD_SUCCESS:
            return state = { ...state, newNftList: [...action.payload], newNftListLoading: false };

        case NEW_NFT_LOAD_FAIL:
            return state = { ...state, newNftListLoading: false };

        case NEW_PAGE_CHANGE:
            return state = { ...state, newListPage: action.payload };

        default:
            return state;
    }
}